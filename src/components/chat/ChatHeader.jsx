import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const ChatHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
    background-color: #e6ebf0;
    cursor: pointer;
    border-radius: 0 20px 0 0; /* Arredonda os cantos certos */
`;

const Avatar = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const InfoConversa = styled.div`
    flex-grow: 1;
    overflow: hidden;
    min-width: 0;
    max-width: 550px;
`;

const NomeConversa = styled.h4`
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Subtitulo = styled.p`
    font-size: 14px;
    margin: 4px 0 0;
    color: #555;
`;

function ChatHeader({
    conversa,
    getSubtituloConversa,
    handleHeaderClick,
    getInitials,
}) {
    const { currentUser } = useAuth();

    // Esta função agora pode ser mais simples, pois getInitials é passado via props
    const getNomeConversa = () => {
        if (!conversa) return '';
        if (conversa.isGrupo) return conversa.nomeGrupo;
        const outro = conversa.participantesInfo?.find(
            (p) => p.uid !== currentUser.uid
        );
        return outro ? `${outro.nome} ${outro.sobrenome}` : 'Conversa Privada';
    };

    return (
        <ChatHeaderContainer onClick={handleHeaderClick}>
            <Avatar>{getInitials(getNomeConversa())}</Avatar>
            <InfoConversa>
                <NomeConversa>{getNomeConversa()}</NomeConversa>
                <Subtitulo>{getSubtituloConversa()}</Subtitulo>
            </InfoConversa>
        </ChatHeaderContainer>
    );
}

export default ChatHeader;
