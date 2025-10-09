import styled from 'styled-components';
import Botao from './Botao';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import { db } from '../firebase';
import Modal from './Modal';
import TemCertezaModal from './TemCertezaModal';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayRemove,
    collection,
    query,
    where,
    getDocs,
    addDoc,
} from 'firebase/firestore';
import PerfilUsuarioModal from './PerfilUsuarioModal';
import { useNavigate } from 'react-router-dom';

const ModalWrapper = styled.div`
    padding: 10px 30px 20px 30px;
    color: #333;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 25px;
`;

const TituloProjeto = styled.h2`
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin: 10px 0 5px 0;
    line-height: 1.2;
    word-break: break-word;
    text-align: center; /* Centraliza o texto do título */

    /* Define a altura máxima para 4 linhas (4 * 28px * 1.2) */
    max-height: 135px;
    overflow-y: auto; /* Ativa a rolagem vertical se o conteúdo for maior */

    /* Esconde a barra de rolagem na maioria dos navegadores */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
`;

const CriadoPor = styled.p`
    font-size: 16px;
    color: #000000;
    margin: 0;

    span {
        font-weight: 600;
        color: #7c2256;
    }
`;

const Secao = styled.div``;

const ConteudoSuperior = styled.div`
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
`;

const ColunaEsquerda = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ColunaDireita = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #be2d8211;
    padding: 20px;
    border-radius: 10px;
    max-height: 250px;
    overflow-y: auto; /*Adiciona scroll se a descrição for mt grande*/

    /* Esconde a barra de rolagem na maioria dos navegadores */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
`;

const SecaoTitulo = styled.h4`
    font-size: 18px;
    font-weight: 600;
    color: #000;
    margin: 0 0 10px 0;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Tag = styled.span`
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    background-color: ${(props) =>
        props.$tipo === 'status'
            ? props.$bgColor
            : props.$tipo === 'habilidade'
              ? '#aed9f4'
              : props.$tipo === 'area'
                ? '#eba7b18f'
                : '#ffcced'};
    color: ${(props) =>
        props.$tipo === 'status'
            ? props.$textColor
            : props.$tipo === 'habilidade'
              ? '#0b5394'
              : props.$tipo === 'area'
                ? '#7B1B4C'
                : '#9c27b0'};
`;

const IntegrantesLista = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const IntegranteItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative; /* Essencial para o posicionamento do menu */
    cursor: pointer;
    padding: 5px;
    border-radius: 8px;
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
    top: 100%; /* Aparece logo abaixo do item */
    left: 50px; /* Alinhado com o nome */
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 8px;
    z-index: 10;
    width: 180px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const DropdownItem = styled.div`
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const Avatar = styled.div`
    width: 35px;
    height: 35px;
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

const NomeIntegrante = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #000000;
`;

const DescricaoContainer = styled.div`
    margin-bottom: 20px;
`;

const Descricao = styled.p`
    font-size: 16px;
    line-height: 1.5;
    text-align: justify;
    margin: 0;
    max-height: 150px;
    overflow-y: auto; /*Adiciona scroll se a descrição for mt grande*/
    padding-right: 10px;
`;

const Footer = styled.div`
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #eee;
`;

const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        case 'Em Andamento':
            return { $color: '#D1C4E9', $textColor: '#4527A0' };
        case 'Concluído':
            return { $color: '#C8E6C9', $textColor: '#2E7D32' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};

function VerDetalhesModal({ projeto, projetoId, tipo = 'visitante', onClose }) {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [integranteAberto, setIntegranteAberto] = useState(null); // NOVO: controla o menu de cada integrante
    // 2. Novos estados para controlar o modal de perfil do integrante
    const [isPerfilModalOpen, setPerfilModalOpen] = useState(false);
    const [integranteSelecionado, setIntegranteSelecionado] = useState(null);
    const [loadingIntegrante, setLoadingIntegrante] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const {
        nome,
        donoId,
        donoNome,
        donoSobrenome,
        descricao,
        habilidades = [],
        area,
        participantes = [],
    } = projeto;

    const statusStyle = getStatusStyle(projeto.status);

    // A lógica para o botão "Candidatar-se"
    const handleCandidatura = async () => {
        setLoading(true);
        setFeedback('');

        if (!currentUser || !userData) {
            setFeedback('Você precisa estar logado para se candidatar.');
            setLoading(false);
            return;
        }

        if (currentUser.uid === projeto.donoId) {
            setFeedback('Você não pode se candidatar ao seu próprio projeto.');
            setLoading(false);
            return;
        }

        try {
            const candidaturaRef = doc(
                db,
                'projetos',
                projetoId,
                'candidaturas',
                currentUser.uid
            );

            const candidaturaSnap = await getDoc(candidaturaRef);
            if (candidaturaSnap.exists()) {
                setFeedback('Você já se candidatou a este projeto.');
                setLoading(false);
                return;
            }

            await setDoc(candidaturaRef, {
                userId: currentUser.uid,
                nome: userData.nome,
                sobrenome: userData.sobrenome,
                status: 'pendente',
                dataCandidatura: new Date(),
            });

            setFeedback('Candidatura enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar candidatura:', error);
            setFeedback(
                'Ocorreu um erro ao enviar sua candidatura. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSairDoProjeto = () => {
        setConfirmOpen(true);
    };

    const confirmarSaidaDoProjeto = async () => {
        setLoading(true);
        setFeedback('');

        try {
            const projetoRef = doc(db, 'projetos', projetoId);
            const participanteParaRemover = participantes.find(
                (p) => p.uid === currentUser.uid
            );

            if (participanteParaRemover) {
                await updateDoc(projetoRef, {
                    participantIds: arrayRemove(currentUser.uid),
                    participantes: arrayRemove(participanteParaRemover),
                });
            } else {
                await updateDoc(projetoRef, {
                    participantIds: arrayRemove(currentUser.uid),
                });
            }

            setFeedback('Você saiu do projeto com sucesso.');
            setConfirmOpen(false); // Fecha o modal de confirmação

            // Fecha o modal de detalhes após um pequeno atraso
            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 1500);
        } catch (error) {
            console.error('Erro ao sair do projeto:', error);
            setFeedback('Ocorreu um erro ao tentar sair do projeto.');
        } finally {
            setLoading(false);
        }
    };

    // Função para iniciar/abrir uma conversa privada
    const handleSendMessage = async (destinatario) => {
        if (!currentUser || !userData) return;

        // Não permite enviar mensagem para si mesmo
        if (destinatario.uid === currentUser.uid) return;

        const conversasRef = collection(db, 'conversas');
        // Procura por uma conversa que tenha EXATAMENTE os dois participantes
        const q = query(
            conversasRef,
            where('isGrupo', '==', false),
            where('participantes', 'in', [
                [currentUser.uid, destinatario.uid],
                [destinatario.uid, currentUser.uid],
            ])
        );

        try {
            const querySnapshot = await getDocs(q);
            let conversaId;

            if (querySnapshot.empty) {
                // Se não existir, cria uma nova conversa
                const novaConversa = await addDoc(conversasRef, {
                    isGrupo: false,
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
                });
                conversaId = novaConversa.id;
            } else {
                // Se já existir, pega o ID
                conversaId = querySnapshot.docs[0].id;
            }

            // Navega para a página de mensagens, abrindo a conversa correta
            navigate('/dashboard/mensagens', {
                state: { activeChatId: conversaId },
            });
        } catch (error) {
            console.error('Erro ao iniciar conversa:', error);
            alert('Não foi possível iniciar a conversa.');
        }
    };

    const toggleMenuIntegrante = (uid) => {
        setIntegranteAberto(integranteAberto === uid ? null : uid);
    };

    // Nova função para buscar dados do integrante e abrir o modal
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

    // Combina dono e participantes numa lista única para exibição
    const todosOsIntegrantes = [
        { uid: donoId, nome: donoNome, sobrenome: donoSobrenome, isDono: true },
        ...participantes.filter((p) => p.uid !== donoId),
    ];

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
                                        $isClickable={tipo === 'participante'}
                                        //A função de clique só é ativada se for um participante
                                        onClick={() =>
                                            tipo === 'participante' &&
                                            toggleMenuIntegrante(p.uid)
                                        }
                                    >
                                        <Avatar>
                                            {`${p.nome?.[0] || ''}${
                                                p.sobrenome?.[0] || ''
                                            }`.toUpperCase()}
                                        </Avatar>
                                        <NomeIntegrante>
                                            {p.nome} {p.sobrenome}{' '}
                                            {p.isDono && '(Dono)'}
                                        </NomeIntegrante>

                                        {/*A seta do menu só aparece para participantes */}
                                        {tipo === 'participante' && (
                                            <FiChevronDown
                                                style={{ marginLeft: 'auto' }}
                                            />
                                        )}

                                        {/*O menu suspenso só é renderizado se for participante */}
                                        {integranteAberto === p.uid &&
                                            tipo === 'participante' && (
                                                <DropdownMenu>
                                                    <DropdownItem
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
                    {tipo === 'participante' ? (
                        <Botao
                            variant="excluir"
                            onClick={handleSairDoProjeto}
                            disabled={loading}
                        >
                            {loading ? 'A sair...' : 'Sair do Projeto'}
                        </Botao>
                    ) : (
                        <Botao
                            variant="hab-int"
                            onClick={handleCandidatura}
                            disabled={loading}
                        >
                            {loading ? 'A enviar...' : 'Candidatar-se'}
                        </Botao>
                    )}
                    {feedback && (
                        <p style={{ marginTop: '10px' }}>{feedback}</p>
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
