import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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
} from 'firebase/firestore';
import { FiSearch } from 'react-icons/fi';
import Botao from '../components/Botao';
import Modal from '../components/Modal';
import VerDetalhesModal from '../components/VerDetalhesModal';
import PerfilUsuarioModal from '../components/PerfilUsuarioModal';
import { limit, startAfter } from 'firebase/firestore';

const ChatLayout = styled.div`
    display: flex;
    height: 650px;
    margin-top: 30px;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ColunaEsquerda = styled.div`
    width: 450px;
    border-radius: 20px;
    padding: 30px 50px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const BuscaContainer = styled.div`
    position: relative;
    width: 100%;
`;

const BuscaIcone = styled(FiSearch)`
    position: absolute;
    left: 15px;
    top: 50%;

    transform: translateY(-55%);
    color: #999;
    stroke-width: 3px;
`;

const BuscaInput = styled.input`
    width: 100%;
    padding: 12px 15px 12px 50px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    font-size: 16px;
    font-weight: 400;
    outline: none;
`;

const ContainerAbas = styled.div`
    width: 100%;
    background-color: #f5fafc;
    padding: 0 10px;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    gap: 30px;
`;

const Aba = styled.button`
    position: relative;
    padding: 12px 40px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    color: #000000ff; /* Cor padrão para inativo */
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;

    &:hover {
        color: #7c2256; /* Cor roxa no hover */
        font-weight: 600;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 2px; /* A espessura da linha */
        background-color: #7c2256;

        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    &.active {
        color: #7c2256;
        font-weight: 600;

        &::after {
            transform: scaleX(1); /* A linha expande para 100% da sua largura */
        }
    }
`;

const ListaScroll = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ItemConversa = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    background-color: #e6ebf0;
    border: 2px solid ${({ $ativo }) => ($ativo ? '#00000066' : 'transparent')};
    transition: all 0.2s ease-in-out;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const NomeConversa = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
`;

const UltimaMensagemContainer = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
`;

const RemetenteMensagem = styled.span`
    font-size: 14px;
    color: #333; /* Cor um pouco mais escura para destaque */
    font-weight: 500;
    margin-right: 4px; /* Espaço entre o nome e a mensagem */
    flex-shrink: 0; /* Impede que o nome do remetente seja espremido */
`;

const TextoUltimaMensagem = styled.span`
    font-size: 14px;
    color: #555;
    overflow: hidden; /* Garante que o texto da mensagem use a elipse */
    text-overflow: ellipsis;
`;

const BadgeNaoLido = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #19e337;
    color: white;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const JanelaChatContainer = styled.div`
    flex-grow: 1;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;

const ChatHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
    background-color: #e6ebf0;
`;

const MensagensArea = styled.div`
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

const MensagemLinha = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    max-width: 75%;
    align-self: ${({ $isSender }) => ($isSender ? 'flex-end' : 'flex-start')};

    // Inverte a ordem para mensagens enviadas (balão primeiro, avatar depois)
    flex-direction: ${({ $isSender }) => ($isSender ? 'row-reverse' : 'row')};
`;

const ListaDeMensagens = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const BolhaMensagem = styled.div`
    padding: 10px 15px;
    border-radius: 20px;
    background-color: ${({ $isSender }) => ($isSender ? '#7c2256' : '#e6ebf0')};
    color: ${({ $isSender }) => ($isSender ? '#fff' : '#000')};
    align-self: ${({ $isSender }) => ($isSender ? 'flex-end' : 'flex-start')};
    word-break: break-word;

    strong {
        display: block;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 4px;
        opacity: 0.8;
    }
`;

const TimestampTexto = styled.span`
    font-size: 12px;
    color: ${({ $isSender }) => ($isSender ? '#ffffff99' : '#00000099')};
    margin-top: 5px;
    text-align: right;
    display: block;
`;

const InputArea = styled.form`
    display: flex;
    padding: 20px;
    border-top: 1px solid #ddd;
    background-color: #e6ebf0;
`;

const InputMensagem = styled.input`
    flex-grow: 1;
    padding: 12px 20px;
    border: 1px solid #ccc;
    border-radius: 25px;
    outline: none;
    font-size: 16px;
    margin-right: 10px;
`;

const BotaoEnviar = styled.button`
    padding: 12px 20px;
    border-radius: 20px;
    font-size: 16px;
`;

const Placeholder = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #888;
    font-size: 18px;
`;

const getInitials = (name = '') => {
    const parts = name.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
    const [novaMensagem, setNovaMensagem] = useState('');
    const [primeiraMensagemVisivel, setPrimeiraMensagemVisivel] =
        useState(null);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [ultimaMensagemVisivel, setUltimaMensagemVisivel] = useState(null);
    const fimMensagensRef = useRef(null); // Referência para o final da lista de mensagens
    const mensagensAreaRef = useRef(null);

    const [busca, setBusca] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('grupos');

    const [statusOutroUsuario, setStatusOutroUsuario] = useState(null);

    const conversaAtiva = conversas.find((c) => c.id === conversaAtivaId);

    const [escrevendo, setEscrevendo] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [conteudoModal, setConteudoModal] = useState({
        tipo: null,
        dados: null,
    });
    const typingTimeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Se não houver uma conversa ativa, ou se for um grupo, não faz nada
        if (!conversaAtiva || conversaAtiva.isGrupo) {
            setStatusOutroUsuario(null); // Limpa o status
            return;
        }

        // Encontra o UID do outro utilizador na conversa
        const outroUsuario = conversaAtiva.participantesInfo.find(
            (p) => p.uid !== currentUser.uid
        );
        if (!outroUsuario) return;

        // Cria um "ouvinte" para o documento desse utilizador na coleção 'users'
        const userDocRef = doc(db, 'users', outroUsuario.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setStatusOutroUsuario(docSnap.data().status); // Guarda o objeto de status
            }
        });

        // Limpa o "ouvinte" quando a conversa ativa mudar
        return () => unsubscribe();
    }, [conversaAtiva, currentUser.uid]);

    // Função para rolar para a mensagem mais recente
    const scrollToBottom = () => {
        fimMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (location.state?.activeChatId) {
            setConversaAtivaId(location.state.activeChatId);
            // Determina qual aba deve estar ativa
            const chat = conversas.find(
                (c) => c.id === location.state.activeChatId
            );
            if (chat) {
                setAbaAtiva(chat.isGrupo ? 'grupos' : 'diretas');
            }
        }
    }, [location.state, conversas]);

    // Este useEffect garante que, se você navegar para a página de mensagens
    // de outra forma, o estado ainda seja atualizado.
    useEffect(() => {
        if (location.state?.activeChatId) {
            setConversaAtivaId(location.state.activeChatId);
        }
    }, [location.state]);

    // Efeito para buscar as CONVERSAS do usuário
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

    // Efeito para buscar as MENSAGENS da conversa ativa
    // NOVO useEffect 1: Busca o lote inicial de mensagens UMA VEZ
    useEffect(() => {
        const fetchInitialMessages = async () => {
            if (!conversaAtivaId) {
                setMensagens([]);
                return;
            }

            const q = query(
                collection(db, 'conversas', conversaAtivaId, 'mensagens'),
                orderBy('timestamp', 'desc'),
                limit(15) // Buscamos as 15 mais recentes
            );

            const querySnapshot = await getDocs(q);
            const listaMensagens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Define os cursores para a paginação e para o ouvinte de tempo real
            setPrimeiraMensagemVisivel(
                querySnapshot.docs[querySnapshot.docs.length - 1]
            );
            setUltimaMensagemVisivel(querySnapshot.docs[0]); // O primeiro doc é o mais recente

            setMensagens(listaMensagens.reverse());
        };

        fetchInitialMessages();

        // Limpa tudo ao trocar de conversa
        return () => {
            setMensagens([]);
            setPrimeiraMensagemVisivel(null);
            setUltimaMensagemVisivel(null);
        };
    }, [conversaAtivaId]);

    // NOVO useEffect 2: Ouve APENAS por mensagens NOVAS
    useEffect(() => {
        if (!conversaAtivaId || !ultimaMensagemVisivel) {
            return;
        }

        const q = query(
            collection(db, 'conversas', conversaAtivaId, 'mensagens'),
            where('timestamp', '>', ultimaMensagemVisivel.data().timestamp) // A MÁGICA ACONTECE AQUI
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const novasMensagens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (novasMensagens.length > 0) {
                // Adiciona as novas mensagens no FIM do array existente
                setMensagens((mensagensAtuais) => [
                    ...mensagensAtuais,
                    ...novasMensagens,
                ]);
                // Atualiza o cursor da última mensagem
                setUltimaMensagemVisivel(
                    querySnapshot.docs[querySnapshot.docs.length - 1]
                );
            }
        });

        return () => unsubscribe();
    }, [conversaAtivaId, ultimaMensagemVisivel]); // Roda quando a última mensagem visível mudar

    // Efeito para "ouvir" quem está a escrever
    useEffect(() => {
        if (!conversaAtiva) return;
        setEscrevendo(
            conversaAtiva.escrevendo?.filter(
                (uid) => uid !== currentUser.uid
            ) || []
        );
    }, [conversaAtiva, currentUser.uid]);

    // Efeito para marcar mensagens como lidas ao abrir uma conversa
    useEffect(() => {
        if (conversaAtivaId && currentUser) {
            const conversaRef = doc(db, 'conversas', conversaAtivaId);
            updateDoc(conversaRef, {
                [`unreadCounts.${currentUser.uid}`]: 0,
            });
        }
    }, [conversaAtivaId, currentUser]);

    useEffect(() => {
        // Adicionamos uma verificação para evitar rolar quando o chat está vazio
        if (mensagens.length > 0) {
            scrollToBottom();
        }
    }, [mensagens[mensagens.length - 1]?.id]); // Dispara o efeito sempre que 'messages' mudar

    // Função para obter o nome de exibição da conversa
    const getNomeConversa = (conversa) => {
        if (conversa.isGrupo) {
            return conversa.nomeGrupo;
        }
        const outroUsuario = conversa.participantesInfo?.find(
            (p) => p.uid !== currentUser.uid
        );
        return outroUsuario
            ? `${outroUsuario.nome} ${outroUsuario.sobrenome}`
            : 'Conversa Privada';
    };

    const getSubtituloConversa = () => {
        if (!conversaAtiva) return '';

        const outrosAEscrever =
            conversaAtiva.escrevendo?.filter(
                (uid) => uid !== currentUser.uid
            ) || [];
        if (outrosAEscrever.length > 0) {
            // Pega o nome do primeiro utilizador na lista para exibir
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

        // Lógica para determinar o status "Online" ou "Visto por último"
        if (
            statusOutroUsuario &&
            statusOutroUsuario.online &&
            statusOutroUsuario.vistoPorUltimo
        ) {
            const agora = new Date();
            const ultimaVez = statusOutroUsuario.vistoPorUltimo.toDate();
            const diffMinutos = (agora - ultimaVez) / (1000 * 60);

            if (diffMinutos < 1) {
                return 'Online';
            }
            return `Visto por último às ${formatarTimestamp(statusOutroUsuario.vistoPorUltimo)}`;
        }

        return 'Offline';
    };

    // Função para enviar uma nova mensagem
    const handleEnviarMensagem = async (evento) => {
        evento.preventDefault();
        if (novaMensagem.trim() === '' || !conversaAtivaId) return;

        await addDoc(
            collection(db, 'conversas', conversaAtivaId, 'mensagens'),
            {
                texto: novaMensagem,
                senderId: currentUser.uid,
                senderNome: userData.nome,
                senderSobrenome: userData.sobrenome,
                timestamp: serverTimestamp(),
            }
        );

        const conversaRef = doc(db, 'conversas', conversaAtivaId);

        // Atualiza a última mensagem e incrementa o contador dos outros
        const updates = {
            ultimaMensagem: {
                texto: novaMensagem,
                timestamp: serverTimestamp(),
                senderNome: userData.nome,
                senderSobrenome: userData.sobrenome,
            },
        };

        conversaAtiva.participantes.forEach((uid) => {
            if (uid !== currentUser.uid) {
                updates[`unreadCounts.${uid}`] = increment(1);
            }
        });

        await updateDoc(conversaRef, updates);
        setNovaMensagem('');
    };

    const handleCarregarMais = async () => {
        if (carregandoMais || !primeiraMensagemVisivel) return;

        setCarregandoMais(true);

        // --- PASSO 1: FOTOGRAFAR A ALTURA ATUAL ---
        const scrollContainer = mensagensAreaRef.current;
        if (!scrollContainer) return; // Segurança
        const scrollHeightAntes = scrollContainer.scrollHeight;

        const q = query(
            collection(db, 'conversas', conversaAtivaId, 'mensagens'),
            orderBy('timestamp', 'desc'),
            startAfter(primeiraMensagemVisivel),
            limit(30)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const novasMensagens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPrimeiraMensagemVisivel(
                querySnapshot.docs[querySnapshot.docs.length - 1]
            );

            const mensagensOrdenadas = novasMensagens.reverse();

            // Adiciona as novas mensagens no INÍCIO
            setMensagens((mensagensAtuais) => [
                ...mensagensOrdenadas,
                ...mensagensAtuais,
            ]);

            // --- PASSO 2: AGUARDAR A RENDERIZAÇÃO E AJUSTAR O SCROLL ---
            // Usamos requestAnimationFrame para garantir que o DOM foi atualizado
            requestAnimationFrame(() => {
                const scrollHeightDepois = scrollContainer.scrollHeight;
                scrollContainer.scrollTop =
                    scrollHeightDepois - scrollHeightAntes;
            });
        }

        // --- PASSO 3: SEMPRE LIBERAR O ESTADO DE CARREGAMENTO ---
        setCarregandoMais(false);
    };

    // Função para lidar com o input de texto
    const handleTyping = async (e) => {
        setNovaMensagem(e.target.value);
        if (!conversaAtivaId) return;

        const conversaRef = doc(db, 'conversas', conversaAtivaId);

        // Adiciona o utilizador à lista de quem está a escrever
        updateDoc(conversaRef, { escrevendo: arrayUnion(currentUser.uid) });

        // Remove o utilizador após um tempo sem digitar
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            updateDoc(conversaRef, {
                escrevendo: arrayRemove(currentUser.uid),
            });
        }, 2000);
    };

    // Função para abrir o modal de detalhes do projeto ou perfil
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

    const conversasFiltradas = conversas
        .filter((conversa) => {
            if (abaAtiva === 'grupos') return conversa.isGrupo;
            if (abaAtiva === 'diretas') return !conversa.isGrupo;
            return true;
        })
        .filter((conversa) => {
            const nome = getNomeConversa(conversa)?.toLowerCase() || '';
            const ultimaMsg =
                conversa.ultimaMensagem?.texto?.toLowerCase() || '';
            const buscaLower = busca.toLowerCase();
            return nome.includes(buscaLower) || ultimaMsg.includes(buscaLower);
        })
        .sort(
            (a, b) =>
                (b.ultimaMensagem?.timestamp?.toDate() || 0) -
                (a.ultimaMensagem?.timestamp?.toDate() || 0)
        );

    const getInfoConversa = (conversa) => {
        if (!conversa) return { nome: '', subtitulo: '' };
        if (conversa.isGrupo) {
            const numMembros = conversa.participantes?.length || 0;
            return {
                nome: conversa.nomeGrupo,
                subtitulo: `${numMembros} membro${numMembros !== 1 ? 's' : ''}`,
            };
        }
        const outroUsuario = conversa.participantesInfo?.find(
            (p) => p.uid !== currentUser.uid
        );
        return {
            nome: outroUsuario
                ? `${outroUsuario.nome} ${outroUsuario.sobrenome}`
                : 'Conversa Privada',
            subtitulo: 'Online', // Placeholder
        };
    };

    const infoConversaAtiva = getInfoConversa(conversaAtiva);

    return (
        <>
            <DashboardHeader titulo={`Mensagens`}>
                Conecte-se e organize suas conversas. Aqui, você encontra seus
                chats privados e em grupo.
            </DashboardHeader>

            <ChatLayout>
                <ColunaEsquerda>
                    <BuscaContainer>
                        <BuscaIcone size={22} />
                        <BuscaInput
                            placeholder="Buscar Conversas..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </BuscaContainer>

                    <ContainerAbas>
                        <Aba
                            className={abaAtiva === 'grupos' ? 'active' : ''}
                            onClick={() => setAbaAtiva('grupos')}
                        >
                            Grupos
                        </Aba>
                        <Aba
                            className={abaAtiva === 'diretas' ? 'active' : ''}
                            onClick={() => setAbaAtiva('diretas')}
                        >
                            Diretas
                        </Aba>
                    </ContainerAbas>

                    <ListaScroll>
                        {conversasFiltradas.map((conversa) => {
                            const unreadCount =
                                conversa.unreadCounts?.[currentUser.uid] || 0;
                            return (
                                <ItemConversa
                                    key={conversa.id}
                                    $ativo={conversa.id === conversaAtivaId}
                                    onClick={() =>
                                        setConversaAtivaId(conversa.id)
                                    }
                                >
                                    <Avatar>
                                        {getInitials(getNomeConversa(conversa))}
                                    </Avatar>
                                    <InfoConversa>
                                        <NomeConversa>
                                            {getNomeConversa(conversa)}
                                        </NomeConversa>{' '}
                                        {/* Use o componente já criado */}
                                        {conversa.ultimaMensagem && (
                                            <UltimaMensagemContainer>
                                                <RemetenteMensagem>
                                                    {
                                                        conversa.ultimaMensagem.senderNome?.split(
                                                            ' '
                                                        )[0]
                                                    }
                                                    :
                                                </RemetenteMensagem>
                                                <TextoUltimaMensagem>
                                                    {
                                                        conversa.ultimaMensagem
                                                            .texto
                                                    }
                                                </TextoUltimaMensagem>
                                            </UltimaMensagemContainer>
                                        )}
                                    </InfoConversa>
                                    {unreadCount > 0 && (
                                        <BadgeNaoLido>
                                            {unreadCount}
                                        </BadgeNaoLido>
                                    )}
                                </ItemConversa>
                            );
                        })}
                    </ListaScroll>
                </ColunaEsquerda>

                <JanelaChatContainer>
                    {conversaAtiva ? (
                        <>
                            <ChatHeader
                                onClick={handleHeaderClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <Avatar>
                                    {getInitials(
                                        getNomeConversa(conversaAtiva)
                                    )}
                                </Avatar>
                                <InfoConversa>
                                    <h4>{getNomeConversa(conversaAtiva)}</h4>
                                    <p>{getSubtituloConversa(conversaAtiva)}</p>
                                </InfoConversa>
                            </ChatHeader>
                            <MensagensArea
                                ref={mensagensAreaRef}
                                onScroll={(e) => {
                                    if (e.target.scrollTop === 0) {
                                        handleCarregarMais();
                                    }
                                }}
                            >
                                <ListaDeMensagens>
                                    {mensagens.map((msg) => {
                                        const isSender =
                                            msg.senderId === currentUser.uid;
                                        return (
                                            <MensagemLinha
                                                key={msg.id}
                                                $isSender={isSender}
                                            >
                                                {!isSender && (
                                                    <Avatar
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            fontSize: '16px',
                                                            alignSelf:
                                                                'flex-start',
                                                        }}
                                                    >
                                                        {getInitials(
                                                            msg.senderNome,
                                                            msg.senderSobrenome
                                                        )}
                                                    </Avatar>
                                                )}
                                                <BolhaMensagem
                                                    $isSender={isSender}
                                                >
                                                    {!isSender && (
                                                        <strong>
                                                            {msg.senderNome}{' '}
                                                            {
                                                                msg.senderSobrenome
                                                            }
                                                        </strong>
                                                    )}
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            display: 'inline',
                                                        }}
                                                    >
                                                        {msg.texto}
                                                    </p>
                                                    <TimestampTexto
                                                        $isSender={isSender}
                                                    >
                                                        {formatarTimestamp(
                                                            msg.timestamp
                                                        )}
                                                    </TimestampTexto>
                                                </BolhaMensagem>
                                            </MensagemLinha>
                                        );
                                    })}
                                </ListaDeMensagens>
                                <div ref={fimMensagensRef} />
                            </MensagensArea>

                            <InputArea onSubmit={handleEnviarMensagem}>
                                <InputMensagem
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    value={novaMensagem}
                                    onChange={handleTyping}
                                />
                                <Botao variant="enviar" type="submit">
                                    Enviar
                                </Botao>
                            </InputArea>
                        </>
                    ) : (
                        <Placeholder>
                            Selecione uma conversa para começar
                        </Placeholder>
                    )}
                </JanelaChatContainer>
            </ChatLayout>
            <Modal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                size="large"
            >
                {conteudoModal.tipo === 'projeto' && (
                    <VerDetalhesModal
                        projeto={conteudoModal.dados}
                        tipo="participante"
                        projetoId={conteudoModal.dados.id}
                        onClose={() => setModalAberto(false)}
                    />
                )}
                {conteudoModal.tipo === 'perfil' && (
                    <PerfilUsuarioModal
                        isOpen={true}
                        usuario={conteudoModal.dados}
                        onClose={() => setModalAberto(false)}
                    />
                )}
            </Modal>
        </>
    );
}

export default MensagensPage;
