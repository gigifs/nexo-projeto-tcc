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
    height: 295px; /*Atura máxima do card*/
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

    /*Limita a quantidade de linhas do titulo*/
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /*Título terá no máx 2 linhas*/
    -webkit-box-orient: vertical;
`;

const StatusTag = styled.span`
    padding: 6px 14px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    background-color: ${props => props.$color || '#e0e0e0'};
    color: ${props => props.$textColor || '#000'};
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
    max-height: 30px;
    overflow: hidden;
`;

//Tags com cores condicionais de acordo com o tipo
const Tag = styled.span`
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    /*Define a cor com base na propriedade '$tipo'*/
    background-color: ${props => (props.$tipo === 'habilidade' ? '#aed9f4' : '#ffcced')};
    color: ${props => (props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0')};
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end; 
    margin-top: auto; /*Empurra o rodapé pro final do card*/
    padding-top: 10px;
    border-top: 1px solid #eee; /*Barra entre tags e curso, pode tirar caso não gostem*/
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

//Avatar com as iniciais do criador do projeto
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
    flex-shrink: 0; /*Impede que o avatar encolha*/
`;

const DetalhesBotao = styled(Botao)`
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 10px;
`;

//Pega as iniciais do nome de quem criou o projeto, e as deixam maiúsculas.
const getInitials = (nome) => {
    if (!nome) return '?';
    const parts = nome.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
};

//Condição para a cor da tag de status do projeto
const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};

function ProjectCard({ projeto }) {
    const { nome, descricao, donoNome, donoSobrenome, curso, status, habilidades, interesses } = projeto;
    const statusStyle = getStatusStyle(status);
    const nomeCompletoDono = `${donoNome || ''} ${donoSobrenome || ""}`.trim();

    return (
        <CardWrapper>
            <CardHeader>
                <TituloProjeto>{nome}</TituloProjeto>
                {status && (
                    <StatusTag 
                        $color={statusStyle.$color} 
                        $textColor={statusStyle.$textColor}
                    >
                        {status}
                    </StatusTag>
                )}
            </CardHeader>

            <DescricaoProjeto>{descricao}</DescricaoProjeto>

            <TagsContainer>
                {/*Renderiza tags de habilidade com seu tipo*/}
                {habilidades?.map(h => <Tag key={h} $tipo="habilidade">{h}</Tag>)}
                {/*Renderiza tags de interesse com seu tipo*/}
                {interesses?.map(i => <Tag key={i} $tipo="interesse">{i}</Tag>)}
            </TagsContainer>

            <CardFooter>
                <OwnerDetails>
                    <FooterText>
                        <FaGraduationCap size={20} color="#555" />
                        <span>{curso || 'Curso não informado'}</span>
                    </FooterText>
                    <FooterText>
                        <Avatar>{getInitials(nomeCompletoDono)}</Avatar>
                        <span>{nomeCompletoDono || 'Nome do Dono'}</span>
                    </FooterText>
                </OwnerDetails>
                {/*Tirar o alerta assim que o modal 'VerDetalhes' for integrado.*/}
                <DetalhesBotao onClick={() => alert(`Detalhes do projeto: ${descricao}`)}>
                    Ver Detalhes
                </DetalhesBotao>
            </CardFooter>
        </CardWrapper>
    );
}

export default ProjectCard;
