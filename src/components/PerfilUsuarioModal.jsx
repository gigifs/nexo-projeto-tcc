import styled from 'styled-components';
import Modal from './Modal';
import Botao from './Botao';
import { FiGithub, FiLinkedin, FiUser, FiX } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const ModalWrapper = styled.div`
    display: flex;
    gap: 25px;
    padding: 20px 20px 20px 0;
    color: #000000;
`;

//Avatar e Links
const ColunaEsquerda = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
    padding: 15px 10px;
`;

const Avatar = styled.div`
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 40px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const LinksSociais = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
`;

const LinkExterno = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer',
})`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    color: #171515;
    text-decoration: none;

    &:hover {
        color: #0072B1;
    }

    svg {
        font-size: 24px;
    }
`;

//Infos, Bio, Habilidades e Interesses
const ColunaDireita = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    text-align: left;
    flex: 1;
`;

const InfoPrincipal = styled.div`
    /* Estilos para o cabeçalho com nome e curso */
`;

const Nome = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Curso = styled.p`
    font-size: 18px;
    margin: 0;
    padding: 0 0 0 3px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #1f1e1eff;
`;

const Secao = styled.div``;

const SecaoTitulo = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 10px 0;
`;

const Bio = styled.p`
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Tag = styled.span`
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#aed9f4' : '#ffcced'};
    color: ${(props) =>
        props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0'};
`;

const FooterAcoes = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome.charAt(0)}${sobrenome ? sobrenome.charAt(0) : ''}`.toUpperCase();
};

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
    if (!isOpen || !usuario) {
        return null;
    }

    const todasAsTags = [
        ...(usuario.habilidades || []).map((h) => ({ nome: h, tipo: 'habilidade' })),
        ...(usuario.interesses || []).map((i) => ({ nome: i, tipo: 'interesse' })),
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="large">
            <ModalWrapper>

                <ColunaEsquerda>
                    <Avatar $bgColor={usuario.avatarColor}>{getInitials(usuario.nome, usuario.sobrenome)}</Avatar>
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
                            <FaGraduationCap /> {usuario.curso || 'Curso não informado'}
                        </Curso>
                    </InfoPrincipal>

                    <Secao>
                        <SecaoTitulo>Sobre mim</SecaoTitulo>
                        <Bio>
                            {usuario.bio || 'Este usuário ainda não preencheu a sua biografia.'}
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
                                onClick={() => onRejeitar && onRejeitar(usuario)}
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