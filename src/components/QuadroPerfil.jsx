import styled from 'styled-components';
import { FiUser, FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getInitials } from '../utils/iniciaisNome'; // Importação

const QuadroPerfilContainer = styled.div`
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
    display: flex;
    align-items: stretch;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FotoLinksContainer = styled.div`
    background-color: #e6ebf0;
    padding: 1.875rem 1.56rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    flex-shrink: 0;
`;

// ALTERADO: Avatar agora aceita a propriedade $bgColor
const Avatar = styled.div`
    width: 7.5rem;
    height: 7.5rem;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-weight: 700;
    font-size: 3.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LinksSociais = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: flex-start;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: center;
    }
`;

const LinkExterno = styled.a`
    width: 8.95rem;
    height: 2.75rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 0.6rem;
    font-size: 1.875rem;
    font-weight: 500;
    color: #000;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    svg {
        font-size: 1.875rem;
        flex-shrink: 0; /* Não deixa o ícone encolher */

        @media (max-width: 768px) {
            font-size: 1.5rem;
        }
    }
    &:hover {
        color: #0a528a;
    }

    @media (max-width: 768px) {
        font-size: 1.25rem;
    }
`;

const InfoDetalhadaContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.875rem;
    padding: 1.25rem;
    padding-bottom: 2.5rem;
`;

const InfoPessoais = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

const InfoLinha = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    color: #000;
    svg {
        color: #333;
        font-size: 1.375rem;
    }
`;

const Nome = styled.h2`
    font-weight: 600;
    margin: 0;
    font-size: 2.25rem;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Curso = styled.p`
    font-weight: 400;
    margin: 0;
    font-size: 2.25rem;
    color: #555;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Secao = styled.div`
    text-align: left;
`;

const SecaoTitulo = styled.h3`
    font-size: 2.25rem;
    font-weight: 600;
    color: #000;
    margin: 0 0 0.5rem 0;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const SecaoConteudo = styled.p`
    font-size: 1.875rem;
    font-weight: 400;
    color: #333;
    line-height: 1.4;
    margin: 0;
    word-break: break-word;

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
`;

const Tag = styled.span`
    padding: 0.5rem 1rem;
    border-radius: 1.875rem;
    font-size: 1rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => (props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66')};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`;

function QuadroPerfil() {
    const { userData } = useAuth();

    const todasAsTags = [
        ...(userData?.habilidades || []).map((h) => ({ nome: h, tipo: 'habilidade' })),
        ...(userData?.interesses || []).map((i) => ({ nome: i, tipo: 'interesse' })),
    ];

    return (
        <QuadroPerfilContainer>
            <FotoLinksContainer>
                {/* ALTERADO: Passamos a cor do avatar dinamicamente */}
                <Avatar $bgColor={userData?.avatarColor}>
                    {getInitials(userData?.nome, userData?.sobrenome)}
                </Avatar>
                <LinksSociais>
                    <LinkExterno href={userData?.github || '#'} target="_blank">
                        <FiGithub /> GitHub
                    </LinkExterno>
                    <LinkExterno href={userData?.linkedin || '#'} target="_blank">
                        <FiLinkedin /> LinkedIn
                    </LinkExterno>
                </LinksSociais>
            </FotoLinksContainer>

            <InfoDetalhadaContainer>
                <InfoPessoais>
                    <InfoLinha>
                        <FiUser />
                        <Nome>
                            {userData?.nome || 'Nome'}{' '}
                            {userData?.sobrenome || 'Sobrenome'}
                        </Nome>
                    </InfoLinha>
                    <InfoLinha>
                        <FaGraduationCap />
                        <Curso>{userData?.curso || 'Curso Indefinido'}</Curso>
                    </InfoLinha>
                </InfoPessoais>

                <Secao>
                    <SecaoTitulo>Sobre mim</SecaoTitulo>
                    <SecaoConteudo>
                        {userData?.bio || 'Nenhuma descrição fornecida.'}
                    </SecaoConteudo>
                </Secao>

                <Secao>
                    <SecaoTitulo>Habilidades e Interesses</SecaoTitulo>
                    <TagsContainer>
                        {todasAsTags.length > 0 ? (
                            todasAsTags.map((tag) => (
                                <Tag key={tag.nome} $tipo={tag.tipo}>
                                    {tag.nome}
                                </Tag>
                            ))
                        ) : (
                            <p>Nenhuma habilidade ou interesse adicionado.</p>
                        )}
                    </TagsContainer>
                </Secao>
            </InfoDetalhadaContainer>
        </QuadroPerfilContainer>
    );
}

export default QuadroPerfil;