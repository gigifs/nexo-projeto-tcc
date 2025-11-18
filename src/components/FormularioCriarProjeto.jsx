import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Botao from './Botao';
import { FaTimes } from 'react-icons/fa';
//Importação das ferramentas do Firebase
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    doc,
    setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
//Hook de Autenticação
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { gerarCorAleatoria } from '../utils/geradorCores';

const FormContainer = styled.form`
    padding: 1.25rem 2.5rem 1.875rem 2.5rem;
    background-color: #f5fafc;
`;

const Titulo = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    text-align: left;
    color: #030214;
    margin-top: 0.6rem;
    margin-bottom: 1.875rem;
`;

const CamposEmLinha = styled.div`
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const InputGroup = styled.div`
    margin-bottom: 1.25rem;
    position: relative;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1rem;
    color: #000000cc;
`;

const Input = styled.input`
    width: 100%;
    background-color: #f5fafc;
    padding: 0.75rem 0.94rem;
    font-size: 1rem;
    color: #000000cc;
    border: 1px solid #ced4da;
    border-radius: 0.6rem;
    outline: none;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
    box-sizing: border-box;

    &:focus {
        border-color: #e95be9ff;
        box-shadow: 0 0 0 3px #e95be748;
    }
`;

const Textarea = styled.textarea`
    width: 100%;
    background-color: #f5fafc;
    padding: 0.75rem 0.94rem;
    font-size: 1rem;
    font-family: inherit;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 0.6rem;
    outline: none;
    resize: vertical;
    min-height: 5rem;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
    box-sizing: border-box;

    &:focus {
        border-color: #e95be9ff;
        box-shadow: 0 0 0 3px #e95be748;
    }
`;

const Select = styled.select`
    width: 100%;
    background-color: #f5fafc;
    padding: 0.75rem 0.94rem;
    font-size: 1rem;
    font-family: inherit;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 0.6rem;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: #e95be9ff;
        box-shadow: 0 0 0 3px #e95be748;
    }

    option {
        color: initial;
    }
`;

// Container para as tags com altura fixa e rolagem
const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
    min-height: 4.375rem; /* Altura mínima para acomodar 2 linhas de tags */
    max-height: 4.375rem; /* Altura máxima */
    overflow-y: auto; /* Adiciona rolagem se passar da altura máxima */
    padding: 0.3rem;
    border-radius: 0.6rem;

    @media (max-width: 768px) {
        min-height: 2rem;
        max-height: 4.375rem;
    }
`;

const Tag = styled.div`
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#d1e7ff' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#0d6efd' : '#FE3F85')};
    padding: 0.3rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: fit-content; /*Garante que a tag não estique verticalmente*/
`;

const FooterBotoes = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.94rem;
    margin-top: 1.25rem;
    border-top: 1px solid #e0e0e0;
    padding-top: 1.25rem;
`;

const MensagemErro = styled.p`
    color: #d32f2f;
    font-size: 0.875rem;
    font-weight: 400;
    text-align: center;
    margin-top: -0.6rem;
    margin-bottom: 0.94rem;
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
    z-index: 2001; /* Garante que fique sobre outros elementos do modal */
    background-color: #ffffff;
    border: 1px solid #eee;
    border-radius: 0.5rem;
    max-height: 9.375rem;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 0;
    list-style: none;
`;

const SugestaoItem = styled.li`
    padding: 0.6rem 0.94rem;
    cursor: pointer;
    &:hover {
        background-color: #f5f5f5;
    }
`;

function FormularioCriarProjeto({ onClose }) {
    //Pega a informação do usuário logado
    const { currentUser, userData } = useAuth();

    const { addToast } = useToast();
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    //Estados para os campos do formulário
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [area, setArea] = useState('');
    const [habilidades, setHabilidades] = useState([]);
    const [interesses, setInteresses] = useState([]);
    const [erro, setErro] = useState('');
    const [todasAsHabilidades, setTodasAsHabilidades] = useState([]);
    const [todosOsInteresses, setTodosOsInteresses] = useState([]);
    const [buscaHabilidade, setBuscaHabilidade] = useState('');
    const [buscaInteresse, setBuscaInteresse] = useState('');
    const [sugestoesH, setSugestoesH] = useState([]);
    const [sugestoesI, setSugestoesI] = useState([]);

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
                setErro('Não foi possível carregar as sugestões de tags.');
                addToast('Erro ao carregar sugestões.', 'error');
            }
        };
        fetchTags();
    }, [addToast]);

    const handleHabilidadeChange = (e) => {
        const valor = e.target.value;
        setBuscaHabilidade(valor);
        if (valor) {
            setSugestoesH(
                todasAsHabilidades.filter(
                    (h) =>
                        h.nome.toLowerCase().includes(valor.toLowerCase()) &&
                        !habilidades.includes(h.nome)
                )
            );
        } else {
            setSugestoesH([]);
        }
    };

    const adicionarHabilidade = (nome) => {
        if (nome && !habilidades.includes(nome)) {
            setHabilidades([nome, ...habilidades]);
        }
        setBuscaHabilidade('');
        setSugestoesH([]);
    };

    const removerHabilidade = (nome) => {
        setHabilidades(habilidades.filter((h) => h !== nome));
    };

    const handleInteresseChange = (e) => {
        const valor = e.target.value;
        setBuscaInteresse(valor);
        if (valor) {
            setSugestoesI(
                todosOsInteresses.filter(
                    (i) =>
                        i.nome.toLowerCase().includes(valor.toLowerCase()) &&
                        !interesses.includes(i.nome)
                )
            );
        } else {
            setSugestoesI([]);
        }
    };

    const adicionarInteresse = (nome) => {
        if (nome && !interesses.includes(nome)) {
            setInteresses([nome, ...interesses]);
        }
        setBuscaInteresse('');
        setSugestoesI([]);
    };

    const removerInteresse = (nome) => {
        setInteresses(interesses.filter((i) => i !== nome));
    };

    const handleSubmit = async (evento) => {
        evento.preventDefault();
        setErro('');
        setLoadingSubmit(true);
        if (!currentUser) {
            addToast('Erro: Faça login para criar um projeto.', 'error');
            setLoadingSubmit(false);
            return;
        }
        if (!area) {
            addToast('Selecione uma área para o projeto.', 'error');
            setLoadingSubmit(false);
            return;
        }
        if (habilidades.length === 0) {
            addToast('Adicione pelo menos uma habilidade.', 'error');
            setLoadingSubmit(false);
            return;
        }

        try {
            const corDoProjeto = gerarCorAleatoria();
            const projetosCollectionRef = collection(db, 'projetos');
            const novoProjetoRef = await addDoc(projetosCollectionRef, {
                nome: nomeProjeto,
                descricao: descricao,
                area: area,
                habilidades: habilidades,
                interesses: interesses,
                donoId: currentUser.uid,
                donoNome: userData.nome,
                donoSobrenome: userData.sobrenome,
                corProjeto: corDoProjeto,
                criadoEm: serverTimestamp(),
                status: 'Novo',
                participantIds: [currentUser.uid],
                participantes: [
                    {
                        uid: currentUser.uid,
                        nome: userData.nome,
                        sobrenome: userData.sobrenome,
                        avatarColor: userData.avatarColor || '#0a528a',
                    },
                ],
            });

            const conversaRef = doc(db, 'conversas', novoProjetoRef.id);
            await setDoc(conversaRef, {
                isGrupo: true,
                nomeGrupo: nomeProjeto,
                projetoId: novoProjetoRef.id,
                avatarColor: corDoProjeto,
                participantes: [currentUser.uid],
                participantesInfo: [
                    {
                        uid: currentUser.uid,
                        nome: userData.nome,
                        sobrenome: userData.sobrenome,
                        avatarColor: userData.avatarColor || '#0a528a',
                    },
                ],
                unreadCounts: {
                    [currentUser.uid]: 0,
                },
                ultimaMensagem: null,
            });
            const nomeCurto =
                nomeProjeto.length > 30
                    ? nomeProjeto.substring(0, 30) + '...'
                    : nomeProjeto;
            addToast(`Projeto "${nomeCurto}" criado com sucesso!`, 'success');
            onClose();
        } catch (error) {
            console.error('Erro ao salvar o projeto.', error);
            addToast('Erro ao criar o projeto. Tente novamente.', 'error');
        } finally {
            setLoadingSubmit(false); // Desativa o carregamento (seja sucesso ou erro)
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <Titulo>Criar novo projeto</Titulo>

            <InputGroup>
                <Label htmlFor="nome-projeto">Nome do Projeto</Label>
                <Input
                    id="nome-projeto"
                    value={nomeProjeto}
                    onChange={(e) => setNomeProjeto(e.target.value)}
                    placeholder="Ex. Plataforma de Match Acadêmico"
                    required
                    disabled={loadingSubmit}
                />
            </InputGroup>

            <InputGroup>
                <Label htmlFor="descricao-projeto">Descrição</Label>
                <Textarea
                    id="descricao-projeto"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva seu projeto..."
                    required
                    disabled={loadingSubmit}
                />
            </InputGroup>

            <InputGroup>
                <Label htmlFor="area-projeto">Área relacionada</Label>
                <Select
                    id="area-projeto"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                    disabled={loadingSubmit}
                >
                    <option value="" disabled>
                        Selecione uma área
                    </option>
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

            <CamposEmLinha>
                <InputGroup>
                    <Label htmlFor="habilidades-projeto">
                        Habilidades Necessárias
                    </Label>
                    <AutoCompleteWrapper>
                        <Input
                            id="habilidades-projeto"
                            value={buscaHabilidade}
                            onChange={handleHabilidadeChange}
                            placeholder="Pesquisar habilidade..."
                            disabled={loadingSubmit}
                        />
                        {sugestoesH.length > 0 && (
                            <SugestoesContainer>
                                {sugestoesH.map((sugestao) => (
                                    <SugestaoItem
                                        key={sugestao.nome}
                                        onClick={() =>
                                            adicionarHabilidade(sugestao.nome)
                                        }
                                    >
                                        {sugestao.nome}
                                    </SugestaoItem>
                                ))}
                            </SugestoesContainer>
                        )}
                    </AutoCompleteWrapper>
                    <TagsContainer>
                        {habilidades.map((habilidade) => (
                            <Tag key={habilidade} $tipo="habilidade">
                                {habilidade}
                                <FaTimes
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        removerHabilidade(habilidade)
                                    }
                                />
                            </Tag>
                        ))}
                    </TagsContainer>
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="interesses-projeto">
                        Interesses do Projeto
                    </Label>
                    <AutoCompleteWrapper>
                        <Input
                            id="interesses-projeto"
                            value={buscaInteresse}
                            onChange={handleInteresseChange}
                            placeholder="Pesquisar interesse..."
                        />
                        {sugestoesI.length > 0 && (
                            <SugestoesContainer>
                                {sugestoesI.map((sugestao) => (
                                    <SugestaoItem
                                        key={sugestao.nome}
                                        onClick={() =>
                                            adicionarInteresse(sugestao.nome)
                                        }
                                    >
                                        {sugestao.nome}
                                    </SugestaoItem>
                                ))}
                            </SugestoesContainer>
                        )}
                    </AutoCompleteWrapper>
                    <TagsContainer>
                        {interesses.map((interesse) => (
                            <Tag key={interesse} $tipo="interesse">
                                {interesse}
                                <FaTimes
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => removerInteresse(interesse)}
                                />
                            </Tag>
                        ))}
                    </TagsContainer>
                </InputGroup>
            </CamposEmLinha>

            {erro && <MensagemErro>{erro}</MensagemErro>}

            <FooterBotoes>
                <Botao
                    type="button"
                    variant="Cancelar"
                    onClick={onClose}
                    disabled={loadingSubmit}
                >
                    Cancelar
                </Botao>
                <Botao type="submit" variant="Modal" disabled={loadingSubmit}>
                    {loadingSubmit ? 'A Criar...' : 'Criar Projeto'}
                </Botao>
            </FooterBotoes>
        </FormContainer>
    );
}

export default FormularioCriarProjeto;
