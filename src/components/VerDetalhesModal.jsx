import styled from 'styled-components';
import Botao from './Botao';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import { db } from '../firebase';
import Modal from './Modal';
import TemCertezaModal from './TemCertezaModal';
import { useToast } from '../contexts/ToastContext';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs,
    addDoc,
} from 'firebase/firestore';
import PerfilUsuarioModal from './PerfilUsuarioModal';
import { useNavigate } from 'react-router-dom';
// Importações das novas Utils
import { getInitials } from '../utils/iniciaisNome';
import { getStatusStyle } from '../utils/tagStatus';

const ModalWrapper = styled.div`
    padding: 0.6rem 1.875rem 1.25rem 1.875rem;
    color: #333;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 1.56rem;
`;

const TituloProjeto = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: #000;
    margin: 0.6rem 0 0.3rem 0;
    line-height: 1.2;
    word-break: break-word;
    text-align: center; /* Centraliza o texto do título */

    /* Define a altura máxima para 4 linhas (4 * 28px(1.75rem) * 1.2) */
    max-height: 8.438rem; /* 135px */
    overflow-y: auto; /* Ativa a rolagem vertical se o conteúdo for maior */

    /* Esconde a barra de rolagem na maioria dos navegadores */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }

    @media (max-width: 1024px) {
        font-size: 1.5rem;
    }

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`;

const CriadoPor = styled.p`
    font-size: 1rem;
    color: #000000;
    margin: 0;

    span {
        font-weight: 600;
        color: #7c2256;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const Secao = styled.div``;

const ConteudoSuperior = styled.div`
    display: flex;
    gap: 1.875rem;
    margin-bottom: 1.25rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.25rem;
    }
`;

const ColunaEsquerda = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const ColunaDireita = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    background-color: #be2d8211;
    padding: 1.25rem;
    border-radius: 0.6rem;
    max-height: 15.625rem;
    overflow-y: auto; /*Adiciona scroll se a descrição for mt grande*/

    /* Esconde a barra de rolagem na maioria dos navegadores */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }

    @media (max-width: 768px) {
        max-height: none; /* Remove a altura máxima em mobile */
    }
`;

const SecaoTitulo = styled.h4`
    font-size: 1.125rem;
    font-weight: 600;
    color: #000;
    margin: 0 0 0.6rem 0;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const Tag = styled.span`
    padding: 0.3rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: ${(props) =>
        props.$tipo === 'status'
            ? props.$bgColor
            : props.$tipo === 'habilidade'
              ? '#4AACF266'
              : props.$tipo === 'area'
                ? '#eba7b18f'
                : '#ff8eda66'};
    color: ${(props) =>
        props.$tipo === 'status'
            ? props.$textColor
            : props.$tipo === 'habilidade'
              ? '#234DD7'
              : props.$tipo === 'area'
                ? '#7B1B4C'
                : '#FE3F85'};
`;

const IntegrantesLista = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
`;

const IntegranteItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    position: relative;
    cursor: pointer;
    padding: 0.3rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;

    /* Aplica estilos condicionalmente com base na prop '$isClickable' */
    cursor: ${(props) => (props.$isClickable ? 'pointer' : 'default')};

    &:hover {
        background-color: ${(props) =>
            props.$isClickable ? '#be2d8264' : 'transparent'};
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    left: 3.125rem;
    background-color: #fff;
    border-radius: 0.6rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0.5rem;
    z-index: 10;
    width: 11.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

const DropdownItem = styled.div`
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const Avatar = styled.div`
    width: 2.2rem;
    height: 2.2rem;
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

const NomeIntegrante = styled.span`
    font-size: 1rem;
    font-weight: 500;
    color: #000000;
`;

const DescricaoContainer = styled.div`
    margin-bottom: 1.25rem;
`;

const Descricao = styled.p`
    font-size: 1rem;
    line-height: 1.5;
    text-align: justify;
    margin: 0;
    max-height: 9.375rem;
    overflow-y: auto;
    padding-right: 0.6rem;
    white-space: pre-line;
`;

const Footer = styled.div`
    text-align: center;
    padding-top: 1.25rem;
    border-top: 2px solid #eee;
`;

function VerDetalhesModal({ projeto, projetoId, onClose }) {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [integranteAberto, setIntegranteAberto] = useState(null); // controla o menu de cada integrante
    const [todosOsIntegrantes, setTodosOsIntegrantes] = useState([]);
    // Estados para controlar o modal de perfil do integrante
    const [isPerfilModalOpen, setPerfilModalOpen] = useState(false);
    const [integranteSelecionado, setIntegranteSelecionado] = useState(null);
    const [loadingIntegrante, setLoadingIntegrante] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const { addToast } = useToast(); // Hook para exibir toasts

    useEffect(() => {
        const handleClickOutside = () => setIntegranteAberto(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const {
        nome,
        donoId,
        donoNome,
        donoSobrenome,
        descricao,
        habilidades = [],
        area,
        participantes = [],
        participantIds = [],
    } = projeto;

    const statusStyle = getStatusStyle(projeto.status);
    // Verifica se o usuário atual é o dono do projeto
    const isOwner = currentUser?.uid === donoId;
    const isParticipant = participantIds.includes(currentUser?.uid);

    // EFEITO PARA BUSCAR AS CORES E MONTAR A LISTA DE INTEGRANTES
    useEffect(() => {
        const fetchIntegrantesData = async () => {
            if (!projeto?.donoId) return;

            // Garante que a lista de participantes não tenha duplicatas
            const uniqueParticipantes = [
                ...new Map(participantes.map((p) => [p.uid, p])).values(),
            ];

            // Junta o dono com os participantes pra buscar todos os dados de uma vez
            const allMemberInfo = [
                {
                    uid: projeto.donoId,
                    nome: projeto.donoNome,
                    sobrenome: projeto.donoSobrenome,
                },
                ...uniqueParticipantes,
            ];

            // Busca os dados completos de cada usuário
            const promises = allMemberInfo.map(async (member) => {
                // Previne buscas por undefined uids
                if (!member.uid) return member;

                const userDocRef = doc(db, 'users', member.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    return {
                        ...member,
                        avatarColor: userDocSnap.data().avatarColor, // Adiciona a cor
                        isDono: member.uid === projeto.donoId, // Adiciona a flag de dono
                    };
                }
                return { ...member, isDono: member.uid === projeto.donoId }; // Retorna sem cor se não encontrar
            });

            const integrantesCompletos = await Promise.all(promises);

            // Remove duplicatas (caso o dono esteja na lista de participantes) e membros inválidos
            const finalIntegrantes = [
                ...new Map(
                    integrantesCompletos
                        .filter((item) => item.uid)
                        .map((item) => [item.uid, item])
                ).values(),
            ];

            setTodosOsIntegrantes(finalIntegrantes);
        };

        fetchIntegrantesData();
    }, [projeto]); // Roda sempre que o projeto mudar

    /* Função executada quando o usuário clica em Candidatar-se
     * Verifica se o usuário pode se candidatar e cria um documento na subcoleção
     *'candidaturas' do projeto no Firestore*/

    const handleCandidatura = async () => {
        setLoading(true);

        // Validações iniciais
        if (!currentUser || !userData) {
            addToast('Você precisa estar logado para se candidatar.', 'error');
            setLoading(false);
            return;
        }
        if (currentUser.uid === projeto.donoId) {
            addToast(
                'Você não pode se candidatar ao seu próprio projeto.',
                'error'
            );
            setLoading(false);
            return;
        }

        try {

            // Verificação de segurança - busca dados frescos
            // Buscamos o projeto novamente no banco para garantir que o status não mudou
            // enquanto o usuário estava com a página aberta
            const projetoRef = doc(db, 'projetos', projetoId);
            const projetoSnapAtual = await getDoc(projetoRef);

            if (!projetoSnapAtual.exists()) {
                addToast('Este projeto não existe mais.', 'error');
                setLoading(false);
                if (onClose) onClose();
                return;
            }

            const dadosAtuais = projetoSnapAtual.data();
            const statusNormalizado = dadosAtuais.status ? dadosAtuais.status.toLowerCase() : '';

            // Se o projeto foi "concluído" nesse meio tempo, bloqueamos
            if (statusNormalizado === 'concluido' || statusNormalizado === 'concluído') {
                addToast('Este projeto foi marcado como Concluído e não aceita mais candidaturas.', 'error');
                setLoading(false);
                if (onClose) onClose(); // Fecha o modal para forçar atualização visual se quiser
                return;
            }
            
            // Referência ao possível documento de candidatura deste usuário para este projeto
            const candidaturaRef = doc(
                db,
                'projetos',
                projetoId,
                'candidaturas',
                currentUser.uid // O ID da candidatura é o UID do candidato
            );

            //  Referência para candidatura no perfil do usuário (minhas candidaturas)
            const minhaCandidaturaRef = doc(
                db,
                'users',
                currentUser.uid,
                'minhasCandidaturas',
                projetoId // Salva usando o ID do projeto
            );

            const candidaturaSnap = await getDoc(candidaturaRef);
            
            if (candidaturaSnap.exists()) {
                const dados = candidaturaSnap.data();
                // Se já estiver pendente ou aceito, bloqueia
                // Se estiver rejeitado ou removido, permite tentar de novo
                if (dados.status === 'pendente' || dados.status === 'aceito') {
                    const msg = dados.status === 'aceito' 
                        ? 'Você já faz parte deste projeto.' 
                        : 'Sua candidatura já está em análise.';
                    addToast(msg, 'info');
                    setLoading(false);
                    return;
                }
            }

            // Cria o documento da candidatura
            await setDoc(candidaturaRef, {
                donoId: projeto.donoId,
                userId: currentUser.uid,
                nome: userData.nome,
                sobrenome: userData.sobrenome,
                avatarColor: userData.avatarColor || '#0a528a',
                status: 'pendente', // Status inicial
                dataCandidatura: serverTimestamp(), // Data/hora do servidor
                lida: false, // Marca como não lida inicialmente
            });

            // Salva um espelho da candidatura no perfil do usuário (minhas candidaturas)
            await setDoc(minhaCandidaturaRef, {
                projetoId: projetoId,
                nomeProjeto: projeto.nome,
                status: 'pendente',
                dataCandidatura: serverTimestamp(),
            });

            // Feedback de sucesso
            addToast('Candidatura enviada com sucesso!', 'success');
            // Fecha o modal após sucesso
            if (onClose) onClose();
        } catch (error) {
            console.error('Erro ao enviar candidatura:', error);
            // Verifica se o erro é de permissão (indicativo de que a regra de escrita na subcoleção pode estar errada)
            if (error.code === 'permission-denied') {
                addToast(
                    'Erro de permissão ao enviar candidatura. Verifique as regras do Firestore.',
                    'error'
                );
            } else {
                addToast(
                    'Ocorreu um erro ao enviar sua candidatura. Tente novamente.',
                    'error'
                );
            }
        } finally {
            setLoading(false); // Garante que o loading termine
        }
    };

    // Função para abrir modal de confirmação de saída
    const handleSairDoProjeto = () => {
        setConfirmOpen(true);
    };

    /* Função executada após confirmação para remover o usuário atual do projeto.
     * Atualiza os arrays 'participantIds' e 'participantes' no documento do projeto.*/

    const confirmarSaidaDoProjeto = async () => {
        setLoading(true);

        if (!currentUser) {
            addToast(
                'Você precisa estar logado para sair do projeto.',
                'error'
            );
            setLoading(false);
            return;
        }

        try {
            const projetoRef = doc(db, 'projetos', projetoId);

            // Lógica para buscar e atualizar o projeto
            const projetoSnap = await getDoc(projetoRef);
            if (!projetoSnap.exists())
                throw new Error('Projeto não encontrado.');
            const projetoData = projetoSnap.data();

            const novosParticipantIds = (
                projetoData.participantIds || []
            ).filter((id) => id !== currentUser.uid);
            const novosParticipantes = (projetoData.participantes || []).filter(
                (p) => p.uid !== currentUser.uid
            );

            await updateDoc(projetoRef, {
                participantIds: novosParticipantIds,
                participantes: novosParticipantes,
            });

            const chatRef = doc(db, 'conversas', projetoId);
            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                const chatData = chatSnap.data();

                // Filtra os arrays de participantes do chat
                const novosParticipantesChat = (
                    chatData.participantes || []
                ).filter((uid) => uid !== currentUser.uid);
                const novosParticipantesInfoChat = (
                    chatData.participantesInfo || []
                ).filter((p) => p.uid !== currentUser.uid);

                await updateDoc(chatRef, {
                    participantes: novosParticipantesChat,
                    participantesInfo: novosParticipantesInfoChat,
                });
                console.log('Usuário removido do chat com sucesso.');
            } else {
                console.warn(
                    'Chat não encontrado pelo ID direto. Tentando busca legada...'
                );
                // Fallback: Tenta buscar por query se o ID direto falhar (para projetos muito antigos)
                const conversasRef = collection(db, 'conversas');
                const q = query(
                    conversasRef,
                    where('projetoId', '==', projetoId)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const chatDoc = querySnapshot.docs[0];
                    const chatRefLegado = doc(db, 'conversas', chatDoc.id);
                    const chatDataLegado = chatDoc.data();

                    const novosParticipantesChat = (
                        chatDataLegado.participantes || []
                    ).filter((uid) => uid !== currentUser.uid);
                    const novosParticipantesInfoChat = (
                        chatDataLegado.participantesInfo || []
                    ).filter((p) => p.uid !== currentUser.uid);

                    await updateDoc(chatRefLegado, {
                        participantes: novosParticipantesChat,
                        participantesInfo: novosParticipantesInfoChat,
                    });
                }
            }

            // Apaga o registo da lista Minhas Candidaturas do usuário
            // Isso vai fazer o card sumir da tela Minhas Candidaturas imediatamente
            const minhaCandidaturaRef = doc(
                db,
                'users',
                currentUser.uid,
                'minhasCandidaturas',
                projetoId
            );
            await deleteDoc(minhaCandidaturaRef);

            // Apaga o documento da candidatura dentro do projeto
            // Isso permite que o usuário se candidate novamente no futuro se quiser!!
            const candidaturaRef = doc(
                db,
                'projetos',
                projetoId,
                'candidaturas',
                currentUser.uid
            );
            await deleteDoc(candidaturaRef);

            addToast('Você saiu do projeto com sucesso.', 'success');
            setConfirmOpen(false); // Fecha o modal de confirmação
            setTimeout(() => onClose && onClose(), 1500); // Fecha o modal principal após um delay
        } catch (error) {
            console.error('Erro ao sair do projeto:', error);
            addToast('Ocorreu um erro ao tentar sair do projeto.', 'error');
            setConfirmOpen(false); // Fecha o modal de confirmação mesmo com erro
        } finally {
            setLoading(false);
        }
    };

    // Função para iniciar chat privado
    const handleSendMessage = async (destinatario) => {
        if (!currentUser || !userData) return;
        if (destinatario.uid === currentUser.uid) return;

        const conversasRef = collection(db, 'conversas');
        const pairKey = [currentUser.uid, destinatario.uid].sort().join('_');

        const q = query(
            conversasRef,
            where('isGrupo', '==', false),
            where('pairKey', '==', pairKey),
            // Garante que a consulta só considere documentos onde o utilizador atual é participante
            where('participantes', 'array-contains', currentUser.uid)
        );

        try {
            const querySnapshot = await getDocs(q);
            let conversaId;

            if (querySnapshot.empty) {
                const novaConversa = await addDoc(conversasRef, {
                    isGrupo: false,
                    pairKey,
                    participantes: [currentUser.uid, destinatario.uid],
                    participantesInfo: [
                        {
                            uid: currentUser.uid,
                            nome: userData.nome,
                            sobrenome: userData.sobrenome,
                        },
                        {
                            uid: destinatario.uid,
                            nome: destinatario.nome,
                            sobrenome: destinatario.sobrenome,
                        },
                    ],
                    unreadCounts: {
                        [currentUser.uid]: 0,
                        [destinatario.uid]: 0,
                    },
                    ultimaMensagem: null,
                    criadoEm: serverTimestamp(),
                });
                conversaId = novaConversa.id;
            } else {
                conversaId = querySnapshot.docs[0].id;
            }

            if (onClose) onClose(); // Fecha o modal atual

            // Navega para a página de mensagens, passando o ID da conversa ativa
            navigate('/dashboard/mensagens', {
                state: { activeChatId: conversaId },
            });
        } catch (error) {
            console.error('Erro ao iniciar conversa:', error);
            addToast('Não foi possível iniciar a conversa.', 'error');
        }
    };

    // Função para alternar menu de integrante
    const toggleMenuIntegrante = (uid) => {
        setIntegranteAberto(integranteAberto === uid ? null : uid);
    };

    // Função para buscar dados do integrante e abrir modal
    const handleVerPerfilIntegrante = async (integrante) => {
        setLoadingIntegrante(true);
        setPerfilModalOpen(true);
        try {
            // A informação do integrante no projeto pode estar desatualizada.
            // Por isso, buscamos a versão mais recente do perfil do usuário.
            const userRef = doc(db, 'users', integrante.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setIntegranteSelecionado({
                    ...userSnap.data(),
                    uid: integrante.uid,
                });
            } else {
                // Se não encontrar, exibe os dados básicos que já temos
                setIntegranteSelecionado(integrante);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do integrante:', error);
            setIntegranteSelecionado(integrante); // Fallback
        } finally {
            setLoadingIntegrante(false);
        }
    };

    return (
        <>
            <ModalWrapper>
                <Header>
                    <TituloProjeto>{nome}</TituloProjeto>
                    <CriadoPor>
                        Criado por:{' '}
                        <span>
                            {donoNome} {donoSobrenome}
                        </span>
                    </CriadoPor>
                </Header>

                <ConteudoSuperior>
                    <ColunaEsquerda>
                        <Secao>
                            <SecaoTitulo>Status</SecaoTitulo>
                            <TagsContainer>
                                <Tag
                                    $tipo="status"
                                    $bgColor={statusStyle.$color}
                                    $textColor={statusStyle.$textColor}
                                >
                                    {projeto.status || 'Não definido'}
                                </Tag>
                            </TagsContainer>
                        </Secao>
                        <Secao>
                            <SecaoTitulo>Área</SecaoTitulo>
                            <TagsContainer>
                                {area && <Tag $tipo="area">{area}</Tag>}
                            </TagsContainer>
                        </Secao>
                        <Secao>
                            <SecaoTitulo>Habilidades Relevantes</SecaoTitulo>
                            <TagsContainer>
                                {habilidades.map((h) => (
                                    <Tag key={h} $tipo="habilidade">
                                        {h}
                                    </Tag>
                                ))}
                            </TagsContainer>
                        </Secao>
                    </ColunaEsquerda>

                    <ColunaDireita>
                        <Secao>
                            <SecaoTitulo>INTEGRANTES</SecaoTitulo>
                            <IntegrantesLista>
                                {todosOsIntegrantes.map((p) => (
                                    <IntegranteItem
                                        key={p.uid}
                                        $isClickable={isParticipant}
                                        //A função de clique só é ativada se for um participante
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isParticipant)
                                                toggleMenuIntegrante(p.uid);
                                        }}
                                    >
                                        <Avatar $bgColor={p.avatarColor}>
                                            {getInitials(p.nome, p.sobrenome)}
                                        </Avatar>
                                        <NomeIntegrante>
                                            {p.nome} {p.sobrenome}{' '}
                                            {p.isDono && '(Dono)'}
                                        </NomeIntegrante>

                                        {/*A seta do menu só aparece para participantes */}
                                        {isParticipant && (
                                            <FiChevronDown
                                                style={{ marginLeft: 'auto' }}
                                            />
                                        )}

                                        {/*O menu suspenso só é renderizado se for participante */}
                                        {integranteAberto === p.uid &&
                                            isParticipant && (
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        role="button"
                                                        onClick={() =>
                                                            handleVerPerfilIntegrante(
                                                                p
                                                            )
                                                        }
                                                    >
                                                        <FiUser /> Ver Perfil
                                                    </DropdownItem>
                                                    {p.uid !==
                                                        currentUser.uid && (
                                                        <DropdownItem
                                                            role="button"
                                                            onClick={() =>
                                                                handleSendMessage(
                                                                    p
                                                                )
                                                            }
                                                        >
                                                            <FiMessageSquare />{' '}
                                                            Enviar Mensagem
                                                        </DropdownItem>
                                                    )}
                                                </DropdownMenu>
                                            )}
                                    </IntegranteItem>
                                ))}
                            </IntegrantesLista>
                        </Secao>
                    </ColunaDireita>
                </ConteudoSuperior>

                <DescricaoContainer>
                    <SecaoTitulo>Descrição do Projeto</SecaoTitulo>
                    <Descricao>{descricao}</Descricao>
                </DescricaoContainer>

                <Footer>
                    {isParticipant && !isOwner && (
                        <Botao
                            variant="excluir"
                            onClick={handleSairDoProjeto}
                            disabled={loading}
                        >
                            {loading ? 'Saindo...' : 'Sair do Projeto'}
                        </Botao>
                    )}

                    {/* Lógica para quem NÃO é participante e NÃO é dono */}
                    {!isParticipant && !isOwner && (
                        <>
                            {projeto.status === 'Concluído' ? (
                                /* Botão visualmente desativado */
                                <Botao
                                    variant="hab-int"
                                    disabled={true}
                                    style={{ 
                                        backgroundColor: '#736f6fff', 
                                        cursor: 'not-allowed', 
                                        opacity: 0.7,
                                        border: 'none'
                                    }}
                                >
                                    Projeto Concluído
                                </Botao>
                            ) : (
                                /* SE O STATUS = NOVO OU EM ANDAMENTO: Botão normal de candidatura */
                                <Botao
                                    variant="hab-int"
                                    onClick={handleCandidatura}
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Candidatar-se'}
                                </Botao>
                            )}
                        </>
                    )}
                </Footer>
            </ModalWrapper>

            <PerfilUsuarioModal
                isOpen={isPerfilModalOpen}
                onClose={() => setPerfilModalOpen(false)}
                usuario={integranteSelecionado}
                loading={loadingIntegrante}
                tipo="integrante"
            />

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                size="excluir-projeto"
            >
                <TemCertezaModal
                    titulo="Sair do Projeto?"
                    mensagem="Tem certeza?"
                    onConfirm={confirmarSaidaDoProjeto}
                    onClose={() => setConfirmOpen(false)}
                    loading={loading}
                />
            </Modal>
        </>
    );
}

export default VerDetalhesModal;
