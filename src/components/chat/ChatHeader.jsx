import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import { getInitials } from '../../utils/iniciaisNome'; // Importação

const ChatHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
    background-color: #e6ebf0;
    border-radius: 0 20px 0 0;

    @media (max-width: 1024px) {
        border-radius: 20px 20px 0 0;
        padding: 10px 15px;
        gap: 10px;
    }

    @media (max-width: 480px) {
        padding: 10px 15px;
        gap: 10px;
        border-radius: 0;
    }
`;

const BackButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    font-size: 24px;
    padding: 5px;
    margin-right: 5px;
    align-items: center;
    justify-content: center;

    @media (max-width: 1024px) {
        display: flex;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    flex-grow: 1;
    min-width: 0; /* Para o ellipsis funcionar */
    cursor: pointer;

    @media (max-width: 1024px) {
        gap: 10px;
    }
`;

const Avatar = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @media (max-width: 480px) {
        width: 40px; /* Avatar um pouco menor */
        height: 40px;
        font-size: 16px;
    }
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
    getAvatarColorConversa,
    onCloseChat,
}) {
    const { currentUser } = useAuth();

    const getNomeConversa = () => {
        if (!conversa) return '';
        if (conversa.isGrupo) return conversa.nomeGrupo;
        const outro = conversa.participantesInfo?.find(
            (p) => p.uid !== currentUser.uid
        );
        return outro ? `${outro.nome} ${outro.sobrenome}` : 'Conversa Privada';
    };

    return (
        <ChatHeaderContainer>
            <BackButton onClick={onCloseChat}>
                <FiArrowLeft />
            </BackButton>

            <InfoContainer onClick={handleHeaderClick}>
                <Avatar $bgColor={getAvatarColorConversa(conversa)}>
                    {getInitials(getNomeConversa())}
                </Avatar>
                <InfoConversa>
                    <NomeConversa>{getNomeConversa()}</NomeConversa>
                    <Subtitulo>{getSubtituloConversa()}</Subtitulo>
                </InfoConversa>
            </InfoContainer>
        </ChatHeaderContainer>
    );
}

export default ChatHeader;
