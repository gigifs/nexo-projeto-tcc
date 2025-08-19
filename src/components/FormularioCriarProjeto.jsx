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

const InputGroup = styled.div`
    margin-bottom: 20px;
    position: relative;
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
    transition: border-color 0.2s, box-shadow 0.2s;
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
    transition: border-color 0.2s, box-shadow 0.2s;
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

const HabilidadesContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    min-height: 28px;
`;

const Tag = styled.div`
    background-color: #d1e7ff;
    color: #0d6efd;
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FooterBotoes = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 40px;
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
    const { currentUser } = useAuth();

    //Estados para os campos do formulário
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [area, setArea] = useState('');
    const [habilidadeAtual, setHabilidadeAtual] = useState('');
    const [habilidades, setHabilidades] = useState([]);
    const [erro, setErro] = useState('');

    //Estados para o autocomplete
    const [todasAsHabilidades, setTodasAsHabilidades] = useState([]);
    const [sugestoes, setSugestoes] = useState([]);

    //Efeito para buscar as habilidades do Firestore na montagem do componente
    useEffect(() => {
        const fetchHabilidades = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tags'));
                const tagsDoBanco = querySnapshot.docs.map((doc) => doc.data());
                setTodasAsHabilidades(
                    tagsDoBanco.filter((tag) => tag.tipo === 'habilidade')
                );
            } catch (error) {
                console.error('Erro ao buscar habilidades:', error);
                setErro('Não foi possível carregar as habilidades.');
            }
        };
        fetchHabilidades();
    }, []); //O array vazio [] garante que a busca só aconteça 1 vez

    //Lógica do autocomplete
    const handleHabilidadeChange = (e) => {
        const valor = e.target.value;
        setHabilidadeAtual(valor);
        setErro(''); //Limpa o erro ao digitar uma nova habilidade

        if (valor) {
            const sugestoesFiltradas = todasAsHabilidades.filter(
                (h) =>
                    h.nome.toLowerCase().includes(valor.toLowerCase()) &&
                    !habilidades.includes(h.nome)
            );
            setSugestoes(sugestoesFiltradas);
        } else {
            setSugestoes([]);
        }
    };

    //Adiciona uma habilidade à lista do projeto
    const adicionarHabilidade = (habilidadeNome) => {
        if (habilidadeNome && !habilidades.includes(habilidadeNome)) {
            setHabilidades([...habilidades, habilidadeNome]);
            setErro('');
        }
        setHabilidadeAtual('');
        setSugestoes([]);
    };

    //Valida e adiciona a habilidade
    const handleAdicionarHabilidade = () => {
        const habilidadeParaAdicionar = habilidadeAtual.trim();
        if (!habilidadeParaAdicionar) return;

        const habilidadeValida = todasAsHabilidades.find(
            (h) => h.nome.toLowerCase() === habilidadeParaAdicionar.toLowerCase()
        );

        if (habilidadeValida) {
            adicionarHabilidade(habilidadeValida.nome);
        } else {
            setErro(`A habilidade "${habilidadeParaAdicionar}" não é válida.`);
        }
    };

    //Remove uma habilidade da lista
    const handleRemoverHabilidade = (habilidadeParaRemover) => {
        setHabilidades(habilidades.filter((h) => h !== habilidadeParaRemover));
    };

    //Permite adicionar com a tecla enter
    const handleKeyDown = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            if (sugestoes.length > 0) {
                adicionarHabilidade(sugestoes[0].nome);
            } else {
                handleAdicionarHabilidade();
            }
        }
    };

    //Lida com o envio do formulário
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
            await addDoc(projetosCollectionRef, {
                nome: nomeProjeto,
                descricao: descricao,
                area: area,
                habilidades: habilidades,
                donoId: currentUser.uid,
                criadoEm: serverTimestamp(),
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
                    <option value="desenvolvimento">
                        Desenvolvimento de Software
                    </option>
                    <option value="pesquisa">Pesquisa Acadêmica</option>
                    <option value="design">Design/UX</option>
                    <option value="marketing">Marketing</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label htmlFor="habilidades-projeto">
                    Habilidades Necessárias
                </Label>
                <HabilidadesContainer>
                    <AutoCompleteWrapper>
                        <Input
                            id="habilidades-projeto"
                            value={habilidadeAtual}
                            onChange={handleHabilidadeChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Pesquisar habilidade..."
                        />
                        {sugestoes.length > 0 && (
                            <SugestoesContainer>
                                {sugestoes.map((sugestao) => (
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
                    <Botao
                        type="button"
                        variant="AdicionarHabilidade"
                        onClick={handleAdicionarHabilidade}
                        disabled={!habilidadeAtual.trim()}
                    >
                        +
                    </Botao>
                </HabilidadesContainer>
                <TagsContainer>
                    {habilidades.map((habilidade) => (
                        <Tag key={habilidade}>
                            {habilidade}
                            <FaTimes
                                color="0d6efd"
                                cursor="pointer"
                                onClick={() =>
                                    handleRemoverHabilidade(habilidade)
                                }
                            />
                        </Tag>
                    ))}
                </TagsContainer>
            </InputGroup>

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