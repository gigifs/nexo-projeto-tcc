import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import Botao from '../components/Botao';
import VerDetalhesModal from '../components/VerDetalhesModal';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import TemCertezaModal from '../components/TemCertezaModal';
import { FiLoader, FiTrash2, FiFilePlus, FiFileMinus } from 'react-icons/fi';
import {
    HiArrowsUpDown,
    HiArrowLongUp,
    HiArrowLongDown,
} from 'react-icons/hi2';
import { LuFileX } from 'react-icons/lu';
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
            // Se ordem for asc ou desc, aplica o orderBy
            candidaturasRef = query(
                collection(db, 'users', currentUser.uid, 'minhasCandidaturas'),
                orderBy('dataCandidatura', ordem)
            );
        } else {
            // Se ordem for null, busca sem o orderBy
            candidaturasRef = query(
                collection(db, 'users', currentUser.uid, 'minhasCandidaturas')
            );
        }

        const unsubscribe = onSnapshot(candidaturasRef, async (snapshot) => {
            const baseList = snapshot.docs.map((doc) => ({
                projetoId: doc.id,
                dataCandidatura: doc.data().dataCandidatura,
            }));

            const finalList = await Promise.all(
                baseList.map(async (item) => {
                    const projetoId = item.projetoId;

                    // Tenta pegar o cache
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

                    // Busca os dados do projeto
                    const projetoRef = doc(db, 'projetos', projetoId);
                    const projetoSnap = await getDoc(projetoRef);

                    let nomeProjeto = 'Projeto removido';
                    let projetoExiste = false;

                    if (projetoSnap.exists()) {
                        nomeProjeto = projetoSnap.data().nome;
                        projetoExiste = true;
                        projetosCache.current[projetoId] = { nomeProjeto };
                    } else {
                        projetosCache.current[projetoId] = { nomeProjeto };
                        statusCache.current[projetoId] = 'removido';
                    }

                    // Busca o status da candidatura
                    let status = 'n/a';
                    if (projetoExiste) {
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
                        }

                        statusCache.current[projetoId] = status;
                    }

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
            // Remove da lista pessoal (Isso atualiza a tela automaticamente ->onSnapshot)
            await deleteDoc(
                doc(
                    db,
                    'users',
                    currentUser.uid,
                    'minhasCandidaturas',
                    projetoId
                )
            );

            // Tenta remover do projeto (se ainda existir)
            await deleteDoc(
                doc(db, 'projetos', projetoId, 'candidaturas', currentUser.uid)
            );

            return true;
        } catch (error) {
            console.error('Erro ao excluir:', error);
            addToast('Erro ao processar a exclusão.', 'error');
            return false;
        }
    };

    // Pra status Pendente --> Abre Modal
    const handleAbrirModalRetirar = (projetoId) => {
        setProjetoParaRetirar(projetoId);
        setConfirmOpen(true);
    };

    // Confirmação do Modal (Pendente)
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

    // Para status Rejeitado ou Removido --> exclui direto
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
                // Guarda os dados completos do projeto pra passar ao modal
                setProjetoSelecionado({
                    id: projetoSnap.id,
                    ...projetoSnap.data(),
                });
            } else {
                addToast('Projeto não encontrado.', 'error');
            }
        } catch (error) {
            console.error('Erro ao abrir projeto:', error);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pendente':
                return {
                    texto: 'Pendente',
                    icone: <FiLoader size={20} />,
                    $bgColor: '#FFE0B2',
                    $textColor: '#E65100',
                };
            case 'aceito':
                return {
                    texto: 'Candidatura Aceita',
                    icone: <FiFilePlus size={20} />,
                    $bgColor: '#C8E6C9',
                    $textColor: '#2E7D32',
                };
            case 'rejeitado':
                return {
                    texto: 'Candidatura Rejeitada',
                    icone: <LuFileX size={20} />,
                    $bgColor: '#ffcdd2',
                    $textColor: '#f44336',
                };
            case 'removido':
                return {
                    texto: 'Projeto Excluído',
                    icone: <FiFileMinus size={20} />,
                    $bgColor: '#e0e0e0',
                    $textColor: '#616161',
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
                    const isLoading = !cand.nomeProjeto;
                    const isRemovido = cand.nomeProjeto === 'Projeto removido';

                    // Define o status pra função getStatusInfo
                    const statusReal = isRemovido ? 'removido' : cand.status;
                    const statusInfo = getStatusInfo(statusReal);

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
                                    {statusReal === 'pendente' && (
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

                                    {statusReal === 'aceito' && (
                                        <Botao
                                            variant="hab-int"
                                            onClick={() =>
                                                handleVerProjeto(cand.projetoId)
                                            }
                                        >
                                            Ver Projeto
                                        </Botao>
                                    )}

                                    {(statusReal === 'rejeitado' ||
                                        statusReal === 'removido') && (
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
