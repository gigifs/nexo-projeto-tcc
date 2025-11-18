import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import Mensagem from './Mensagem';
import MensagemInput from './MensagemInput';

const JanelaChatContainer = styled.div`
    flex-grow: 1;
    background-color: #f5fafc;
    border-radius: 0 20px 20px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;

    @media (max-width: 1024px) {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        /* Animação de slide baseada na prop $ativo */
        transform: translateX(${({ $ativo }) => ($ativo ? '0' : '100%')});
        transition: transform 0.3s ease-in-out;
        z-index: 10;
        border-radius: 20px; /* Borda completa em mobile */
    }
`;

const MensagensArea = styled.div`
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

const Placeholder = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #888;
    font-size: 18px;
`;

function JanelaChat({
    conversa,
    mensagens,
    getSubtituloConversa,
    handleCarregarMais,
    handleEnviarMensagem,
    handleTyping,
    handleHeaderClick,
    mensagensAreaRef,
    carregandoMais,
    primeiraMensagemVisivel,
    getInitials,
    getAvatarColorConversa,
    $isChatActive,
    onCloseChat,
}) {
    const fimMensagensRef = useRef(null);

    // Efeito para rolar para o final quando novas mensagens chegam
    useEffect(() => {
        if (fimMensagensRef.current) {
            fimMensagensRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [mensagens]);

    if (!conversa) {
        return (
            <JanelaChatContainer>
                <Placeholder>Selecione uma conversa para começar</Placeholder>
            </JanelaChatContainer>
        );
    }

    return (
        <JanelaChatContainer $ativo={$isChatActive}>
            <ChatHeader
                conversa={conversa}
                getSubtituloConversa={getSubtituloConversa}
                handleHeaderClick={handleHeaderClick}
                getInitials={getInitials}
                getAvatarColorConversa={getAvatarColorConversa}
                onCloseChat={onCloseChat}
            />
            <MensagensArea
                ref={mensagensAreaRef}
                onScroll={(e) => {
                    if (e.target.scrollTop === 0) {
                        handleCarregarMais();
                    }
                }}
            >
                {!primeiraMensagemVisivel && !carregandoMais && (
                    <p style={{ textAlign: 'center', color: '#888' }}>
                        Início da conversa.
                    </p>
                )}
                {carregandoMais && (
                    <p style={{ textAlign: 'center', color: '#888' }}>
                        Carregando...
                    </p>
                )}
                {mensagens.map((msg) => (
                    <Mensagem
                        key={msg.id}
                        mensagem={msg}
                        participantesInfo={conversa.participantesInfo}
                        getInitials={getInitials}
                    />
                ))}
                <div ref={fimMensagensRef} />
            </MensagensArea>
            <MensagemInput
                conversaId={conversa.id}
                onEnviarMensagem={handleEnviarMensagem}
                onTyping={handleTyping}
            />
        </JanelaChatContainer>
    );
}

export default JanelaChat;
