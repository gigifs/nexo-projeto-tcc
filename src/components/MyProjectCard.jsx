import styled from 'styled-components';
import Botao from './Botao';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';

const CardWrapper = styled.div`
    background-color: #f5fafc;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 15px;
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
    height: 295px;
    position: relative;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
`;

const TituloProjeto = styled.h3`
    font-size: 22px;
    font-weight: 600;
    color: #000;
    margin: 0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const StatusTag = styled.span`
    padding: 6px 14px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    background-color: ${(props) => props.$color || '#e0e0e0'};
    color: ${(props) => props.$textColor || '#000'};
`;

const DescricaoProjeto = styled.p`
    font-size: 16px;
    color: #333;
    line-height: 1.4;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /*Limite de linhas para a descrição*/
    -webkit-box-orient: vertical;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 60px;
    overflow-y: auto;
`;

const Tag = styled.span`
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#aed9f4' : '#ffcced'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0')};
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid #eee;
`;

const TeamDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
`;

const TeamTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

const TeamContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const TeamMemberAvatar = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
`;

const ActionButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    padding: 5px;
    &:hover {
        color: #0a528a;
    }
`;

const ActionButton = styled(Botao)`
    background-color: #7c2256;
    color: #f5fafc;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 16px;
    font-weight: 500;
    border: 2px solid #7c2256;
    
    &:hover {
        background-color: #f5fafc;
        color: #7c2256;
    }
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    if (!sobrenome) return nome.substring(0, 2).toUpperCase();
    return `${nome[0]}${sobrenome[0]}`.toUpperCase();
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};

function MyProjectCard({ projeto, currentUserId }) {
    const {
        nome = 'Projeto sem nome',
        descricao = 'Sem descrição disponível.',
        donoId,
        status = 'Indefinido',
        habilidades = [],
        interesses = [],
        participantes = [],
    } = projeto;

    const statusStyle = getStatusStyle(status);
    const isOwner = currentUserId === donoId;

    return (
        <CardWrapper>
            <CardHeader>
                <TituloProjeto>{nome}</TituloProjeto>
                <StatusTag
                    $color={statusStyle.$color}
                    $textColor={statusStyle.$textColor}
                >
                    {status}
                </StatusTag>
            </CardHeader>

            <DescricaoProjeto>{descricao}</DescricaoProjeto>

            <TagsContainer>
                {habilidades.map((h) => (
                    <Tag key={h} $tipo="habilidade">
                        {h}
                    </Tag>
                ))}
                {interesses.map((i) => (
                    <Tag key={i} $tipo="interesse">
                        {i}
                    </Tag>
                ))}
            </TagsContainer>

            <CardFooter>
                {participantes && participantes.length > 0 && (
                    <TeamDetails>
                        <TeamTitle>Sua Equipe:</TeamTitle>
                        <TeamContainer>
                            {participantes.map((p) => (
                                <TeamMemberAvatar
                                    key={p.uid}
                                    title={`${p.nome} ${p.sobrenome}`}
                                >
                                    {getInitials(p.nome, p.sobrenome)}
                                </TeamMemberAvatar>
                            ))}
                        </TeamContainer>
                    </TeamDetails>
                )}

                <ActionButtonsContainer>
                    <IconButton
                        onClick={() => alert('Abrir chat do projeto!')}
                    >
                        <FiMessageSquare size={20} /> Chat
                    </IconButton>

                    {isOwner ? (
                        <ActionButton
                            onClick={() =>
                                alert('Abrir modal de gerenciamento!')
                            }
                        >
                            <FiSettings style={{ marginRight: '5px' }} /> Gerenciar
                        </ActionButton>
                    ) : (
                        <ActionButton
                            onClick={() => alert('Ver detalhes do projeto!')}
                        >
                            Ver Detalhes
                        </ActionButton>
                    )}
                </ActionButtonsContainer>
            </CardFooter>
        </CardWrapper>
    );
}

export default MyProjectCard;