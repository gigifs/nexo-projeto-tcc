import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Botao from './Botao.jsx';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../firebase.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 0.625rem 0 0.625rem;
`;

const Titulo = styled.h2`
    font-size: 2rem;
    font-weight: 600;
    color: #000000;
    margin: 0.625rem 0 0.94rem 0;

    @media (max-width: 1400px) {
        font-size: 1.8rem;
    }

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }
`;

const Subtitulo = styled.p`
    font-size: 1.25rem;
    font-weight: 400;
    color: #000000cc;
    line-height: 1.2;
    margin: 0 0 0.94rem 0;

    @media (max-width: 1400px) {
        font-size: 1.2rem;
    }
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    width: 100%;
`;

const SectionTitulo = styled.h3`
    font-size: 1.25rem;
    font-weight: 500;
    color: #000000cc;
    margin: 0;
    text-align: left;

    @media (max-width: 1400px) {
        font-size: 1.1rem;
    }
`;

const Input = styled.input`
    width: 100%;
    box-sizing: border-box;
    background-color: #F5FAFC;
    padding: 0.75rem 0.94rem;
    font-size: 1rem;
    font-weight: 400;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 0.625rem;
    outline: none;
    margin: 0;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder {
        color: #999999;
        opacity: 1;

    &:focus {
        border-color: #5B82E9; 
        box-shadow: 0 0 0 3px #5b82e948;
    }
`;

const TagsSelecionadasContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.315rem;
    min-height: 0.94rem; /* Garante um espaço mesmo quando vazio */
`;

const Tag = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.5rem 0.5rem;
    border-radius: 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;

    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};

    button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        color: inherit;
        display: flex; /* Essencial para centralizar o ícone!!! */
        align-items: center;
        justify-content: center;
        opacity: 0.7;

        &:hover {
            opacity: 1;
        }
    }

    @media (max-width: 1400px) {
        font-size: 0.85rem;
    }
`;

const AutoCompleteWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const SugestoesContainer = styled.div`
    position: absolute;
    width: 100%;
    top: 100%;
    margin-top: 2px;
    left: 0;
    z-index: 10;
    background-color: #ffffff;
    border: 1px solid #eee;
    border-radius: 0.5rem;
    max-height: 9.375rem;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SugestaoItem = styled.div`
    padding: 0.625rem 0.94rem;
    cursor: pointer;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 0.94rem;
    margin-bottom: 0.625rem;
`;

function EditarInteressesModal({ onSuccess }) {
    const { currentUser, userData, refreshUserData } = useAuth();
    const [habilidades, setHabilidades] = useState(userData?.habilidades || []);
    const [interesses, setInteresses] = useState(userData?.interesses || []);
    const [todasAsHabilidades, setTodasAsHabilidades] = useState([]);
    const [todosOsInteresses, setTodosOsInteresses] = useState([]);
    const [buscaHabilidade, setBuscaHabilidade] = useState('');
    const [buscaInteresse, setBuscaInteresse] = useState('');

    // O useEffect busca todas as tags do Firestore QUANDO o modal abre
    useEffect(() => {
        const buscarTags = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tags'));
                const tagsDoBanco = querySnapshot.docs.map((doc) => doc.data());
                // Separa as tags em duas listas
                setTodasAsHabilidades(
                    tagsDoBanco.filter((tag) => tag.tipo === 'habilidade')
                );
                setTodosOsInteresses(
                    tagsDoBanco.filter((tag) => tag.tipo === 'interesse')
                );
            } catch (error) {
                console.error('Erro ao buscar tags:', error);
            }
        };
        buscarTags();
    }, []); // O array vazio [] garante que isso só roda uma vez

    // Funções para adicionar e remover HABILIDADES
    const adicionarHabilidade = (habilidade) => {
        if (!habilidades.includes(habilidade.nome)) {
            setHabilidades([...habilidades, habilidade.nome]);
        }
        setBuscaHabilidade(''); // Limpa a busca
    };
    const removerHabilidade = (habilidadeNome) => {
        setHabilidades(habilidades.filter((h) => h !== habilidadeNome));
    };

    // Funções para adicionar e remover INTERESSES
    const adicionarInteresse = (interesse) => {
        if (!interesses.includes(interesse.nome)) {
            setInteresses([...interesses, interesse.nome]);
        }
        setBuscaInteresse('');
    };
    const removerInteresse = (interesseNome) => {
        setInteresses(interesses.filter((i) => i !== interesseNome));
    };

    // Lógica de filtro para as sugestões
    const habilidadesFiltradas = buscaHabilidade
        ? todasAsHabilidades.filter((h) =>
              h.nome.toLowerCase().includes(buscaHabilidade.toLowerCase())
          )
        : [];

    const interessesFiltrados = buscaInteresse
        ? todosOsInteresses.filter((i) =>
              i.nome.toLowerCase().includes(buscaInteresse.toLowerCase())
          )
        : [];

    // Função para salvar conectada com o firebase
    const handleSalvar = async () => {
        if (!currentUser) {
            console.error('Nenhum usuário logado para salvar.');
            return;
        }
        // Cria a referência para o documento do usuário logado
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
            // Atualiza o documento no Firestore com as novas listas
            await updateDoc(userDocRef, {
                habilidades: habilidades,
                interesses: interesses,
            });

            // Atualiza nosso "cérebro" (AuthContext) com os novos dados
            await refreshUserData();

            console.log('Perfil atualizado com sucesso!');
            onSuccess(); // Fecha o modal
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
        }
    };

    return (
        <ModalContent>
            <Titulo>Editar Habilidades e Interesses</Titulo>
            <Subtitulo>
                Edite suas habilidades (hard skills) e interesses (soft skills)
                para melhorar suas recomendações.
            </Subtitulo>
            {/* SEÇÃO DE HABILIDADES */}
            <Section>
                <SectionTitulo>Habilidades</SectionTitulo>
                <AutoCompleteWrapper>
                    <Input
                        placeholder="Pesquisar habilidade..."
                        value={buscaHabilidade}
                        onChange={(e) => setBuscaHabilidade(e.target.value)}
                    />
                    {/* EXIBE A LISTA DE SUGESTÕES FILTRADAS */}
                    {habilidadesFiltradas.length > 0 && (
                        <SugestoesContainer>
                            {habilidadesFiltradas.map((h) => (
                                <SugestaoItem
                                    key={h.nome}
                                    onClick={() => adicionarHabilidade(h)}
                                >
                                    {h.nome}
                                </SugestaoItem>
                            ))}
                        </SugestoesContainer>
                    )}
                </AutoCompleteWrapper>
                <TagsSelecionadasContainer>
                    {habilidades.map((h) => (
                        <Tag key={h} $tipo="habilidade">
                            {h}
                            <button onClick={() => removerHabilidade(h)}>
                                <FiX size={16} strokeWidth={3} />
                            </button>
                        </Tag>
                    ))}
                </TagsSelecionadasContainer>
            </Section>

            {/* SEÇÃO DE INTERESSES */}
            <Section style={{ marginTop: '0.94rem' }}>
                <SectionTitulo>Interesses</SectionTitulo>
                <AutoCompleteWrapper>
                    <Input
                        placeholder="Pesquisar interesse..."
                        value={buscaInteresse}
                        onChange={(e) => setBuscaInteresse(e.target.value)}
                    />
                    {/* EXIBE A LISTA DE SUGESTÕES FILTRADAS */}
                    {interessesFiltrados.length > 0 && (
                        <SugestoesContainer>
                            {interessesFiltrados.map((i) => (
                                <SugestaoItem
                                    key={i.nome}
                                    onClick={() => adicionarInteresse(i)}
                                >
                                    {i.nome}
                                </SugestaoItem>
                            ))}
                        </SugestoesContainer>
                    )}
                </AutoCompleteWrapper>
                <TagsSelecionadasContainer>
                    {interesses.map((i) => (
                        <Tag key={i} $tipo="interesse">
                            {i}
                            <button onClick={() => removerInteresse(i)}>
                                <FiX size={16} strokeWidth={3} />
                            </button>
                        </Tag>
                    ))}
                </TagsSelecionadasContainer>
            </Section>

            <ButtonContainer>
                <Botao variant="hab-int" onClick={handleSalvar}>
                    Salvar Habilidades e Interesses
                </Botao>
            </ButtonContainer>
        </ModalContent>
    );
}

export default EditarInteressesModal;