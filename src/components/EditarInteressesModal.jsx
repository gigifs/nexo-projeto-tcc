// Em src/components/EditarInteressesModal.jsx
import styled from 'styled-components';
import Botao from './Botao.jsx';
import { FiPlus, FiX } from 'react-icons/fi';

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Titulo = styled.h2`
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin: 0;
`;

const Subtitulo = styled.p`
    font-size: 16px;
    color: #666;
    margin: -10px 0 10px 0;
    line-height: 1.5;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SectionTitulo = styled.h3`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0;
    text-align: left;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Input = styled.input`
    flex-grow: 1;
    padding: 12px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
`;

const BotaoAdicionar = styled.button`
    background-color: #0a528a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TagsSelecionadasContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 30px; /* Garante um espaço mesmo quando vazio */
`;

const Tag = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;

    background-color: ${(props) =>
        props.tipo === 'habilidade' ? '#dbeafe' : '#fce7f3'};
    color: ${(props) => (props.tipo === 'habilidade' ? '#1e40af' : '#9d174d')};

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        &:hover {
            opacity: 1;
        }
    }
`;

function EditarInteressesModal() {
    // Por enquanto, usaremos dados de exemplo para construir o visual
    const habilidadesSelecionadas = ['Java', 'React', 'C++'];
    const interessesSelecionados = ['Pesquisa', 'Gestão'];

    return (
        <ModalContent>
            <Titulo>Editar Habilidades e Interesses</Titulo>
            <Subtitulo>
                Edite suas habilidades (hard skills) e interesses (soft skills)
                para melhorar suas recomendações.
            </Subtitulo>

            <Section>
                <SectionTitulo>Habilidades</SectionTitulo>
                <InputContainer>
                    <Input placeholder="Ex. JavaScript, Python" />
                    <BotaoAdicionar>
                        <FiPlus size={20} />
                    </BotaoAdicionar>
                </InputContainer>
                <TagsSelecionadasContainer>
                    {habilidadesSelecionadas.map((h) => (
                        <Tag key={h} tipo="habilidade">
                            {h}{' '}
                            <button>
                                <FiX size={14} />
                            </button>
                        </Tag>
                    ))}
                </TagsSelecionadasContainer>
            </Section>

            <Section>
                <SectionTitulo>Interesses</SectionTitulo>
                <InputContainer>
                    <Input placeholder="Ex. Design, Hackathon" />
                    <BotaoAdicionar>
                        <FiPlus size={20} />
                    </BotaoAdicionar>
                </InputContainer>
                <TagsSelecionadasContainer>
                    {interessesSelecionados.map((i) => (
                        <Tag key={i} tipo="interesse">
                            {i}{' '}
                            <button>
                                <FiX size={14} />
                            </button>
                        </Tag>
                    ))}
                </TagsSelecionadasContainer>
            </Section>

            <div style={{ marginTop: '20px' }}>
                <Botao variant="Modal">Salvar Habilidades e Interesses</Botao>
            </div>
        </ModalContent>
    );
}

export default EditarInteressesModal;
