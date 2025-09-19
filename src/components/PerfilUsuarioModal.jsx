// Em src/components/PerfilUsuarioModal.jsx

import styled from 'styled-components';
import Modal from './Modal';
import Botao from './Botao';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

// Seus styled-components (copiados do seu antigo PerfilCandidatoModal, mas sem a parte de InfoPrincipal)
const ModalWrapper = styled.div`
    display: flex;
    padding: 30px;
    gap: 25px;
    color: #333;
`;

const ColunaEsquerda = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
`;

const ColunaDireita = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    text-align: left;
`;

const Avatar = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 48px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const LinkExterno = styled.a`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    color: #000;
    text-decoration: none;
    &:hover {
        color: #0a528a;
    }
`;

const InfoLinha = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
`;

const Nome = styled.h2`
    font-size: 22px;
    font-weight: 600;
    margin: 0;
`;

const Curso = styled.p`
    margin: 0;
`;

const SecaoTitulo = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    margin-top: 0;
`;

const SecaoConteudo = styled.p`
    font-size: 16px;
    line-height: 1.4;
    margin: 0;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
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

const FooterAcoes = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    grid-column: 1 / -1; // Faz o footer ocupar as duas colunas
`;

const getInitials = (nome = '', sobrenome = '') => {
    const nomeCompleto = `${nome} ${sobrenome}`.trim();
    if (!nomeCompleto) return '?';
    const parts = nomeCompleto.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nomeCompleto.substring(0, 2).toUpperCase();
};

function PerfilUsuarioModal({
    isOpen,
    onClose,
    usuario,
    tipo = 'visualizacao',
    onAceitar,
    onRejeitar,
    loading,
}) {
    if (!isOpen || !usuario) {
        return null;
    }

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
        <Modal isOpen={isOpen} onClose={onClose} size="small">
            <ModalWrapper>
                <ColunaEsquerda>
                    <Avatar>
                        {getInitials(usuario.nome, usuario.sobrenome)}
                    </Avatar>
                    <LinkExterno href="#">
                        <FiGithub size={22} /> GitHub
                    </LinkExterno>
                    <LinkExterno href="#">
                        <FiLinkedin size={22} /> LinkedIn
                    </LinkExterno>
                </ColunaEsquerda>

                <ColunaDireita>
                    <InfoLinha>
                        <Nome>
                            {usuario.nome} {usuario.sobrenome}
                        </Nome>
                    </InfoLinha>
                    <InfoLinha>
                        <FaGraduationCap />
                        <Curso>{usuario.curso || 'Curso não informado'}</Curso>
                    </InfoLinha>

                    <div>
                        <SecaoTitulo>Sobre mim</SecaoTitulo>
                        <SecaoConteudo>
                            {usuario.bio || 'Nenhuma descrição fornecida.'}
                        </SecaoConteudo>
                    </div>

                    <div>
                        <SecaoTitulo>Habilidades e Interesses</SecaoTitulo>
                        <TagsContainer>
                            {todasAsTags.map((tag) => (
                                <Tag key={tag.nome} $tipo={tag.tipo}>
                                    {tag.nome}
                                </Tag>
                            ))}
                        </TagsContainer>
                    </div>
                </ColunaDireita>

                {/* Mostra os botões apenas se o tipo for 'candidato' */}
                {tipo === 'candidato' && (
                    <FooterAcoes>
                        <Botao
                            variant="hab-int"
                            onClick={() => onAceitar(usuario)}
                            disabled={loading}
                        >
                            Aceitar
                        </Botao>
                        <Botao
                            variant="excluir"
                            onClick={() => onRejeitar(usuario)}
                            disabled={loading}
                        >
                            Rejeitar
                        </Botao>
                    </FooterAcoes>
                )}
            </ModalWrapper>
        </Modal>
    );
}

export default PerfilUsuarioModal;
