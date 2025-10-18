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

const CarregandoMaisBotao = styled.button`
    background: #e6ebf0;
    border: none;
    padding: 8px 15px;
    border-radius: 15px;
    margin: 10px auto;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background: #d1d9e1;
    }
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
        <JanelaChatContainer>
            <ChatHeader
                conversa={conversa}
                getSubtituloConversa={getSubtituloConversa}
                handleHeaderClick={handleHeaderClick}
                getInitials={getInitials}
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
