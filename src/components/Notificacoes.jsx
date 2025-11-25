import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
} from 'firebase/firestore';
import { getInitials } from '../utils/iniciaisNome';

const NotificacaoContainer = styled.div`
    position: absolute;
    top: 3.75rem;
    right: 7.5rem;
    width: 28.125rem;
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    z-index: 100;
    padding: 1.875rem 1.25rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.95rem;

    @media (max-width: 768px) {
        position: fixed; /* ocupa a tela toda */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%; /* largura total */
        height: 100%; /* altura total */
        border-radius: 0;
        z-index: 2100; /* garante que fica acima de tudo */
        padding: 1.25rem;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.3rem;
`;

const Titulo = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
`;

const BotaoLimpar = styled.button`
    background-color: #7c2256;
    color: #f5fafc;
    border: none;
    border-radius: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #98286aff;
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #000000;
    line-height: 1;
`;

const AbasContainer = styled.div`
    display: flex;
    background-color: #e6ebf0;
    border-radius: 0.75rem;
    padding: 0.3rem;
`;

const Aba = styled.button`
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background-color: ${({ $ativo }) => ($ativo ? '#FFFFFF' : 'transparent')};
    color: ${({ $ativo }) => ($ativo ? '#7C2256' : '#333')};
    font-weight: ${({ $ativo }) => ($ativo ? '700' : '400')};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
`;

const ListaNotificacoes = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 21.875rem;
    overflow-y: auto;
    padding: 0 0.6rem 0 0;

    @media (max-width: 768px) {
        max-height: none;
        flex-grow: 1; /* lista ocupa todo o espaço disponível */
    }
`;

//cada notificação é um botão basicamnete
const ItemNotificacao = styled.button`
    /* Reset de estilos de botão */
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: inherit; /* Usa a mesma fonte do resto da página */
    text-align: left; /* Alinha o texto à esquerda */
    width: 100%; /* Ocupa toda a largura */
    display: flex;
    align-items: center;
    gap: 0.95rem;
    padding: 0.95rem;
    word-break: break-word;
    background-color: #e6ebf0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #d8e0e7;
    }
`;

const Avatar = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const ConteudoTexto = styled.div`
    flex-grow: 1;
    font-size: 1rem;
    color: #333;
    line-height: 1.3;
`;

const NomeProjeto = styled.span`
    font-weight: 700;
`;

const Acoes = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
`;

const IconeLixeira = styled.div`
    color: #555;
    transition: color 0.2s;

    /* O hover agora é no container do ícone, não no botão pai */
    ${ItemNotificacao}:hover & {
        &:hover {
            color: #d9534f;
        }
    }
`;

const BolinhaNaoLida = styled.div`
    width: 0.5rem;
    height: 0.5rem;
    background-color: #28a745;
    border-radius: 50%;
`;

function Notificacoes({ onClose }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState('todas');

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        const projetosRef = collection(db, 'projetos');
        const qProjetos = query(
            projetosRef,
            where('donoId', '==', currentUser.uid)
        );

        const getProjetosEInscrever = async () => {
            const projetosSnapshot = await getDocs(qProjetos);
            const projetosDoUsuario = projetosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            if (projetosDoUsuario.length === 0) {
                setLoading(false);
                return () => {};
            }

            const unsubscribes = projetosDoUsuario.map((projeto) => {
                const candidaturasRef = collection(
                    db,
                    'projetos',
                    projeto.id,
                    'candidaturas'
                );

                // Filtra apenas as candidaturas que estão com status 'pendente'
                const qCandidaturas = query(
                    candidaturasRef,
                    where('status', '==', 'pendente')
                );

                return onSnapshot(qCandidaturas, (snapshot) => {
                    const novasCandidaturas = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        projetoId: projeto.id,
                        projetoNome: projeto.nome,
                        ...doc.data(),
                    }));

                    setNotificacoes((prev) => {
                        const outrasNotificacoes = prev.filter(
                            (n) => n.projetoId !== projeto.id
                        );
                        return [...outrasNotificacoes, ...novasCandidaturas];
                    });
                    setLoading(false);
                });
            });
            return () => unsubscribes.forEach((unsub) => unsub());
        };

        const unsubscribePromise = getProjetosEInscrever();
        return () => {
            unsubscribePromise.then((cleanup) => cleanup && cleanup());
        };
    }, [currentUser]);

    const handleNotificacaoClick = async (notif) => {
        // Este log nos dirá se a função está sendo chamada e qual o ID do projeto, pro debug
        console.log(
            'Notificação clicada! Tentando navegar para o projeto com ID:',
            notif.projetoId
        );

        if (!notif.projetoId) {
            console.error('Erro: ID do projeto não encontrado na notificação!');
            return;
        }

        const notifRef = doc(
            db,
            'projetos',
            notif.projetoId,
            'candidaturas',
            notif.id
        );
        if (!notif.lida) {
            await updateDoc(notifRef, { lida: true });
        }

        navigate(`/dashboard/meus-projetos/${notif.projetoId}/gerenciar`);
        onClose();
    };

    const handleDelete = async (e, notif) => {
        e.stopPropagation();
        const notifRef = doc(
            db,
            'projetos',
            notif.projetoId,
            'candidaturas',
            notif.id
        );
        await deleteDoc(notifRef);
    };

    const handleLimparTudo = async () => {
        if (
            notificacoes.length === 0 ||
            !window.confirm(
                'Tem certeza que deseja limpar todas as notificações?'
            )
        ) {
            return;
        }
        const batch = writeBatch(db);
        notificacoes.forEach((notif) => {
            const notifRef = doc(
                db,
                'projetos',
                notif.projetoId,
                'candidaturas',
                notif.id
            );
            batch.delete(notifRef);
        });
        await batch.commit();
    };

    const notificacoesOrdenadas = notificacoes
        .filter((notif) => {
            if (abaAtiva === 'nao_lidas') {
                return !notif.lida;
            }
            return true;
        })
        .sort((a, b) => {
            const dateA = a.dataCandidatura?.toDate() || 0;
            const dateB = b.dataCandidatura?.toDate() || 0;
            return dateB - dateA; // Ordena da mais recente para a mais antiga
        });

    return (
        <NotificacaoContainer>
            <Header>
                <Titulo>Notificações</Titulo>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.95rem',
                    }}
                >
                    <BotaoLimpar onClick={handleLimparTudo}>Limpar</BotaoLimpar>
                    <CloseButton onClick={onClose}>
                        <FiX />
                    </CloseButton>
                </div>
            </Header>
            <AbasContainer>
                <Aba
                    $ativo={abaAtiva === 'todas'}
                    onClick={() => setAbaAtiva('todas')}
                >
                    Todas
                </Aba>
                <Aba
                    $ativo={abaAtiva === 'nao_lidas'}
                    onClick={() => setAbaAtiva('nao_lidas')}
                >
                    Não Lidas
                </Aba>
            </AbasContainer>
            <ListaNotificacoes>
                {loading && <p>Carregando...</p>}
                {!loading && notificacoesOrdenadas.length === 0 && (
                    <p>Nenhuma notificação para exibir.</p>
                )}

                {!loading &&
                    notificacoesOrdenadas.map((notif) => (
                        <ItemNotificacao
                            key={`${notif.projetoId}-${notif.id}`}
                            onClick={() => handleNotificacaoClick(notif)}
                        >
                            <Avatar $bgColor={notif.avatarColor}>
                                {getInitials(notif.nome, notif.sobrenome)}
                            </Avatar>
                            <ConteudoTexto>
                                <b>
                                    {notif.nome} {notif.sobrenome}
                                </b>{' '}
                                gostaria de participar do projeto{' '}
                                <NomeProjeto>{notif.projetoNome}</NomeProjeto>
                            </ConteudoTexto>
                            <Acoes>
                                {!notif.lida && <BolinhaNaoLida />}
                                <IconeLixeira
                                    onClick={(e) => handleDelete(e, notif)}
                                >
                                    <FiTrash2 size={20} />
                                </IconeLixeira>
                            </Acoes>
                        </ItemNotificacao>
                    ))}
            </ListaNotificacoes>
        </NotificacaoContainer>
    );
}

export default Notificacoes;
