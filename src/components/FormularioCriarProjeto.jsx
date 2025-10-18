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

const FormContainer = styled.form`
    padding: 20px 40px 30px 40px;
    background-color: #f5fafc;
`;

const Titulo = styled.h2`
    font-size: 28px;
    font-weight: 700;
    text-align: left;
    color: #030214;
    margin-top: 10px;
    margin-bottom: 30px;
`;

const CamposEmLinha = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
`;

const InputGroup = styled.div`
    margin-bottom: 20px;
    position: relative;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 16px;
    color: #000000cc;
`;

const Input = styled.input`
    width: 100%;
    background-color: #f5fafc;
    padding: 12px 15px;
    font-size: 16px;
    color: #000000cc;
    border: 1px solid #ced4da;
    border-radius: 10px;
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
    padding: 12px 15px;
    font-size: 16px;
    font-family: inherit;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
    outline: none;
    resize: vertical;
    min-height: 80px;
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
    padding: 12px 15px;
    font-size: 16px;
    font-family: inherit;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
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
    gap: 8px;
    margin-top: 12px;
    min-height: 70px; /* Altura mínima para acomodar 2 linhas de tags */
    max-height: 70px; /* Altura máxima */
    overflow-y: auto; /* Adiciona rolagem se passar da altura máxima */
    padding: 5px;
    border-radius: 10px;

`;

const Tag = styled.div`
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#d1e7ff' : '#ffcced'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#0d6efd' : '#9c27b0')};
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    height: fit-content; /*Garante que a tag não estique verticalmente*/
`;

const FooterBotoes = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
`;

const MensagemErro = styled.p`
    color: #d32f2f;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    margin-top: -10px;
    margin-bottom: 15px;
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

function FormularioCriarProjeto({ onClose }) {
    //Pega a informação do usuário logado
    const { currentUser, userData } = useAuth();

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
            }
        };
        fetchTags();
    }, []);

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
        if (!currentUser) {
            setErro('Você precisa estar logado para criar um projeto.');
            return;
        }
        if (!area) {
            setErro('Por favor, selecione uma área para o projeto.');
            return;
        }
        if (habilidades.length === 0) {
            setErro('Adicione pelo menos uma habilidade necessária.');
            return;
        }

        try {
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
                criadoEm: serverTimestamp(),
                status: 'Novo',
                participantIds: [currentUser.uid],
                participantes: [
                    {
                        uid: currentUser.uid,
                        nome: userData.nome,
                        sobrenome: userData.sobrenome,
                    },
                ],
            });

            const conversaRef = doc(db, 'conversas', novoProjetoRef.id);
            await setDoc(conversaRef, {
                isGrupo: true,
                nomeGrupo: nomeProjeto,
                projetoId: novoProjetoRef.id,
                participantes: [currentUser.uid],
                participantesInfo: [
                    {
                        uid: currentUser.uid,
                        nome: userData.nome,
                        sobrenome: userData.sobrenome,
                    },
                ],
                unreadCounts: {
                    [currentUser.uid]: 0,
                },
                ultimaMensagem: null,
            });

            alert('Projeto criado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao salvar o projeto.', error);
            setErro('Ocorreu um erro ao salvar o projeto. Tente novamente.');
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
                />
            </InputGroup>

            <InputGroup>
                <Label htmlFor="area-projeto">Área relacionada</Label>
                <Select
                    id="area-projeto"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
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
                <Botao type="button" variant="Cancelar" onClick={onClose}>
                    Cancelar
                </Botao>
                <Botao type="submit" variant="Modal">
                    Criar Projeto
                </Botao>
            </FooterBotoes>
        </FormContainer>
    );
}

export default FormularioCriarProjeto;
