import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import Botao from '../components/Botao';
import PerfilUsuarioModal from '../components/PerfilUsuarioModal';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import Candidaturas from '../components/Candidaturas';
import MembrosProjeto from '../components/MembrosProjeto';
import { FiX } from 'react-icons/fi';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    query,
    where,
} from 'firebase/firestore';
import Modal from '../components/Modal';
import TemCertezaModal from '../components/TemCertezaModal';

const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

const Label = styled.label`
    margin-bottom: 8px;
    font-size: 20px;
    font-weight: 600;
    color: #7c2256;
    margin: 5px;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
`;

const Textarea = styled.textarea`
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
`;

const Container = styled.div`
    padding: 20px;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ColunasContainer = styled.div`
    display: flex;
    gap: 30px;
    margin-top: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ColunaEsquerda = styled.div`
    flex: 2; // Ocupa 2/3 do espaço
`;

const ColunaDireita = styled.div`
    flex: 1; // Ocupa 1/3 do espaço
`;

const SecaoExcluir = styled.div`
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
    text-align: center;
`;

const Select = styled.select`
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    width: 100%;
`;

const AutoCompleteWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const SugestoesContainer = styled.ul`
    position: absolute;
    width: 100%;
    top: 100%;
    margin-top: 2px;
    left: 0;
    z-index: 2001;
    background-color: #ffffff;
    border: 1px solid #eee;
    border-radius: 8px;
    max-height: 150px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 0;
    list-style: none;
`;

const SugestaoItem = styled.li`
    padding: 10px 15px;
    cursor: pointer;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const TagsInputContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
    min-height: 28px;
`;

const Tag = styled.div`
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#aed9f4' : '#ffcced'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0')};
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;

    /* Estilo para o ícone de remover a tag */
    svg {
        cursor: pointer;
        color: ${(props) =>
            props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0'};
    }
`;

const CamposLinha = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
`;

function GerenciarProjetoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [projeto, setProjeto] = useState(null);
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nomeEditavel, setNomeEditavel] = useState('');
    const [descricaoEditavel, setDescricaoEditavel] = useState('');
    const [statusEditavel, setStatusEditavel] = useState('');
    const [areaEditavel, setAreaEditavel] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [habilidadesEditaveis, setHabilidadesEditaveis] = useState([]);
    const [interessesEditaveis, setInteressesEditaveis] = useState([]);
    const [buscaHabilidade, setBuscaHabilidade] = useState('');
    const [buscaInteresse, setBuscaInteresse] = useState('');
    const [todasAsHabilidades, setTodasAsHabilidades] = useState([]);
    const [todosOsInteresses, setTodosOsInteresses] = useState([]);
    const [sugestoesH, setSugestoesH] = useState([]);
    const [sugestoesI, setSugestoesI] = useState([]);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tags'));
                const tagsDoBanco = querySnapshot.docs.map((doc) => doc.data());
                setTodasAsHabilidades(
                    tagsDoBanco.filter((tag) => tag.tipo === 'habilidade')
                );
                setTodosOsInteresses(
                    tagsDoBanco.filter((tag) => tag.tipo === 'interesse')
                );
            } catch (error) {
                console.error('Erro ao buscar tags:', error);
                setError('Não foi possível carregar as sugestões de tags.');
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const buscarDados = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const projetoRef = doc(db, 'projetos', id);
                const projetoSnap = await getDoc(projetoRef);

                if (projetoSnap.exists()) {
                    const dadosProjeto = projetoSnap.data();
                    setProjeto({ id: projetoSnap.id, ...dadosProjeto });
                    setNomeEditavel(dadosProjeto.nome || '');
                    setDescricaoEditavel(dadosProjeto.descricao || '');
                    setStatusEditavel(dadosProjeto.status || '');
                    setAreaEditavel(dadosProjeto.area || '');
                    setHabilidadesEditaveis(dadosProjeto.habilidades || []);
                    setInteressesEditaveis(dadosProjeto.interesses || []);
                } else {
                    setError('Projeto não encontrado.');
                    setLoading(false);
                    return;
                }

                const candidaturasRef = collection(
                    db,
                    'projetos',
                    id,
                    'candidaturas'
                );
                const candidaturasSnap = await getDocs(candidaturasRef);
                const listaCandidaturas = candidaturasSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCandidaturas(listaCandidaturas);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError(
                    'Ocorreu um erro ao carregar as informações do projeto.'
                );
            } finally {
                setLoading(false);
            }
        };

        buscarDados();
    }, [id]);

    const handleSalvar = async (evento) => {
        evento.preventDefault();
        setIsSaving(true);
        try {
            const projetoRef = doc(db, 'projetos', id);
            await updateDoc(projetoRef, {
                nome: nomeEditavel,
                descricao: descricaoEditavel,
                status: statusEditavel,
                area: areaEditavel,
                habilidades: habilidadesEditaveis,
                interesses: interessesEditaveis,
            });
            alert('Projeto atualizado com sucesso!');
            navigate('/dashboard/meus-projetos');
        } catch (err) {
            console.error('Erro ao atualizar o projeto!');
            alert('ERRO, ALTERAÇÕES NÃO FORAM SALVAS!!!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBuscaHabilidadeChange = (e) => {
        const valor = e.target.value;
        setBuscaHabilidade(valor);
        if (valor) {
            setSugestoesH(
                todasAsHabilidades.filter(
                    (h) =>
                        h.nome.toLowerCase().includes(valor.toLowerCase()) &&
                        !habilidadesEditaveis.includes(h.nome)
                )
            );
        } else {
            setSugestoesH([]);
        }
    };

    const adicionarHabilidade = (nome) => {
        if (nome && !habilidadesEditaveis.includes(nome)) {
            setHabilidadesEditaveis([...habilidadesEditaveis, nome]);
        }
        setBuscaHabilidade('');
        setSugestoesH([]);
    };

    const removerHabilidade = (nome) => {
        setHabilidadesEditaveis(habilidadesEditaveis.filter((h) => h !== nome));
    };

    const handleBuscaInteresseChange = (e) => {
        const valor = e.target.value;
        setBuscaInteresse(valor);
        if (valor) {
            setSugestoesI(
                todosOsInteresses.filter(
                    (i) =>
                        i.nome.toLowerCase().includes(valor.toLowerCase()) &&
                        !interessesEditaveis.includes(i.nome)
                )
            );
        } else {
            setSugestoesI([]);
        }
    };

    const adicionarInteresse = (nome) => {
        if (nome && !interessesEditaveis.includes(nome)) {
            setInteressesEditaveis([...interessesEditaveis, nome]);
        }
        setBuscaInteresse('');
        setSugestoesI([]);
    };

    const removerInteresse = (nome) => {
        setInteressesEditaveis(interessesEditaveis.filter((i) => i !== nome));
    };

    const handleVerPerfil = async (candidato) => {
        const userRef = doc(db, 'users', candidato.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            setCandidatoSelecionado({ ...candidato, ...userSnap.data() });
        } else {
            console.error('Perfil do candidato não encontrado!');
            setCandidatoSelecionado(candidato);
        }
    };

    const handleAceitar = async (candidatoParaAceitar) => {
        setIsActionLoading(true);
        try {
            const projetoRef = doc(db, 'projetos', id);
            const candidaturaRef = doc(
                db,
                'projetos',
                id,
                'candidaturas',
                candidatoParaAceitar.id
            );

            await updateDoc(projetoRef, {
                participantes: arrayUnion({
                    uid: candidatoParaAceitar.userId,
                    nome: candidatoParaAceitar.nome,
                    sobrenome: candidatoParaAceitar.sobrenome,
                }),
                participantIds: arrayUnion(candidatoParaAceitar.userId),
            });

            const conversasRef = collection(db, 'conversas');
            const q = query(conversasRef, where('projetoId', '==', id));
            const conversaSnapshot = await getDocs(q);

            if (!conversaSnapshot.empty) {
                const conversaDoc = conversaSnapshot.docs[0];
                const conversaRef = doc(db, 'conversas', conversaDoc.id);
                await updateDoc(conversaRef, {
                    participantes: arrayUnion(candidatoParaAceitar.userId),
                    participantesInfo: arrayUnion({
                        uid: candidatoParaAceitar.userId,
                        nome: candidatoParaAceitar.nome,
                        sobrenome: candidatoParaAceitar.sobrenome,
                    }),
                    // inicializar a contagem de mensagens não lidas para o novo membro
                    [`unreadCounts.${candidatoParaAceitar.userId}`]: 0,
                });
            }

            await deleteDoc(candidaturaRef);

            setCandidaturas(
                candidaturas.filter((c) => c.id !== candidatoParaAceitar.id)
            );
            setProjeto((prevProjeto) => ({
                ...prevProjeto,
                participantes: [
                    ...prevProjeto.participantes,
                    {
                        uid: candidatoParaAceitar.userId,
                        nome: candidatoParaAceitar.nome,
                        sobrenome: candidatoParaAceitar.sobrenome,
                    },
                ],
                participantIds: [
                    ...prevProjeto.participantIds,
                    candidatoParaAceitar.userId,
                ],
            }));

            setCandidatoSelecionado(null);
            alert(`${candidatoParaAceitar.nome} foi adicionado(a) ao projeto!`);
        } catch (err) {
            console.error('Erro ao aceitar candidato:', err);
            alert('Ocorreu um erro ao aceitar a candidatura.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRejeitar = async (candidatoParaRejeitar) => {
        setIsActionLoading(true);
        try {
            const candidaturaRef = doc(
                db,
                'projetos',
                id,
                'candidaturas',
                candidatoParaRejeitar.id
            );

            await deleteDoc(candidaturaRef);

            setCandidaturas(
                candidaturas.filter((c) => c.id !== candidatoParaRejeitar.id)
            );
            setCandidatoSelecionado(null);
            alert('Candidatura rejeitada com sucesso.');
        } catch (err) {
            console.error('Erro ao rejeitar candidato:', err);
            alert('Ocorreu um erro ao rejeitar a candidatura.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRemoverMembro = async (membroParaRemover) => {
        if (
            !window.confirm(
                `Tem a certeza de que deseja remover ${membroParaRemover.nome} do projeto?`
            )
        ) {
            return;
        }

        try {
            const projetoRef = doc(db, 'projetos', id);

            await updateDoc(projetoRef, {
                participantes: arrayRemove(membroParaRemover),
                participantIds: arrayRemove(membroParaRemover.uid),
            });

            setProjeto((prevProjeto) => ({
                ...prevProjeto,
                participantes: prevProjeto.participantes.filter(
                    (p) => p.uid !== membroParaRemover.uid
                ),
            }));

            alert(`${membroParaRemover.nome} foi removido(a) do projeto.`);
        } catch (err) {
            console.error('Erro ao remover membro:', err);
            alert('Ocorreu um erro ao remover o membro.');
        }
    };

    // Abre o modal
    const handleExcluirProjeto = () => {
        setConfirmModalOpen(true);
    };

    // Ação que exclui o projeto
    const confirmarExclusao = async () => {
        setIsDeleting(true);
        try {
            const projetoRef = doc(db, 'projetos', id);
            await deleteDoc(projetoRef);
            alert('Projeto excluído com sucesso.');
            setConfirmModalOpen(false);
            navigate('/dashboard/meus-projetos');
        } catch (err) {
            console.error('Erro ao excluir projeto:', err);
            alert('Ocorreu um erro ao excluir o projeto.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <p>A carregar dados do projeto...</p>
            </Container>
        );
    }
    if (error) {
        return (
            <Container>
                <p style={{ color: 'red' }}>{error}</p>
            </Container>
        );
    }

    if (!projeto) {
        return (
            <Container>
                <p>Nenhum projeto para exibir.</p>
            </Container>
        );
    }

    return (
        <>
            <Formulario onSubmit={handleSalvar}>
                <DashboardHeader
                    titulo="Gerenciador de Projeto"
                    semFundo={false}
                    acoes={
                        <div>
                            <Botao
                                type="button"
                                variant="Cancelar"
                                onClick={() =>
                                    navigate('/dashboard/meus-projetos')
                                }
                                style={{ marginRight: '10px' }}
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                type="submit"
                                variant="Modal"
                                disabled={isSaving}
                            >
                                {isSaving ? 'A guardar...' : 'Salvar'}
                            </Botao>
                        </div>
                    }
                >
                    Edite informações, gerencie a equipe e avalie as
                    candidaturas.
                </DashboardHeader>

                <Container>
                    <ColunasContainer>
                        <ColunaEsquerda>
                            <InputGroup>
                                <Label htmlFor="nome-projeto">
                                    Nome do Projeto
                                </Label>
                                <Input
                                    id="nome-projeto"
                                    value={nomeEditavel}
                                    onChange={(e) =>
                                        setNomeEditavel(e.target.value)
                                    }
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label htmlFor="descricao-projeto">
                                    Descrição
                                </Label>
                                <Textarea
                                    id="descricao-projeto"
                                    value={descricaoEditavel}
                                    onChange={(e) =>
                                        setDescricaoEditavel(e.target.value)
                                    }
                                />
                            </InputGroup>
                            <Candidaturas
                                candidaturas={candidaturas}
                                onVerPerfil={handleVerPerfil}
                            />
                        </ColunaEsquerda>
                        <ColunaDireita>
                            <InputGroup>
                                <Label htmlFor="status-projeto">
                                    Status do Projeto
                                </Label>
                                <Select
                                    id="status-projeto"
                                    value={statusEditavel}
                                    onChange={(e) =>
                                        setStatusEditavel(e.target.value)
                                    }
                                >
                                    <option value="Novo">Novo</option>
                                    <option value="Em Andamento">
                                        Em Andamento
                                    </option>
                                    <option value="Concluído">Concluído</option>
                                </Select>
                            </InputGroup>
                            <InputGroup>
                                <Label htmlFor="area-projeto">
                                    Área Relacionada
                                </Label>
                                <Select
                                    id="area-projeto"
                                    value={areaEditavel}
                                    onChange={(e) =>
                                        setAreaEditavel(e.target.value)
                                    }
                                >
                                    <option value="Desenvolvimento de Software">
                                        Desenvolvimento de Software
                                    </option>
                                    <option value="Pesquisa Acadêmica">
                                        Pesquisa Acadêmica
                                    </option>
                                    <option value="Design/UX">Design/UX</option>
                                    <option value="Marketing">Marketing</option>
                                </Select>
                            </InputGroup>

                            {/* Interesse e habilidade lado a lado */}
                            <CamposLinha>
                                <InputGroup style={{ flex: 1 }}>
                                    <Label htmlFor="habilidades-projeto">
                                        Habilidades Relevantes
                                    </Label>
                                    <TagsInputContainer>
                                        <AutoCompleteWrapper>
                                            <Input
                                                id="habilidades-projeto"
                                                placeholder="Ex. FrontEnd, Pesquisa"
                                                value={buscaHabilidade}
                                                onChange={
                                                    handleBuscaHabilidadeChange
                                                }
                                            />
                                            {sugestoesH.length > 0 && (
                                                <SugestoesContainer>
                                                    {sugestoesH.map((s) => (
                                                        <SugestaoItem
                                                            key={s.nome}
                                                            onClick={() =>
                                                                adicionarHabilidade(
                                                                    s.nome
                                                                )
                                                            }
                                                        >
                                                            {s.nome}
                                                        </SugestaoItem>
                                                    ))}
                                                </SugestoesContainer>
                                            )}
                                        </AutoCompleteWrapper>
                                    </TagsInputContainer>
                                    <TagsContainer>
                                        {habilidadesEditaveis.map((h, i) => (
                                            <Tag key={i} $tipo="habilidade">
                                                {h}
                                                <FiX
                                                    onClick={() =>
                                                        removerHabilidade(h)
                                                    }
                                                />
                                            </Tag>
                                        ))}
                                    </TagsContainer>
                                </InputGroup>

                                <InputGroup style={{ flex: 1 }}>
                                    <Label htmlFor="interesses-projeto">
                                        Interesses do Projeto
                                    </Label>
                                    <TagsInputContainer>
                                        <AutoCompleteWrapper>
                                            <Input
                                                id="interesses-projeto"
                                                placeholder="Pesquisar interesse..."
                                                value={buscaInteresse}
                                                onChange={
                                                    handleBuscaInteresseChange
                                                }
                                            />
                                            {sugestoesI.length > 0 && (
                                                <SugestoesContainer>
                                                    {sugestoesI.map((s) => (
                                                        <SugestaoItem
                                                            key={s.nome}
                                                            onClick={() =>
                                                                adicionarInteresse(
                                                                    s.nome
                                                                )
                                                            }
                                                        >
                                                            {s.nome}
                                                        </SugestaoItem>
                                                    ))}
                                                </SugestoesContainer>
                                            )}
                                        </AutoCompleteWrapper>
                                    </TagsInputContainer>
                                    <TagsContainer>
                                        {interessesEditaveis.map((i, idx) => (
                                            <Tag key={idx} $tipo="interesse">
                                                {i}
                                                <FiX
                                                    onClick={() =>
                                                        removerInteresse(i)
                                                    }
                                                />
                                            </Tag>
                                        ))}
                                    </TagsContainer>
                                </InputGroup>
                            </CamposLinha>

                            <MembrosProjeto
                                projeto={projeto}
                                currentUserId={currentUser.uid}
                                onRemoverMembro={handleRemoverMembro}
                            />
                            <SecaoExcluir>
                                <Botao
                                    type="button"
                                    variant="excluir"
                                    onClick={handleExcluirProjeto}
                                >
                                    Excluir Projeto
                                </Botao>
                            </SecaoExcluir>
                        </ColunaDireita>
                    </ColunasContainer>
                </Container>
            </Formulario>

            {/* Modal de confirmação de exclusão */}
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                size="excluir-projeto"
            >
                <TemCertezaModal
                    titulo="Excluir Projeto?"
                    mensagem="Esta ação é permanente e não pode ser desfeita."
                    onConfirm={confirmarExclusao}
                    onClose={() => setConfirmModalOpen(false)}
                    loading={isDeleting}
                    textoConfirmar="Sim"
                    textoCancelar="Não"
                />
            </Modal>

            <PerfilUsuarioModal
                isOpen={!!candidatoSelecionado}
                onClose={() => setCandidatoSelecionado(null)}
                usuario={candidatoSelecionado} // A prop agora é 'usuario'
                onAceitar={handleAceitar}
                onRejeitar={handleRejeitar}
                loading={isActionLoading}
                tipo="candidato"
            />
        </>
    );
}

export default GerenciarProjetoPage;
