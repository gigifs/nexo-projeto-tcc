import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
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
    arrayUnion,
} from 'firebase/firestore';

const NotificacaoContainer = styled.div`
    position: absolute;
    top: 60px; /* Distância do topo do header */
    right: 120px; /* Ajuste para posicionar corretamente */
    width: 450px;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    z-index: 100;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px 0 0;
`;

const Titulo = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin: 0;
`;

const BotaoLimpar = styled.button`
    background-color: #7c2256;
    color: #e6ebf0;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #98286aff;
    }
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
    max-height: 300px; /* Para permitir rolagem se houver muitas notificações */
    overflow-y: auto;
`;

const ItemNotificacao = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background-color: #e6ebf0;
    border-radius: 12px;
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
`;

const ConteudoTexto = styled.div`
    flex-grow: 1;
    font-size: 16px;
    color: #333;
`;

const NomeProjeto = styled.span`
    font-weight: 700;
`;

const Acoes = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const IconeAcao = styled.div`
    cursor: pointer;
    color: ${({ color }) => color || '#333'};
    transition: transform 0.2s;
    position: relative; /* Para a bolinha de "não lida" */

    &:hover {
        transform: scale(1.1);
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #000000;
`;

function Notificacoes({ onClose }) {
    const { currentUser } = useAuth();
    const [abaAtiva, setAbaAtiva] = useState('todas');
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);

        const projetosRef = collection(db, 'projetos');
        const q = query(projetosRef, where('donoId', '==', currentUser.uid));

        const getProjetosEInscreverNotificacoes = async () => {
            const querySnapshot = await getDocs(q);
            const projetosDoUsuario = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (projetosDoUsuario.length === 0) {
                setLoading(false);
                return () => {};
            }

            const unsubscribes = projetosDoUsuario.map(projeto => {
                const candidaturasRef = collection(db, 'projetos', projeto.id, 'candidaturas');
                const qCandidaturas = query(candidaturasRef, where('status', '==', 'pendente'));

                return onSnapshot(qCandidaturas, (snapshot) => {
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

        const unsubscribePromise = getProjetosEInscreverNotificacoes();

        return () => {
            unsubscribePromise.then(cleanup => cleanup && cleanup());
        };

    }, [currentUser]);

    const handleAceitar = async (projetoId, candidaturaId, candidato) => {
        try {
            const projetoRef = doc(db, 'projetos', projetoId);
            const candidaturaRef = doc(db, 'projetos', projetoId, 'candidaturas', candidaturaId);
           
            await updateDoc(projetoRef, {
                participantes: arrayUnion({
                    uid: candidato.userId,
                    nome: candidato.nome,
                    sobrenome: candidato.sobrenome
                }),
                participantIds: arrayUnion(candidato.userId)
            });

            await deleteDoc(candidaturaRef);
           
            alert(`'${candidato.nome} ${candidato.sobrenome}' foi adicionado ao projeto com sucesso!`);

        } catch (error) {
            console.error("Erro ao aceitar candidato: ", error);
            alert("Ocorreu um erro ao aceitar a candidatura. Tente novamente.");
        }
    };
   
    const handleRejeitar = async (projetoId, candidaturaId) => {
        try {
            const candidaturaRef = doc(db, 'projetos', projetoId, 'candidaturas', candidaturaId);
            await deleteDoc(candidaturaRef);
            
            alert("Candidatura rejeitada com sucesso!");

        } catch (error) {
            console.error("Erro ao rejeitar candidatura: ", error);
            alert("Ocorreu um erro ao rejeitar a candidatura. Tente novamente.");
        }
    };

    return (
        <NotificacaoContainer>
            <CloseButton onClick={onClose}><FiX /></CloseButton>
            <Header>
                <Titulo>Notificações</Titulo>
                <BotaoLimpar>Limpar</BotaoLimpar>
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
                {!loading && notificacoes.length === 0 && <p>Nenhuma notificação nova.</p>}
                {!loading && notificacoes.map((notif) => (
                    
                    <ItemNotificacao key={`${notif.projetoId}-${notif.id}`}>
                        <Avatar>
                            {`${notif.nome?.[0] || ''}${notif.sobrenome?.[0] || ''}`.toUpperCase()}
                        </Avatar>
                        <ConteudoTexto>
                            <b>{notif.nome} {notif.sobrenome}</b> gostaria de participar do projeto <NomeProjeto>{notif.projetoNome}</NomeProjeto>
                        </ConteudoTexto>
                        <Acoes>
                            <IconeAcao 
                                color="#28a745"
                                onClick={() => handleAceitar(notif.projetoId, notif.id, { 
                                        userId: notif.userId, 
                                        nome: notif.nome, 
                                        sobrenome: notif.sobrenome 
                                    })}
                            >
                                <FiCheckCircle size={24} />
                            </IconeAcao>
                            <IconeAcao 
                                color="#dc3545"
                                onClick={() => handleRejeitar(notif.projetoId, notif.id)}
                            >
                                <FiTrash2 size={24} />
                            </IconeAcao>
                        </Acoes>
                    </ItemNotificacao>
                ))}
            </ListaNotificacoes>
        </NotificacaoContainer>
    );
}

export default Notificacoes;