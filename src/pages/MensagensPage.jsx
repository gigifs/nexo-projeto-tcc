import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    getDoc,
    getDocs,
    limit,
    startAfter,
} from 'firebase/firestore';
import ConversaLista from '../components/chat/ConversaLista';
import JanelaChat from '../components/chat/JanelaChat';
import Modal from '../components/Modal';
import VerDetalhesModal from '../components/VerDetalhesModal';
import PerfilUsuarioModal from '../components/PerfilUsuarioModal';
import { FiMessageSquare } from 'react-icons/fi';

const ChatLayout = styled.div`
    display: flex;
    height: 650px;
    margin-top: 30px;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    @media (max-width: 1024px) {
        margin-top: 1.25rem;
        position: relative;
        height: auto;
        height: 600px;
    }

    @media (max-width: 480px) {
        height: calc(100vh - 140px); /* Ocupa a tela disponível - o header */
        margin-top: 10px;
    }
`;

const Placeholder = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    height: 100%;
    color: #888;
    font-size: 24px;
    font-weight: 500;
    padding: 20px;
    text-align: center;
    border-radius: 0 20px 20px 0;
    background-color: #f5fafc;

    svg {
        /* Estilo para o ícone */
        font-size: 60px;
        color: #b0b0b0;
        margin-bottom: 20px;
    }

    p {
        /* Estilo para o subtítulo */
        font-size: 18px;
        font-weight: 300;
        color: #a0a0a0;
        margin-top: 5px;
    }

    @media (max-width: 1024px) {
        display: none;
    }
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    if (!sobrenome) return nome.substring(0, 2).toUpperCase();
    return `${nome[0]}${sobrenome[0]}`.toUpperCase();
};

const formatarTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

function MensagensPage() {
    const location = useLocation();
    const { currentUser, userData } = useAuth();
    const [conversas, setConversas] = useState([]);
    const [conversaAtivaId, setConversaAtivaId] = useState(
        location.state?.activeChatId || null
    );
    const [mensagens, setMensagens] = useState([]);
    const [primeiraMensagemVisivel, setPrimeiraMensagemVisivel] =
        useState(null);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [ultimaMensagemVisivel, setUltimaMensagemVisivel] = useState(null);
    const mensagensAreaRef = useRef(null);

    const [busca, setBusca] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('grupos');
    const [statusOutroUsuario, setStatusOutroUsuario] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [conteudoModal, setConteudoModal] = useState({
        tipo: null,
        dados: null,
    });
    const typingTimeoutRef = useRef(null);

    const conversaAtiva = conversas.find((c) => c.id === conversaAtivaId);

    useEffect(() => {
        if (location.state?.activeChatId) {
            setConversaAtivaId(location.state.activeChatId);
        }
    }, [location.state]);

    // Efeito para buscar TODAS as conversas do usuário
    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'conversas'),
            where('participantes', 'array-contains', currentUser.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const listaConversas = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setConversas(listaConversas);
        });
        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || conversas.length === 0) return;

        const sincronizarCores = async () => {
            const conversasParaChecar = conversas.filter((c) => !c.isGrupo);

            for (const conversa of conversasParaChecar) {
                const outroUsuarioInfo = conversa.participantesInfo.find(
                    (p) => p.uid !== currentUser.uid
                );

                if (outroUsuarioInfo) {
                    try {
                        const userRef = doc(db, 'users', outroUsuarioInfo.uid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const dadosReais = userSnap.data();
                            // Define a cor real (ou azul se não tiver)
                            const corReal = dadosReais.avatarColor || '#0a528a';

                            if (outroUsuarioInfo.avatarColor !== corReal) {
                                console.log(
                                    `Cor desatualizada detectada para ${outroUsuarioInfo.nome}. Corrigindo...`
                                );

                                const novaListaParticipantes =
                                    conversa.participantesInfo.map((p) =>
                                        p.uid === outroUsuarioInfo.uid
                                            ? { ...p, avatarColor: corReal }
                                            : p
                                    );
                                const conversaRef = doc(
                                    db,
                                    'conversas',
                                    conversa.id
                                );
                                await updateDoc(conversaRef, {
                                    participantesInfo: novaListaParticipantes,
                                });
                            }
                        }
                    } catch (error) {
                        console.error(
                            'Erro silencioso ao sincronizar cor:',
                            error
                        );
                    }
                }
            }
        };

        sincronizarCores();
    }, [conversas.length, currentUser]);

    // Efeito para buscar as MENSAGENS da conversa ativa (com paginação)
    useEffect(() => {
        const fetchInitialMessages = async () => {
            if (!conversaAtivaId) {
                setMensagens([]);
                return;
            }
            const q = query(
                collection(db, 'conversas', conversaAtivaId, 'mensagens'),
                orderBy('timestamp', 'desc'),
                limit(15)
            );
            const querySnapshot = await getDocs(q);
            const listaMensagens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPrimeiraMensagemVisivel(
                querySnapshot.docs[querySnapshot.docs.length - 1]
            );
            setUltimaMensagemVisivel(querySnapshot.docs[0]);
            setMensagens(listaMensagens.reverse());
            setTimeout(() => {
                if (mensagensAreaRef.current) {
                    mensagensAreaRef.current.scrollTop =
                        mensagensAreaRef.current.scrollHeight;
                }
            }, 0);
        };
        fetchInitialMessages();
        return () => {
            setMensagens([]);
            setPrimeiraMensagemVisivel(null);
            setUltimaMensagemVisivel(null);
        };
    }, [conversaAtivaId]);

    // Efeito para ouvir apenas mensagens NOVAS
    useEffect(() => {
        if (!conversaAtivaId) return;
        let q;
        if (ultimaMensagemVisivel) {
            q = query(
                collection(db, 'conversas', conversaAtivaId, 'mensagens'),
                where('timestamp', '>', ultimaMensagemVisivel.data().timestamp),
                orderBy('timestamp', 'asc')
            );
        } else {
            q = query(
                collection(db, 'conversas', conversaAtivaId, 'mensagens'),
                orderBy('timestamp', 'asc')
            );
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) return;

            const novasMensagens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setMensagens((mensagensAtuais) => {
                const idsExistentes = new Set(mensagensAtuais.map((m) => m.id));

                const mensagensRealmenteNovas = novasMensagens.filter(
                    (m) => !idsExistentes.has(m.id)
                );

                if (mensagensRealmenteNovas.length === 0)
                    return mensagensAtuais;

                const ultimoDoc =
                    querySnapshot.docs[querySnapshot.docs.length - 1];
                setUltimaMensagemVisivel(ultimoDoc);

                if (mensagensAtuais.length === 0) {
                    setPrimeiraMensagemVisivel(querySnapshot.docs[0]);
                }

                setTimeout(() => {
                    if (mensagensAreaRef.current) {
                        mensagensAreaRef.current.scrollTop =
                            mensagensAreaRef.current.scrollHeight;
                    }
                }, 100);
                return [...mensagensAtuais, ...mensagensRealmenteNovas];
            });
        });

        return () => unsubscribe();
    }, [conversaAtivaId, ultimaMensagemVisivel]);

    useEffect(() => {
        if (conversaAtivaId && currentUser) {
            const conversaRef = doc(db, 'conversas', conversaAtivaId);
            updateDoc(conversaRef, {
                [`unreadCounts.${currentUser.uid}`]: 0,
            }).catch((err) => console.error('Falha ao marcar como lido:', err));
        }
    }, [conversaAtivaId, currentUser]);

    useEffect(() => {
        if (!conversaAtiva || conversaAtiva.isGrupo) {
            setStatusOutroUsuario(null);
            return;
        }

        const outroUsuario = conversaAtiva.participantesInfo.find(
            (p) => p.uid !== currentUser.uid
        );

        if (!outroUsuario) return;

        const userDocRef = doc(db, 'users', outroUsuario.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setStatusOutroUsuario(userData.status);

                setConversas((prevConversas) =>
                    prevConversas.map((c) => {
                        if (c.id === conversaAtivaId) {
                            const novosParticipantesInfo =
                                c.participantesInfo.map((p) => {
                                    if (p.uid === outroUsuario.uid) {
                                        return {
                                            ...p,
                                            avatarColor: userData.avatarColor,
                                        };
                                    }
                                    return p;
                                });
                            return {
                                ...c,
                                participantesInfo: novosParticipantesInfo,
                            };
                        }
                        return c;
                    })
                );
            }
        });

        return () => unsubscribe();
    }, [conversaAtivaId, currentUser, conversaAtiva]);

    const getNomeConversa = useCallback(
        (conversa) => {
            if (conversa.isGrupo) return conversa.nomeGrupo;
            const outroUsuario = conversa.participantesInfo?.find(
                (p) => p.uid !== currentUser.uid
            );
            return outroUsuario
                ? `${outroUsuario.nome} ${outroUsuario.sobrenome}`
                : 'Conversa Privada';
        },
        [currentUser]
    );

    const getAvatarColorConversa = useCallback(
        (conversa) => {
            if (!conversa) return '#0a528a';

            if (conversa.isGrupo) {
                if (conversa.avatarColor && conversa.avatarColor !== '#0a528a')
                    return conversa.avatarColor;
                if (conversa.corProjeto && conversa.corProjeto !== '#0a528a')
                    return conversa.corProjeto;
                return '#0a528a';
            }

            const outroUsuario = conversa.participantesInfo?.find(
                (p) => p.uid !== currentUser.uid
            );
            return outroUsuario?.avatarColor || '#0a528a';
        },
        [currentUser]
    );

    const getSubtituloConversa = useCallback(() => {
        if (!conversaAtiva) return '';
        const outrosAEscrever =
            conversaAtiva.escrevendo?.filter(
                (uid) => uid !== currentUser.uid
            ) || [];
        if (outrosAEscrever.length > 0) {
            const primeiroNome =
                conversaAtiva.participantesInfo.find(
                    (p) => p.uid === outrosAEscrever[0]
                )?.nome || 'Alguém';
            return `${primeiroNome} está a escrever...`;
        }
        if (conversaAtiva.isGrupo) {
            const numMembros = conversaAtiva.participantes?.length || 0;
            return `${numMembros} membro${numMembros !== 1 ? 's' : ''}`;
        }
        if (statusOutroUsuario?.online) return 'Online';
        if (statusOutroUsuario?.vistoPorUltimo)
            return `Visto por último às ${formatarTimestamp(statusOutroUsuario.vistoPorUltimo)}`;
        return 'Offline';
    }, [conversaAtiva, currentUser, statusOutroUsuario]);

    const handleCarregarMais = async () => {
        if (carregandoMais || !primeiraMensagemVisivel) return;

        setCarregandoMais(true);

        const scrollContainer = mensagensAreaRef.current;
        if (!scrollContainer) {
            setCarregandoMais(false);
            return;
        }

        const alturaScrollAntiga = scrollContainer.scrollHeight;
        const posicaoScrollAntiga = scrollContainer.scrollTop;

        const q = query(
            collection(db, 'conversas', conversaAtivaId, 'mensagens'),
            orderBy('timestamp', 'desc'),
            startAfter(primeiraMensagemVisivel),
            limit(15)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const novasMensagens = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .reverse();

            setPrimeiraMensagemVisivel(
                querySnapshot.docs[querySnapshot.docs.length - 1]
            );

            setMensagens((mensagensAtuais) => [
                ...novasMensagens,
                ...mensagensAtuais,
            ]);

            requestAnimationFrame(() => {
                const alturaScrollNova = scrollContainer.scrollHeight;
                scrollContainer.scrollTop =
                    alturaScrollNova - alturaScrollAntiga;
            });
        }

        setCarregandoMais(false);
    };

    const handleEnviarMensagem = async (texto) => {
        if (texto.trim() === '' || !conversaAtivaId) return;
        await addDoc(
            collection(db, 'conversas', conversaAtivaId, 'mensagens'),
            {
                texto,
                senderId: currentUser.uid,
                senderNome: userData.nome,
                senderSobrenome: userData.sobrenome,
                senderAvatarColor: userData.avatarColor || '#0a528a',
                timestamp: serverTimestamp(),
            }
        );
        const conversaRef = doc(db, 'conversas', conversaAtivaId);
        const updates = {
            ultimaMensagem: {
                texto,
                timestamp: serverTimestamp(),
                senderNome: userData.nome,
            },
        };
        conversaAtiva.participantes.forEach((uid) => {
            if (uid !== currentUser.uid)
                updates[`unreadCounts.${uid}`] = increment(1);
        });
        await updateDoc(conversaRef, updates);
    };

    const handleTyping = useCallback(
        (isTyping) => {
            if (!conversaAtivaId) return;
            const conversaRef = doc(db, 'conversas', conversaAtivaId);
            if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
            if (isTyping) {
                updateDoc(conversaRef, {
                    escrevendo: arrayUnion(currentUser.uid),
                });
                typingTimeoutRef.current = setTimeout(() => {
                    updateDoc(conversaRef, {
                        escrevendo: arrayRemove(currentUser.uid),
                    });
                }, 2000);
            }
        },
        [conversaAtivaId, currentUser]
    );

    const handleHeaderClick = async () => {
        if (!conversaAtiva) return;
        if (conversaAtiva.isGrupo) {
            const projetoRef = doc(db, 'projetos', conversaAtiva.projetoId);
            const projetoSnap = await getDoc(projetoRef);
            if (projetoSnap.exists()) {
                setConteudoModal({
                    tipo: 'projeto',
                    dados: { id: projetoSnap.id, ...projetoSnap.data() },
                });
                setModalAberto(true);
            }
        } else {
            const outroUsuarioInfo = conversaAtiva.participantesInfo.find(
                (p) => p.uid !== currentUser.uid
            );
            if (!outroUsuarioInfo) return;
            const userRef = doc(db, 'users', outroUsuarioInfo.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setConteudoModal({
                    tipo: 'perfil',
                    dados: { id: userSnap.id, ...userSnap.data() },
                });
                setModalAberto(true);
            }
        }
    };

    return (
        <>
            <DashboardHeader titulo="Mensagens">
                Conecte-se e organize as suas conversas.
            </DashboardHeader>

            <ChatLayout>
                <ConversaLista
                    conversas={conversas}
                    currentUser={currentUser}
                    conversaAtivaId={conversaAtivaId}
                    onConversaSelect={setConversaAtivaId}
                    busca={busca}
                    setBusca={setBusca}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    getNomeConversa={getNomeConversa}
                    getAvatarColorConversa={getAvatarColorConversa}
                    $isChatActive={!!conversaAtivaId}
                />

                {conversaAtiva ? (
                    <JanelaChat
                        conversa={conversaAtiva}
                        mensagens={mensagens}
                        getSubtituloConversa={getSubtituloConversa}
                        handleCarregarMais={handleCarregarMais}
                        handleEnviarMensagem={handleEnviarMensagem}
                        handleTyping={handleTyping}
                        handleHeaderClick={handleHeaderClick}
                        mensagensAreaRef={mensagensAreaRef}
                        carregandoMais={carregandoMais}
                        primeiraMensagemVisivel={primeiraMensagemVisivel}
                        getInitials={getInitials}
                        getAvatarColorConversa={getAvatarColorConversa}
                        $isChatActive={!!conversaAtivaId}
                        onCloseChat={() => setConversaAtivaId(null)}
                    />
                ) : (
                    <Placeholder>
                        <FiMessageSquare />
                        Selecione uma conversa...
                        <p>
                            Escolha uma conversa na lista para ver as mensagens
                        </p>
                    </Placeholder>
                )}
            </ChatLayout>
            <Modal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                size="large"
            >
                {conteudoModal.tipo === 'projeto' && (
                    <VerDetalhesModal
                        projeto={conteudoModal.dados}
                        projetoId={conteudoModal.dados.id}
                        onClose={() => setModalAberto(false)}
                    />
                )}
                {conteudoModal.tipo === 'perfil' && (
                    <PerfilUsuarioModal
                        isOpen={true}
                        usuario={conteudoModal.dados}
                        onClose={() => setModalAberto(false)}
                        tipo="integrante"
                    />
                )}
            </Modal>
        </>
    );
}

export default MensagensPage;
