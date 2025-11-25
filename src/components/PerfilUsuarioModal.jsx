import styled from 'styled-components';
import Modal from './Modal';
import Botao from './Botao';
import { FiGithub, FiLinkedin, FiUser } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { getInitials } from '../utils/iniciaisNome';

const ModalWrapper = styled.div`
    display: flex;
    gap: 1.55rem;
    padding: 1.25rem 1.25rem 1.25rem 0;
    color: #000000;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center; /* Centraliza o avatar/links */
        padding: 0.94rem 0.94rem 0.94rem 0.94rem;
    }
`;

//Avatar e Links
const ColunaEsquerda = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    flex-shrink: 0;
    padding: 0.95rem 0.6rem;
`;

const Avatar = styled.div`
    width: 5.625rem;
    height: 5.625rem;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 2.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const LinksSociais = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
    align-items: flex-start;

    @media (max-width: 768px) {
        flex-direction: row; /* Coloca GitHub e LinkedIn lado a lado */
    }
`;

const LinkExterno = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer',
})`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 500;
    color: #171515;
    text-decoration: none;

    &:hover {
        color: #0072b1;
    }

    svg {
        font-size: 1.5rem;
    }
`;

//Infos, Bio, Habilidades e Interesses
const ColunaDireita = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    text-align: left;
    flex: 1;
`;

const InfoPrincipal = styled.div`
    /* Estilos para o cabeçalho com nome e curso */
`;

const Nome = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.32rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Curso = styled.p`
    font-size: 1.125rem;
    margin: 0;
    padding: 0 0 0 0.2rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #1f1e1eff;
`;

const Secao = styled.div``;

const SecaoTitulo = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.625rem 0;
`;

const Bio = styled.p`
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
    max-height: 6.25rem;
    overflow-y: auto; /*Adiciona scroll se a bio for mt grande*/
    word-break: break-word;

    /* Esconde a barra de rolagem na maioria dos navegadores */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const Tag = styled.span`
    padding: 0.375rem 0.875rem;
    border-radius: 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
`;

const FooterAcoes = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.95rem;
    margin-top: 0.95rem;
    padding-top: 0.95rem;
    border-top: 1px solid #eee;
`;

// função para o modal tipo integrante, já que ele tem botões + ações
function PerfilUsuarioModal({
    isOpen,
    onClose,
    usuario,
    onAceitar,
    onRejeitar,
    loading,
    tipo = 'candidato',
}) {
    if (!isOpen || !usuario) return null;

    const todasAsTags = [
        ...(usuario.habilidades || []).map((h) => ({
            nome: h,
            tipo: 'habilidade',
        })),
        ...(usuario.interesses || []).map((i) => ({
            nome: i,
            tipo: 'interesse',
        })),
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="large">
            <ModalWrapper>
                <ColunaEsquerda>
                    <Avatar $bgColor={usuario.avatarColor}>
                        {getInitials(usuario.nome, usuario.sobrenome)}
                    </Avatar>
                    <LinksSociais>
                        {usuario.github && (
                            <LinkExterno href={usuario.github}>
                                <FiGithub /> GitHub
                            </LinkExterno>
                        )}
                        {usuario.linkedin && (
                            <LinkExterno href={usuario.linkedin}>
                                <FiLinkedin /> LinkedIn
                            </LinkExterno>
                        )}
                    </LinksSociais>
                </ColunaEsquerda>

                <ColunaDireita>
                    <InfoPrincipal>
                        <Nome>
                            <FiUser /> {usuario.nome} {usuario.sobrenome}
                        </Nome>
                        <Curso>
                            <FaGraduationCap />{' '}
                            {usuario.curso || 'Curso não informado'}
                        </Curso>
                    </InfoPrincipal>

                    <Secao>
                        <SecaoTitulo>Sobre mim</SecaoTitulo>
                        <Bio>
                            {usuario.bio ||
                                'Este usuário ainda não preencheu a sua biografia.'}
                        </Bio>
                    </Secao>

                    {todasAsTags.length > 0 && (
                        <Secao>
                            <SecaoTitulo>Habilidades e Interesses</SecaoTitulo>
                            <TagsContainer>
                                {todasAsTags.map((tag) => (
                                    <Tag key={tag.nome} $tipo={tag.tipo}>
                                        {tag.nome}
                                    </Tag>
                                ))}
                            </TagsContainer>
                        </Secao>
                    )}

                    {/* Renderização condicional do Footer */}
                    {tipo === 'candidato' && (
                        <FooterAcoes>
                            <Botao
                                variant="hab-int"
                                onClick={() => onAceitar && onAceitar(usuario)}
                                disabled={loading}
                            >
                                Aceitar
                            </Botao>
                            <Botao
                                variant="excluir"
                                onClick={() =>
                                    onRejeitar && onRejeitar(usuario)
                                }
                                disabled={loading}
                            >
                                Rejeitar
                            </Botao>
                        </FooterAcoes>
                    )}
                </ColunaDireita>
            </ModalWrapper>
        </Modal>
    );
}

export default PerfilUsuarioModal;
