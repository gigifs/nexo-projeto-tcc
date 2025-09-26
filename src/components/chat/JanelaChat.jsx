import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    limit,
    startAfter,
    getDocs,
    doc,
} from 'firebase/firestore';
import ChatHeader from './ChatHeader';
import Mensagem from './Mensagem';
import MensagemInput from './MensagemInput';

const JanelaChatContainer = styled.div`
    flex-grow: 1;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
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

function JanelaChat({ conversaId }) {
    const [conversa, setConversa] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [ultimoDoc, setUltimoDoc] = useState(null); // Para paginação
    const [semMaisMensagens, setSemMaisMensagens] = useState(false);
    const fimMensagensRef = useRef(null);

    // Efeito para buscar os dados da conversa ativa
    useEffect(() => {
        if (!conversaId) {
            setConversa(null);
            return;
        }
        const unsub = onSnapshot(doc(db, 'conversas', conversaId), (doc) => {
            setConversa({ id: doc.id, ...doc.data() });
        });
        return () => unsub();
    }, [conversaId]);

    // Efeito para buscar o lote inicial de mensagens
    useEffect(() => {
        if (!conversaId) return;

        const q = query(
            collection(db, 'conversas', conversaId, 'mensagens'),
            orderBy('timestamp', 'desc'),
            limit(15)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .reverse();
            setMensagens(msgs);
            setUltimoDoc(snapshot.docs[snapshot.docs.length - 1]);
            setSemMaisMensagens(snapshot.empty);

            // Rola para o final apenas na carga inicial
            setTimeout(() => fimMensagensRef.current?.scrollIntoView(), 0);
        });

        return () => unsubscribe();
    }, [conversaId]);

    const carregarMaisMensagens = async () => {
        if (!ultimoDoc || semMaisMensagens) return;

        const q = query(
            collection(db, 'conversas', conversaId, 'mensagens'),
            orderBy('timestamp', 'desc'),
            startAfter(ultimoDoc),
            limit(15)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const novasMsgs = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .reverse();
            setMensagens((prev) => [...novasMsgs, ...prev]);
            setUltimoDoc(snapshot.docs[snapshot.docs.length - 1]);
        } else {
            setSemMaisMensagens(true);
        }
    };

    if (!conversa) {
        return (
            <JanelaChatContainer>
                <Placeholder>Selecione uma conversa para começar</Placeholder>
            </JanelaChatContainer>
        );
    }

    return (
        <JanelaChatContainer>
            <ChatHeader conversa={conversa} />
            <MensagensArea>
                {!semMaisMensagens && (
                    <CarregandoMaisBotao onClick={carregarMaisMensagens}>
                        Carregar mais
                    </CarregandoMaisBotao>
                )}
                {mensagens.map((msg) => (
                    <Mensagem key={msg.id} mensagem={msg} />
                ))}
                <div ref={fimMensagensRef} />
            </MensagensArea>
            <MensagemInput conversaId={conversa.id} />
        </JanelaChatContainer>
    );
}

export default JanelaChat;
