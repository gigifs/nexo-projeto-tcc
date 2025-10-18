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

const NotificacaoContainer = styled.div`
    position: absolute;
    top: 60px;
    right: 120px;
    width: 450px;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    z-index: 100;
    padding: 30px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    //background-color: green;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
`;

const Titulo = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin: 0;
`;

const BotaoLimpar = styled.button`
    background-color: #7C2256;
    color: #f5fafc;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 14px;
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
    font-size: 20px;
    cursor: pointer;
    color: #000000;
    line-height: 1;
`;

const AbasContainer = styled.div`
    display: flex;
    background-color: #e6ebf0;
    border-radius: 12px;
    padding: 5px;
`;

const Aba = styled.button`
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    background-color: ${({ $ativo }) => ($ativo ? '#FFFFFF' : 'transparent')};
    color: ${({ $ativo }) => ($ativo ? '#7C2256' : '#333')};
    font-weight: ${({ $ativo }) => ($ativo ? '700' : '400')};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
`;

const ListaNotificacoes = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 350px;
    overflow-y: auto;
    padding: 0 10px 0 0;
`;

//cada notificação é um botão basicamnete
const ItemNotificacao = styled.button`
    /* Reset de estilos de botão */
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: inherit; /* Usa a mesma fonte do resto da página */
    text-align: left;   /* Alinha o texto à esquerda */
    width: 100%;        /* Ocupa toda a largura */
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    word-break: break-word;
    background-color: #e6ebf0;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #d8e0e7;
    }
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const ConteudoTexto = styled.div`
    flex-grow: 1;
    font-size: 16px;
    color: #333;
    line-height: 1.3;
`;

const NomeProjeto = styled.span`
    font-weight: 700;
`;

const Acoes = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
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
    width: 8px;
    height: 8px;
    background-color: #28a745;
    border-radius: 50%;
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome.charAt(0)}${sobrenome ? sobrenome.charAt(0) : ''}`.toUpperCase();
};

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
        const qProjetos = query(projetosRef, where('donoId', '==', currentUser.uid));
        const getProjetosEInscrever = async () => {
            const projetosSnapshot = await getDocs(qProjetos);
            const projetosDoUsuario = projetosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (projetosDoUsuario.length === 0) {
                setLoading(false);
                return () => {};
            }
            const unsubscribes = projetosDoUsuario.map(projeto => {
                const candidaturasRef = collection(db, 'projetos', projeto.id, 'candidaturas');
                return onSnapshot(candidaturasRef, (snapshot) => {
                    const novasCandidaturas = snapshot.docs.map(doc => ({
                        id: doc.id,
                        projetoId: projeto.id,
                        projetoNome: projeto.nome,
                        ...doc.data()
                    }));
                    setNotificacoes(prev => {
                        const outrasNotificacoes = prev.filter(n => n.projetoId !== projeto.id);
                        return [...outrasNotificacoes, ...novasCandidaturas];
                    });
                    setLoading(false);
                });
            });
            return () => unsubscribes.forEach(unsub => unsub());
        };
        const unsubscribePromise = getProjetosEInscrever();
        return () => {
            unsubscribePromise.then(cleanup => cleanup && cleanup());
        };
    }, [currentUser]);

    const handleNotificacaoClick = async (notif) => {
        // Este log nos dirá se a função está sendo chamada e qual o ID do projeto, pro debug
        console.log('Notificação clicada! Tentando navegar para o projeto com ID:', notif.projetoId);

        if (!notif.projetoId) {
            console.error("Erro: ID do projeto não encontrado na notificação!");
            return;
        }

        const notifRef = doc(db, 'projetos', notif.projetoId, 'candidaturas', notif.id);
        if (!notif.lida) {
            await updateDoc(notifRef, { lida: true });
        }
        
        navigate(`/dashboard/meus-projetos/${notif.projetoId}/gerenciar`);
        onClose();
    };

    const handleDelete = async (e, notif) => {
        e.stopPropagation();
        const notifRef = doc(db, 'projetos', notif.projetoId, 'candidaturas', notif.id);
        await deleteDoc(notifRef);
    };

    const handleLimparTudo = async () => {
        if (notificacoes.length === 0 || !window.confirm("Tem certeza que deseja limpar todas as notificações?")) {
            return;
        }
        const batch = writeBatch(db);
        notificacoes.forEach(notif => {
            const notifRef = doc(db, 'projetos', notif.projetoId, 'candidaturas', notif.id);
            batch.delete(notifRef);
        });
        await batch.commit();
    }

    const notificacoesFiltradas = notificacoes.filter(notif => {
        if (abaAtiva === 'nao_lidas') {
            return !notif.lida;
        }
        return true;
    });

    return (
        <NotificacaoContainer>
            <Header>
                <Titulo>Notificações</Titulo>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <BotaoLimpar onClick={handleLimparTudo}>Limpar</BotaoLimpar>
                    <CloseButton onClick={onClose}><FiX /></CloseButton>
                </div>
            </Header>
            <AbasContainer>
                <Aba $ativo={abaAtiva === 'todas'} onClick={() => setAbaAtiva('todas')}>
                    Todas
                </Aba>
                <Aba $ativo={abaAtiva === 'nao_lidas'} onClick={() => setAbaAtiva('nao_lidas')}>
                    Não Lidas
                </Aba>
            </AbasContainer>
            <ListaNotificacoes>
                {loading && <p>Carregando...</p>}
                {!loading && notificacoesFiltradas.length === 0 && <p>Nenhuma notificação para exibir.</p>}
                {!loading && notificacoesFiltradas.map((notif) => (

                    <ItemNotificacao key={`${notif.projetoId}-${notif.id}`} onClick={() => handleNotificacaoClick(notif)}>
                        <Avatar $bgColor={notif.avatarColor}>{getInitials(notif.nome, notif.sobrenome)}</Avatar>
                        <ConteudoTexto>
                            <b>{notif.nome} {notif.sobrenome}</b> gostaria de participar do projeto <NomeProjeto>{notif.projetoNome}</NomeProjeto>
                        </ConteudoTexto>
                        <Acoes>
                            {!notif.lida && <BolinhaNaoLida />}
                            <IconeLixeira onClick={(e) => handleDelete(e, notif)}>
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