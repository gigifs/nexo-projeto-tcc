import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import Botao from '../components/Botao';
import PerfilUsuarioModal from '../components/PerfilUsuarioModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
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
    addDoc,
    setDoc
} from 'firebase/firestore';
import Modal from '../components/Modal';
import TemCertezaModal from '../components/TemCertezaModal';

const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.938rem;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-size: 1.188rem;
    font-weight: 600;
    color: #7c2256;
    margin: 0.313rem;
`;

const Input = styled.input`
    padding: 0.625rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    font-size: 1rem;
    min-height: 2.5rem;
`;

const Textarea = styled.textarea`
    padding: 0.625rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    font-size: 1rem;
    min-height: 6.25rem;
    resize: vertical;
    font-family: inherit;
`;

const Container = styled.div`
    padding: 1.25rem;
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
`;

const ColunasContainer = styled.div`
    display: flex;
    gap: 1.875rem;
    margin-top: 1.25rem;

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
    margin-top: 2.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid #e0e0e0;
    text-align: center;
`;

const Select = styled.select`
    padding: 0.625rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    font-size: 1rem;
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
    margin-top: 0.125rem;
    left: 0;
    z-index: 2001;
    background-color: #ffffff;
    border: 1px solid #eee;
    border-radius: 0.5rem;
    max-height: 9.375rem;
    overflow-y: auto;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    padding: 0;
    list-style: none;
`;

const SugestaoItem = styled.li`
    padding: 0.625rem 0.938rem;
    cursor: pointer;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const TagsInputContainer = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.625rem;
    min-height: 1.75rem;
`;

const Tag = styled.div`
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
    padding: 0.313rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    /* Estilo para o ícone de remover a tag */
    svg {
        cursor: pointer;
        color: ${(props) =>
            props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85'};
    }
`;

const CamposLinha = styled.div`
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const AcoesContainer = styled.div`
    display: flex;
    gap: 0.6rem; /* Controla o espaço entre os botões */
    flex-shrink: 0; /* Impede que este container seja "espremido" pelo título */

    @media (max-width: 768px) {
        justify-content: flex-end;
        width: 100%; /* Garante que o container ocupe a largura */
    }
`;

function GerenciarProjetoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    const { addToast } = useToast(); //hook para os toasts
    // Carregamento dos projetos e candidaturas é executado sempre
    // que o id da URL muda
    const [projeto, setProjeto] = useState(null);
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    //--------Estados dos dados do Projeto (formulário)
    // armazenam os valores dos inputs, 
    // mas são separados do objeto projeto original pra permitir edição sem salvar na hora
    const [nomeEditavel, setNomeEditavel] = useState('');
    const [descricaoEditavel, setDescricaoEditavel] = useState('');
    const [statusEditavel, setStatusEditavel] = useState('');
    const [areaEditavel, setAreaEditavel] = useState('');
    // Bloqueia o botão salvar durante a escrita no banco
    const [isSaving, setIsSaving] = useState(false);
    const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    //-------TAGS - CARREGAMENTO E AUTOCOMPLETE
    // arrays para as tags
    const [habilidadesEditaveis, setHabilidadesEditaveis] = useState([]);
    const [interessesEditaveis, setInteressesEditaveis] = useState([]);
    // Busca a coleção tags no firebase ao iniciar
    const [buscaHabilidade, setBuscaHabilidade] = useState('');
    const [buscaInteresse, setBuscaInteresse] = useState('');
    // Separa em todasAsHabilidades e todosOsInteresses
    // para alimentar as sugestões dos inputs
    const [todasAsHabilidades, setTodasAsHabilidades] = useState([]);
    const [todosOsInteresses, setTodosOsInteresses] = useState([]);
    const [sugestoesH, setSugestoesH] = useState([]);
    const [sugestoesI, setSugestoesI] = useState([]);
    // Controlam a visibilidade dos modais de confirmação
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [membroParaRemover, setMembroParaRemover] = useState(null);
    const [isRemoverMembroModalOpen, setIsRemoverMembroModalOpen] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);

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

                    setProjeto({ id: projetoSnap.id, 
                        ...dadosProjeto,
                        participantes: dadosProjeto.participantes || [],
                        participantIds: dadosProjeto.participantIds || []
                    });
                    
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

                // Adicionamos a query para filtrar apenas status 'pendente'
                const candidaturasRef = collection(
                    db,
                    'projetos',
                    id,
                    'candidaturas'
                );
                const qCandidaturas = query(candidaturasRef, where('status', '==', 'pendente'));
                const candidaturasSnap = await getDocs(qCandidaturas);
                // ---------------------

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
    }, [id, userData]);

    const handleSalvar = async (evento) => {
        evento.preventDefault();
        // validações antes de salvar
        if (!nomeEditavel.trim()) {
            return addToast('O nome do projeto é obrigatório.', 'error');
        }
        if (!descricaoEditavel.trim()) {
            return addToast('A descrição é obrigatória.', 'error');
        }

        setIsSaving(true); // bloqueia botão de salvar
        try {
            const projetoRef = doc(db, 'projetos', id);
            // atualiza apenas os campos editáveis no documento do projeto
            await updateDoc(projetoRef, {
                nome: nomeEditavel,
                descricao: descricaoEditavel,
                status: statusEditavel,
                area: areaEditavel,
                habilidades: habilidadesEditaveis,
                interesses: interessesEditaveis,
            });
            addToast('Projeto atualizado com sucesso!', 'success');
            navigate('/dashboard/meus-projetos'); // redireciona depois do sucesso
        } catch (err) {
            // tratamento de erro
            console.error('Erro ao atualizar o projeto!');
            addToast('ERRO, ALTERAÇÕES NÃO FORAM SALVAS!!!', 'error');
        } finally {
            setIsSaving(false); // libera UI/botão salvar
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

            // Busca os dados mais recentes do candidato para pegar a cor do avatar
            const userRef = doc(db, 'users', candidatoParaAceitar.userId);
            const userSnap = await getDoc(userRef);
            const dadosUser = userSnap.exists() ? userSnap.data() : {};
            // O operador || garante que se for undefined, nulo ou vazio, ele usa a cor padrão
            const corAvatarCandidato = dadosUser.avatarColor || '#0a528a';
            
            // autualiza o projeto:
            // adiciona o usuário aos arrays de participantes
            // participantes: dados visuais (nome e foto) para exibição rápida
            // participantIds: UIDs para regras de segurança e filtros
            await updateDoc(projetoRef, {
                participantes: arrayUnion({
                    uid: candidatoParaAceitar.userId,
                    nome: candidatoParaAceitar.nome,
                    sobrenome: candidatoParaAceitar.sobrenome,
                    avatarColor: corAvatarCandidato,
                }),
                participantIds: arrayUnion(candidatoParaAceitar.userId),
            });

            // SINCRONIZAÇÃO DO CHAT
            const conversasRef = collection(db, 'conversas');
            // verifica se ja existe um chat pra esse projeto
            const q = query(conversasRef, where('projetoId', '==', id));
            const conversaSnapshot = await getDocs(q);

            if (conversaSnapshot.empty) {
                // Cria nova conversa se não existir
                await addDoc(conversasRef, {
                    projetoId: id,
                    participantes: [
                        currentUser.uid,
                        candidatoParaAceitar.userId,
                    ],
                    participantesInfo: [
                        {
                            uid: currentUser.uid,
                            nome: currentUser.displayName || 'Dono',
                        },
                        {
                            uid: candidatoParaAceitar.userId,
                            nome: candidatoParaAceitar.nome,
                            sobrenome: candidatoParaAceitar.sobrenome,
                        },
                    ],
                    // Inicializa o contador de mensagens não lidas para 0
                    unreadCounts: {
                        [currentUser.uid]: 0,
                        [candidatoParaAceitar.userId]: 0,
                    },
                    criadoEm: new Date(),
                });
            } else {
                if (!conversaSnapshot.empty) {
                    const conversaDoc = conversaSnapshot.docs[0];
                    const conversaRef = doc(db, 'conversas', conversaDoc.id);
                    await updateDoc(conversaRef, {
                        participantes: arrayUnion(candidatoParaAceitar.userId),
                        participantesInfo: arrayUnion({
                            uid: candidatoParaAceitar.userId,
                            nome: candidatoParaAceitar.nome,
                            sobrenome: candidatoParaAceitar.sobrenome,
                            avatarColor: corAvatarCandidato,
                        }),
                        [`unreadCounts.${candidatoParaAceitar.userId}`]: 0,
                    });
                }
            }

            // ATUALIZAÇÃO DA CANDIDATURA: muda o status para aceito
            await updateDoc(candidaturaRef, { status: 'aceito' });

            await updateDoc(
                doc(db, "users", candidatoParaAceitar.userId, "minhasCandidaturas", id),
                { status: "aceito" }
            );

            setCandidaturas((prev) =>
                prev.filter((c) => c.id !== candidatoParaAceitar.id)
            );
            // Atualiza o estado local do projeto para refletir o novo membro
            // remove o candidato da lista local candidaturas e adiciona ao estado projeto.participantes
            // para que a tela atualize sem precisar recarregar do banco
            setProjeto((prevProjeto) => ({
                ...prevProjeto,
                participantes: [
                    ...prevProjeto.participantes,
                    {
                        uid: candidatoParaAceitar.userId,
                        nome: candidatoParaAceitar.nome,
                        sobrenome: candidatoParaAceitar.sobrenome,
                        avatarColor: corAvatarCandidato,
                    },
                ],
                participantIds: [
                    ...prevProjeto.participantIds,
                    candidatoParaAceitar.userId,
                ],
            }));

            setCandidatoSelecionado(null);
            addToast(
                `${candidatoParaAceitar.nome} foi adicionado(a) ao projeto e ao chat!`,
                'success'
            );
        } catch (err) {
            console.error('Erro ao aceitar candidato:', err);
            addToast('Ocorreu um erro ao aceitar a candidatura.', 'error');
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

            await updateDoc(candidaturaRef, { status: 'rejeitado' });

            await updateDoc(
                doc(db, "users", candidatoParaRejeitar.userId, "minhasCandidaturas", id),
                { status: "rejeitado" }
            );

            setCandidaturas(
                candidaturas.filter((c) => c.id !== candidatoParaRejeitar.id)
            );
            setCandidatoSelecionado(null);
            addToast('Candidatura rejeitada com sucesso.', 'success');
        } catch (err) {
            console.error('Erro ao rejeitar candidato:', err);
            addToast('Ocorreu um erro ao rejeitar a candidatura.', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleClickRemoverMembro = (membro) => {
        setMembroParaRemover(membro);
        setIsRemoverMembroModalOpen(true);
    };

    const confirmarRemoverMembro = async () => {
        if (!membroParaRemover) return;

        setIsRemovingMember(true);
        try {
            const projetoRef = doc(db, 'projetos', id);

            // Buscamos o projeto atual para filtrar manualmente
            const projetoSnap = await getDoc(projetoRef);
            
            if (projetoSnap.exists()) {
                const data = projetoSnap.data();
                
                // Filtramos a lista visual ignorando diferenças de dados (cor/nome), olhando só o UID
                const novosParticipantes = (data.participantes || []).filter(
                    (p) => p.uid !== membroParaRemover.uid
                );

                // Atualizamos o projeto com a lista limpa
                await updateDoc(projetoRef, {
                    participantes: novosParticipantes, // Substitui a lista inteira pela filtrada
                    participantIds: arrayRemove(membroParaRemover.uid), // Remove a permissão lógica
                });
            }

            // Busca a candidatura de forma segura (por query), independente do ID do documento
            const candidaturasRef = collection(db, 'projetos', id, 'candidaturas');
            const qCandidatura = query(candidaturasRef, where('userId', '==', membroParaRemover.uid));
            const querySnapshotCand = await getDocs(qCandidatura);

            if (!querySnapshotCand.empty) {
                // Se encontrou a candidatura, marca como removido
                const docRef = querySnapshotCand.docs[0].ref;
                await updateDoc(docRef, { 
                    status: 'removido',
                    dataAtualizacao: new Date() 
                });
            } else {
                // Se não existe candidatura (ex: membro adicionado manualmente no banco)
                console.log("Nenhuma candidatura encontrada para marcar como removida.");
            }

            // Atualiza o CHAT
            const conversasRef = collection(db, 'conversas');
            const qConversa = query(conversasRef, where('projetoId', '==', id));
            const conversaSnapshot = await getDocs(qConversa);

            if (!conversaSnapshot.empty) {
                const conversaDoc = conversaSnapshot.docs[0];
                const conversaRef = doc(db, 'conversas', conversaDoc.id);
                const chatData = conversaDoc.data();

                const novaListaParticipantesInfo = (chatData.participantesInfo || []).filter(
                    (p) => p.uid !== membroParaRemover.uid
                );

                await updateDoc(conversaRef, {
                    participantes: arrayRemove(membroParaRemover.uid),
                    participantesInfo: novaListaParticipantesInfo,
                });
            }

            addToast(`${membroParaRemover.nome} foi removido(a) do projeto.`, 'success');
            setIsRemoverMembroModalOpen(false);
            setMembroParaRemover(null);

        } catch (err) {
            console.error('Erro ao remover membro:', err);
            if (err.code === 'permission-denied') {
                addToast('Erro de permissão. Verifique as regras do Firestore.', 'error');
            } else {
                addToast('Ocorreu um erro ao remover o membro.', 'error');
            }
        } finally {
            setIsRemovingMember(false);
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
            const conversasRef = collection(db, 'conversas');
            const qConversa = query(conversasRef, where('projetoId', '==', id));
            const conversaSnapshot = await getDocs(qConversa);

            if (!conversaSnapshot.empty) {
                const conversaDoc = conversaSnapshot.docs[0];
                await deleteDoc(doc(db, 'conversas', conversaDoc.id));
                console.log('Conversa do projeto excluída.'); // Log para depuração
            } else {
                console.log('Nenhuma conversa encontrada para este projeto.'); // Log para depuração
            }

            const projetoRef = doc(db, 'projetos', id);
            await deleteDoc(projetoRef);

            const nomeCurto =
                nomeEditavel.length > 30
                    ? nomeEditavel.substring(0, 30) + '...'
                    : nomeEditavel;
            addToast(`Projeto "${nomeCurto}" excluído com sucesso.`, 'success');

            setConfirmModalOpen(false);
            navigate('/dashboard/meus-projetos');
        } catch (err) {
            console.error('Erro ao excluir projeto:', err);
            addToast('Ocorreu um erro ao excluir o projeto.', 'error');
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
                        <AcoesContainer>
                            <Botao
                                type="button"
                                variant="Cancelar"
                                onClick={() =>
                                    navigate('/dashboard/meus-projetos')
                                }
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
                        </AcoesContainer>
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
                                onRemoverMembro={handleClickRemoverMembro}
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

            <Modal
                isOpen={isRemoverMembroModalOpen}
                onClose={() => setIsRemoverMembroModalOpen(false)}
                size="excluir-projeto"
            >
                <TemCertezaModal
                    titulo="Remover Membro?"
                    mensagem={`Tem a certeza de que deseja remover ${membroParaRemover?.nome} do projeto?`}
                    onConfirm={confirmarRemoverMembro}
                    onClose={() => setIsRemoverMembroModalOpen(false)}
                    loading={isRemovingMember}
                    textoConfirmar="Remover"
                    textoCancelar="Cancelar"
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