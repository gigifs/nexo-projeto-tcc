import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import Botao from '../components/Botao';
import VerDetalhesModal from '../components/VerDetalhesModal';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import TemCertezaModal from '../components/TemCertezaModal';
import { FiLoader, FiTrash2, FiFilePlus, FiFileMinus, FiUserX, FiLock } from 'react-icons/fi';
import { LuFileX } from 'react-icons/lu';
import { HiArrowsUpDown, HiArrowLongUp, HiArrowLongDown } from 'react-icons/hi2';
import { useToast } from '../contexts/ToastContext';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    deleteDoc,
} from 'firebase/firestore';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const OrdenarWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: -0.8rem;
    padding: 0 0.5rem;
`;

const BotaoOrdenar = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    color: #555;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 500;

    &:hover {
        color: #000;
    }
`;

const ListaCandidaturas = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const CardCandidatura = styled.div`
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    background-color: ${(props) => props.$bgColor || '#e0e0e0'};
    color: ${(props) => props.$textColor || '#000'};
`;

const CardBody = styled.div`
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
`;

const InfoWrapper = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
`;

const TituloProjeto = styled.h3`
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DataCandidaturaTexto = styled.div`
    font-size: 0.85rem;
    color: #666;
`;

const LoadingMini = styled.div`
    font-size: 0.9rem;
    opacity: 0.6;
`;

const AcoesWrapper = styled.div`
    flex-shrink: 0;
    padding-left: 1rem;
`;

function MinhasCandidaturasPage() {
    const { currentUser } = useAuth();
    const [candidaturas, setCandidaturas] = useState([]);
    const [ordem, setOrdem] = useState(null);
    const [projetoSelecionado, setProjetoSelecionado] = useState(null);
    const { addToast } = useToast();

    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [projetoParaRetirar, setProjetoParaRetirar] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cache em memória para evitar leituras repetidas
    const projetosCache = useRef({});
    const statusCache = useRef({});

    useEffect(() => {
        if (!currentUser) return;

        let candidaturasRef;

        if (ordem) {
            candidaturasRef = query(
                collection(db, 'users', currentUser.uid, 'minhasCandidaturas'),
                orderBy('dataCandidatura', ordem)
            );
        } else {
            candidaturasRef = query(
                collection(db, 'users', currentUser.uid, 'minhasCandidaturas')
            );
        }

        const unsubscribe = onSnapshot(candidaturasRef, async (snapshot) => {
            // Mapeamos inicialmente com os dados que já temos salvos no perfil do usuário
            // Isso serve de "fallback" caso o projeto original não exista mais
            const baseList = snapshot.docs.map((doc) => ({
                projetoId: doc.id,
                dataCandidatura: doc.data().dataCandidatura,
                nomeSalvo: doc.data().nomeProjeto, // Nome salvo no momento da candidatura
                statusSalvo: doc.data().status // Status salvo no perfil
            }));

            const finalList = await Promise.all(
                baseList.map(async (item) => {
                    const projetoId = item.projetoId;

                    // Tenta pegar do cache para economizar leituras
                    if (
                        projetosCache.current[projetoId] &&
                        statusCache.current[projetoId]
                    ) {
                        return {
                            ...item,
                            ...projetosCache.current[projetoId],
                            status: statusCache.current[projetoId],
                        };
                    }

                    // Valores padrão iniciais (usando o salvo no perfil se disponível)
                    let nomeProjeto = item.nomeSalvo || 'Projeto Indisponível';
                    let status = item.statusSalvo || 'pendente';

                    try {
                        // Verifica se o projeto ainda existe
                        const projetoRef = doc(db, 'projetos', projetoId);
                        const projetoSnap = await getDoc(projetoRef);

                        if (projetoSnap.exists()) {
                            nomeProjeto = projetoSnap.data().nome; // Atualiza com nome real

                            // Se o projeto existe, verifica o status oficial da candidatura
                            const candidaturaRef = doc(
                                db,
                                'projetos',
                                projetoId,
                                'candidaturas',
                                currentUser.uid
                            );
                            const statusSnap = await getDoc(candidaturaRef);

                            if (statusSnap.exists()) {
                                status = statusSnap.data().status || 'pendente';
                            } else {
                                // Projeto existe, mas não há documento de candidatura
                                // Isso acontece quando o dono remove o membro
                                status = 'removido'; 
                            }
                        } else {
                            // Projeto não encontrado no banco de dados
                            status = 'excluido';
                        }
                    } catch (error) {
                        console.error("Erro ao buscar status do projeto:", error);
                        // Em caso de erro de permissão ou rede, mantemos os dados salvos
                    }

                    // Atualiza o cache
                    projetosCache.current[projetoId] = { nomeProjeto };
                    statusCache.current[projetoId] = status;

                    return {
                        ...item,
                        nomeProjeto,
                        status,
                    };
                })
            );

            setCandidaturas(finalList);
        });

        return () => unsubscribe();
    }, [currentUser, ordem]);

    const executarExclusao = async (projetoId) => {
        // Limpa cache
        delete projetosCache.current[projetoId];
        delete statusCache.current[projetoId];

        try {
            // Remove da lista pessoal (no perfil do usuário)
            // Isso vai disparar o onSnapshot e atualizar a tela
            await deleteDoc(
                doc(
                    db,
                    'users',
                    currentUser.uid,
                    'minhasCandidaturas',
                    projetoId
                )
            );

            // Tenta remover do projeto (se ainda existir e tiver permissão)
            try {
                await deleteDoc(
                    doc(db, 'projetos', projetoId, 'candidaturas', currentUser.uid)
                );
            } catch (e) {
                // Se falhar (ex: projeto excluído), não faz mal pq removemos da lista pessoal
                console.log("Candidatura no projeto já não existe ou sem permissão.");
            }

            return true;
        } catch (error) {
            console.error('Erro ao excluir:', error);
            addToast('Erro ao processar a exclusão.', 'error');
            return false;
        }
    };

    // Handler para abrir modal
    // caso o usuário queira retirar candidatura quando os status é pendente
    const handleAbrirModalRetirar = (projetoId) => {
        setProjetoParaRetirar(projetoId);
        setConfirmOpen(true);
    };

    const handleConfirmarRetirada = async () => {
        if (!projetoParaRetirar) return;
        setIsDeleting(true);

        const sucesso = await executarExclusao(projetoParaRetirar);

        if (sucesso) {
            addToast('Candidatura retirada com sucesso.', 'success');
        }

        setIsDeleting(false);
        setConfirmOpen(false);
        setProjetoParaRetirar(null);
    };

    // Handler para limpeza imediata (Rejeitado, Removido ou Excluído)
    const handleLimparImediatamente = async (projetoId) => {
        const sucesso = await executarExclusao(projetoId);
        if (sucesso) {
            addToast('Candidatura removida da lista!', 'success');
        }
    };

    const handleFecharModal = () => {
        setConfirmOpen(false);
        setProjetoParaRetirar(null);
    };

    const handleVerProjeto = async (projetoId) => {
        try {
            const projetoRef = doc(db, 'projetos', projetoId);
            const projetoSnap = await getDoc(projetoRef);

            if (projetoSnap.exists()) {
                setProjetoSelecionado({
                    id: projetoSnap.id,
                    ...projetoSnap.data(),
                });
            } else {
                addToast('Projeto não encontrado ou sem permissão.', 'error');
            }
        } catch (error) {
            console.error('Erro ao abrir projeto:', error);
            addToast('Erro ao abrir detalhes do projeto.', 'error');
        }
    };

    // Estilo dos cards de candidaturas
    const getStatusInfo = (status) => {
        switch (status) {
            // me candidatei, tô esperando
            case 'pendente':
                return {
                    texto: 'Pendente',
                    icone: <FiLoader size={20} />,
                    $bgColor: '#b5cfefff',
                    $textColor: '#424b9bff',
                };
            // fui aceito
            case 'aceito':
                return {
                    texto: 'Candidatura Aceita',
                    icone: <FiFilePlus size={20} />,
                    $bgColor: '#C8E6C9',
                    $textColor: '#2E7D32',
                };
            // fui rejeitado
            case 'rejeitado':
                return {
                    texto: 'Candidatura Rejeitada',
                    icone: <LuFileX size={20} />,
                    $bgColor: '#ffcdd2',
                    $textColor: '#ca392fff',
                };
            // me tiraram do projeto
            case 'removido':
                return {
                    texto: 'Removido do Projeto',
                    icone: <FiUserX size={20} />,
                    $bgColor: '#d9c4f0ff',
                    $textColor: '#5f237bff',
                };
            // excluíram o projeto que me canididatei
            case 'excluido':
                return {
                    texto: 'Projeto Excluído',
                    icone: <FiFileMinus size={20} />,
                    $bgColor: '#bdbdbd',
                    $textColor: '#424242',
                };

            case 'projeto_encerrado':
                return {
                    texto: 'Projeto Encerrado',
                    icone: <FiLock size={20} />,
                    $bgColor: '#e2ebabff',
                    $textColor: '#877413ff',
                };
            default:
                return {
                    texto: status,
                    icone: null,
                    $bgColor: '#e0e0e0',
                    $textColor: '#000',
                };
        }
    };

    const handleToggleOrdem = () => {
        if (ordem === 'desc') {
            setOrdem('asc');
        } else if (ordem === 'asc') {
            setOrdem(null); // Volta ao estado neutro
        } else {
            setOrdem('desc'); // Do estado neutro, vai pra desc
        }
    };

    return (
        <PageContainer>
            <DashboardHeader titulo="Minhas Candidaturas">
                Acompanhe o status das suas candidaturas.
            </DashboardHeader>

            <OrdenarWrapper>
                <BotaoOrdenar onClick={handleToggleOrdem}>
                    Data de candidatura
                    {!ordem && <HiArrowsUpDown size={16} />}
                    {ordem === 'desc' && <HiArrowLongDown size={16} />}
                    {ordem === 'asc' && <HiArrowLongUp size={16} />}
                </BotaoOrdenar>
            </OrdenarWrapper>

            <ListaCandidaturas>
                {candidaturas.length === 0 && (
                    <p>Você ainda não se candidatou a nenhum projeto.</p>
                )}

                {candidaturas.map((cand) => {
                    const isLoading = !cand.nomeProjeto && cand.status !== 'excluido';
                    
                    // Pega as informações visuais de acordo com o status
                    const statusInfo = getStatusInfo(cand.status);

                    // Card Loading
                    if (isLoading) {
                        return (
                            <CardCandidatura key={cand.projetoId}>
                                <CardBody>
                                    <LoadingMini>Carregando...</LoadingMini>
                                </CardBody>
                            </CardCandidatura>
                        );
                    }

                    return (
                        <CardCandidatura key={cand.projetoId}>
                            <CardHeader
                                $bgColor={statusInfo.$bgColor}
                                $textColor={statusInfo.$textColor}
                            >
                                {statusInfo.icone && (
                                    <span>{statusInfo.icone}</span>
                                )}
                                {statusInfo.texto}
                            </CardHeader>

                            <CardBody>
                                <InfoWrapper>
                                    <TituloProjeto>
                                        {cand.nomeProjeto}
                                    </TituloProjeto>

                                    {cand.dataCandidatura && (
                                        <DataCandidaturaTexto>
                                            Você se candidatou em:{' '}
                                            {cand.dataCandidatura
                                                .toDate()
                                                .toLocaleDateString('pt-BR')}
                                        </DataCandidaturaTexto>
                                    )}
                                </InfoWrapper>

                                <AcoesWrapper>
                                    {/* Botão retirar candidatura para status: pendente */}
                                    {cand.status === 'pendente' && (
                                        <Botao
                                            variant="excluir"
                                            onClick={() =>
                                                handleAbrirModalRetirar(
                                                    cand.projetoId
                                                )
                                            }
                                        >
                                            Retirar
                                        </Botao>
                                    )}

                                    {/* Botão ver projeto para status: aceito (se não excluído) */}
                                    {cand.status === 'aceito' && (
                                        <Botao
                                            variant="hab-int"
                                            onClick={() =>
                                                handleVerProjeto(cand.projetoId)
                                            }
                                        >
                                            Ver Projeto
                                        </Botao>
                                    )}

                                    {/* Ícone Lixeira para limpar da lista (status: Rejeitado, Removido, Excluído, Encerrado) */}
                                    {(cand.status === 'rejeitado' ||
                                        cand.status === 'removido' ||
                                        cand.status === 'excluido' ||
                                        cand.status === 'projeto_encerrado') && (
                                        <FiTrash2
                                            size={25}
                                            onClick={() =>
                                                handleLimparImediatamente(
                                                    cand.projetoId
                                                )
                                            }
                                            style={{
                                                cursor: 'pointer',
                                                color: '#f44336',
                                            }}
                                            title="Remover da lista"
                                        />
                                    )}
                                </AcoesWrapper>
                            </CardBody>
                        </CardCandidatura>
                    );
                })}
            </ListaCandidaturas>

            <Modal
                isOpen={isConfirmOpen}
                onClose={handleFecharModal}
                size="excluir-projeto"
            >
                <TemCertezaModal
                    titulo="Retirar Candidatura?"
                    mensagem="Você tem certeza que deseja retirar sua candidatura deste projeto?"
                    onConfirm={handleConfirmarRetirada}
                    onClose={handleFecharModal}
                    loading={isDeleting}
                />
            </Modal>

            <Modal
                isOpen={!!projetoSelecionado}
                onClose={() => setProjetoSelecionado(null)}
                size="large"
            >
                {projetoSelecionado && (
                    <VerDetalhesModal
                        projeto={projetoSelecionado}
                        projetoId={projetoSelecionado.id}
                        onClose={() => setProjetoSelecionado(null)}
                    />
                )}
            </Modal>
        </PageContainer>
    );
}

export default MinhasCandidaturasPage;