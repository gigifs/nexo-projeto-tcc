import styled from 'styled-components';
import Botao from './Botao';
import { FaGraduationCap } from 'react-icons/fa';

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
    min-height: 340px;
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
    background-color: ${(props) => props.color || '#e0e0e0'};
    color: ${(props) => props.textColor || '#000'};
`;

const DescricaoProjeto = styled.p`
    font-size: 16px;
    color: #333;
    line-height: 1.4;
    margin: 0;
    /* --- CORREÇÃO APLICADA AQUI --- */
    /* Garante que textos longos sem espaços quebrem a linha */
    overflow-wrap: break-word;
    word-wrap: break-word; /* Suporte para navegadores mais antigos */
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 60px;
    overflow: hidden;
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

const OwnerDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FooterText = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #333;
`;

const Avatar = styled.div`
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
    flex-shrink: 0;
`;

const DetalhesBotao = styled(Botao)`
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 10px;
`;

const getInitials = (nome) => {
    if (!nome) return '?';
    const parts = nome.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'Aberto para Candidaturas':
            return { color: '#E8DFF5', textColor: '#6A1B9A' };
        case 'Novo':
            return { color: '#FFE0B2', textColor: '#E65100' };
        default:
            return { color: '#e0e0e0', textColor: '#000' };
    }
};

function ProjectCard({ projeto }) {
    const {
        nome,
        descricao,
        dono,
        cursoDono,
        status,
        habilidades,
        interesses,
    } = projeto;
    const statusStyle = getStatusStyle(status);

    return (
        <CardWrapper>
            <CardHeader>
                <TituloProjeto>{nome}</TituloProjeto>
                {status && (
                    <StatusTag
                        color={statusStyle.color}
                        textColor={statusStyle.textColor}
                    >
                        {status}
                    </StatusTag>
                )}
            </CardHeader>

            <DescricaoProjeto>{descricao}</DescricaoProjeto>

            <TagsContainer>
                {habilidades?.map((h) => (
                    <Tag key={h} $tipo="habilidade">
                        {h}
                    </Tag>
                ))}
                {interesses?.map((i) => (
                    <Tag key={i} $tipo="interesse">
                        {i}
                    </Tag>
                ))}
            </TagsContainer>

            <CardFooter>
                <OwnerDetails>
                    <FooterText>
                        <FaGraduationCap size={20} color="#555" />
                        <span>{cursoDono || 'Curso não informado'}</span>
                    </FooterText>
                    <FooterText>
                        <Avatar>{getInitials(dono)}</Avatar>
                        <span>{dono || 'Nome do Dono'}</span>
                    </FooterText>
                </OwnerDetails>
                <DetalhesBotao
                    onClick={() => alert(`Detalhes do projeto: ${descricao}`)}
                >
                    Ver Detalhes
                </DetalhesBotao>
            </CardFooter>
        </CardWrapper>
    );
}

export default ProjectCard;