// Em src/components/MeusInteresses.jsx
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';

const CardContainer = styled.div`
    background-color: #f5fafc;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 360px;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const Titulo = styled.h3`
    font-size: 24px;
    font-weight: 400;
    color: #000000;
    margin: 0;
`;

const BotaoEditar = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #000000cc;
    padding: 0px;

    &:hover {
        color: #0a528acc;
    }
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const Tag = styled.span`
    padding: 8px 8px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;

    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
`;

function MeusInteresses({ onEditClick }) {
    // Recebe uma função para abrir o modal
    const { userData } = useAuth(); // Pega os dados do perfil do usuário do nosso contexto

    // Combina as habilidades e interesses em uma única lista para exibição
    const todasAsTags = [
        ...(userData?.habilidades || []).map((h) => ({
            nome: h,
            tipo: 'habilidade',
        })),
        ...(userData?.interesses || []).map((i) => ({
            nome: i,
            tipo: 'interesse',
        })),
    ];

    return (
        <CardContainer>
            <Header>
                <Titulo>Meus Interesses</Titulo>
                <BotaoEditar onClick={onEditClick}>
                    <FiEdit size={25} />
                </BotaoEditar>
            </Header>
            <TagsContainer>
                {todasAsTags.length > 0 ? (
                    todasAsTags.map((tag) => (
                        <Tag key={tag.nome} $tipo={tag.tipo}>
                            {tag.nome}
                        </Tag>
                    ))
                ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>
                        Adicione suas habilidades e interesses clicando no
                        lápis!
                    </p>
                )}
            </TagsContainer>
        </CardContainer>
    );
}

export default MeusInteresses;
