import styled from 'styled-components';
import { FiUser, FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext.jsx';

const QuadroPerfilContainer = styled.div`
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
    display: flex;
    align-items: stretch;
    overflow: hidden;
`;

const FotoLinksContainer = styled.div`
    background-color: #e6ebf0;
    padding: 30px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
`;

// ALTERADO: Avatar agora aceita a propriedade $bgColor
const Avatar = styled.div`
    width: 120px;
    height: 120px;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-weight: 700;
    font-size: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LinksSociais = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    width: 100%;
`;

const LinkExterno = styled.a`
    width: 143px;
    height: 44px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 10px;
    font-size: 30px;
    font-weight: 500;
    color: #000;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    svg {
        font-size: 30px;
    }
    &:hover {
        color: #0a528a;
    }
`;

const InfoDetalhadaContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px;
    padding-bottom: 40px;
`;

const InfoPessoais = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const InfoLinha = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    color: #000;
    svg {
        color: #333;
        font-size: 22px;
    }
`;

const Nome = styled.h2`
    font-weight: 600;
    margin: 0;
    font-size: 36px;
`;

const Curso = styled.p`
    font-weight: 400;
    margin: 0;
    font-size: 36px;
    color: #555;
`;

const Secao = styled.div`
    text-align: left;
`;

const SecaoTitulo = styled.h3`
    font-size: 36px;
    font-weight: 600;
    color: #000;
    margin: 0 0 8px 0;
`;

const SecaoConteudo = styled.p`
    font-size: 30px;
    font-weight: 400;
    color: #333;
    line-height: 1.4;
    margin: 0;
    word-break: break-word;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const Tag = styled.span`
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => (props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66')};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome[0]}${sobrenome ? sobrenome[0] : ''}`.toUpperCase();
};

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
                        <FiLinkedin size={30} /> LinkedIn
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