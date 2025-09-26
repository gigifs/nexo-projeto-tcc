import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const MensagemLinha = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    max-width: 75%;
    align-self: ${({ $isSender }) => ($isSender ? 'flex-end' : 'flex-start')};
    flex-direction: ${({ $isSender }) => ($isSender ? 'row-reverse' : 'row')};
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    align-self: flex-start;
`;

const BolhaMensagem = styled.div`
    padding: 10px 15px;
    border-radius: 20px;
    background-color: ${({ $isSender }) => ($isSender ? '#7c2256' : '#e6ebf0')};
    color: ${({ $isSender }) => ($isSender ? '#fff' : '#000')};
    word-break: break-word;

    strong {
        display: block;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 4px;
        opacity: 0.8;
    }

    p {
        margin: 0;
        display: inline;
    }
`;

const TimestampTexto = styled.span`
    font-size: 12px;
    color: ${({ $isSender }) => ($isSender ? '#ffffff99' : '#00000099')};
    margin-top: 5px;
    margin-left: 10px; /* Espaçamento para o tempo */
    text-align: right;
    display: block;
`;

const getInitials = (name = '', sobrenome = '') => {
    return `${name.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
};

const formatarTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

function Mensagem({ mensagem }) {
    const { currentUser } = useAuth();
    const isSender = mensagem.senderId === currentUser.uid;

    return (
        <MensagemLinha $isSender={isSender}>
            {!isSender && (
                <Avatar>
                    {getInitials(mensagem.senderNome, mensagem.senderSobrenome)}
                </Avatar>
            )}
            <BolhaMensagem $isSender={isSender}>
                {!isSender && (
                    <strong>
                        {mensagem.senderNome} {mensagem.senderSobrenome}
                    </strong>
                )}
                <p>{mensagem.texto}</p>
                <TimestampTexto $isSender={isSender}>
                    {formatarTimestamp(mensagem.timestamp)}
                </TimestampTexto>
            </BolhaMensagem>
        </MensagemLinha>
    );
}

export default Mensagem;
