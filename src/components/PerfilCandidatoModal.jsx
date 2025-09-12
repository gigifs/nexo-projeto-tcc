import styled from 'styled-components';
import Modal from './Modal';
import Botao from './Botao';
import { FiUser, FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const ModalWrapper = styled.div`
    padding: 20px;
    color: #333;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
`;

const Avatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 36px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const InfoPrincipal = styled.div`
    text-align: left;
`;

const Nome = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin: 0;
`;

const Curso = styled.p`
    font-size: 18px;
    margin: 5px 0 0 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Secao = styled.div`
    margin-bottom: 20px;
    text-align: left;
`;

const SecaoTitulo = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
`;

const Bio = styled.p`
    font-size: 16px;
    line-height: 1.5;
`;

const FooterAcoes = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome.charAt(0)}${sobrenome ? sobrenome.charAt(0) : ''}`.toUpperCase();
};

function PerfilCandidatoModal({isOpen, onClose, candidato, onAceitar, onRejeitar, loading }) {
    if (!isOpen || !candidato) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="large">
            <ModalWrapper>
                <Header>
                    <Avatar>{getInitials(candidato.nome, candidato.sobrenome)}</Avatar>
                    <InfoPrincipal>
                        <Nome>{candidato.nome} {candidato.sobrenome}</Nome>
                        <Curso><FaGraduationCap /> {candidato.curso || 'Curso não informado'}</Curso>
                    </InfoPrincipal>
                </Header>

                <Secao>
                    <SecaoTitulo>Sobre mim</SecaoTitulo>
                    <Bio>{candidato.bio || 'Este utilizador ainda não preencheu a sua biografia.'}</Bio>
                </Secao>

                {/* Futuramente, podemos adicionar as Habilidades e Interesses aqui */}

                <FooterAcoes>
                    <Botao 
                    variant="hab-int"
                    onClick={() => onAceitar(candidato)}
                    disabled={loading}
                    >
                        Aceitar
                    </Botao>
                    <Botao 
                    variant="excluir"
                    onClick={() => onRejeitar(candidato)} 
                    disabled={loading}
                    >
                        Rejeitar
                    </Botao>
                </FooterAcoes>
            </ModalWrapper>
        </Modal>
    );
}

export default PerfilCandidatoModal;