import styled from 'styled-components';
import Botao from './Botao';
import { useState, useEffect } from 'react'; // Adicionado useEffect
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import VerDetalhesModal from './VerDetalhesModal';
import { FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
} from 'firebase/firestore'; // Adicionado doc e getDoc
import { useToast } from '../contexts/ToastContext';
// Importações das novas Utils
import { getInitials } from '../utils/iniciaisNome';
import { getStatusStyle } from '../utils/tagStatus';

const CardWrapper = styled.div`
    background-color: #f5fafc;
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
    height: 19.375rem;
    position: relative;
    &:hover {
        transform: translateY(-0.3rem);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.6rem;
`;

const TituloProjeto = styled.h3`
    font-size: 1.375rem;
    font-weight: 600;
    color: #000;
    margin: 0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
`;

const StatusTag = styled.span`
    padding: 0.375rem 0.875rem;
    border-radius: 0.3rem;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
    background-color: ${(props) => props.$color || '#e0e0e0'};
    color: ${(props) => props.$textColor || '#000'};
`;

const DescricaoProjeto = styled.p`
    font-size: 1rem;
    color: #333;
    line-height: 1.4;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /*Limite de linhas para a descrição*/
    -webkit-box-orient: vertical;
    word-break: break-word;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* Permite que as tags quebrem a linha */
    gap: 0.375rem;
    height: 1.875rem; /* Altura fixa para apenas UMA linha de tags */
    overflow: hidden; /* Esconde qualquer tag que passe para a segunda linha */
`;

const Tag = styled.span`
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    padding-top: 0.3rem;
    border-top: 1px solid #eee;
`;

const TeamDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
`;

const TeamTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const TeamContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
`;

const TeamMemberAvatar = styled.div`
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
    cursor: pointer;
    flex-shrink: 0;
    border: 2px solid #f5fafc; /* Adicionado para criar separação */

    /* Sobreposição dos avatares */
    &:not(:first-child) {
        margin-left: -1rem;
    }
`;

const ActionButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
`;

const DetalhesBotao = styled(Botao)`
    font-size: 1rem;
    padding: 0.375rem 0.6rem;
    border-radius: 0.6rem;
`;

const GerenciarButton = styled(DetalhesBotao)`
    /* Esconde o texto mobile */
    .mobile-text {
        display: none;
    }
    .desktop-text {
        display: inline;
    }

    @media (max-width: 480px) {
        /* Esconde o texto desktop e mostra o mobile */
        .desktop-text {
            display: none;
        }
        .mobile-text {
            display: inline;
        }
    }
`;

function MyProjectCard({ projeto, currentUserId }) {
    const [modalAberto, setModalAberto] = useState(false);
    const { addToast } = useToast();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const {
        id,
        nome = 'Projeto sem nome',
        descricao = 'Sem descrição disponível.',
        donoId,
        corProjeto,
        status = 'Indefinido',
        habilidades = [],
        interesses = [],
        participantes = [],
    } = projeto;

    // Estado para armazenar os dados atualizados dos membros
    const [teamMembers, setTeamMembers] = useState(participantes);

    // EFEITO PARA BUSCAR OS DADOS ATUALIZADOS DOS PARTICIPANTES
    useEffect(() => {
        const fetchTeamData = async () => {
            if (!participantes || participantes.length === 0) return;

            const promises = participantes.map(async (member) => {
                if (!member.uid) return member; // Retorna o membro original se não houver UID

                try {
                    const userDocRef = doc(db, 'users', member.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        return {
                            ...member, // Mantém os dados originais
                            ...userData, // Sobrescreve com os dados mais recentes
                        };
                    }
                    return member; // Retorna o membro original se o documento não for encontrado
                } catch (error) {
                    console.error(
                        'Erro ao buscar dados do participante:',
                        error
                    );
                    return member; // Retorna o membro original em caso de erro
                }
            });

            const updatedMembers = await Promise.all(promises);
            setTeamMembers(updatedMembers);
        };

        fetchTeamData();
    }, [participantes]); // Roda sempre que a lista de participantes mudar

    const statusStyle = getStatusStyle(status);
    const isOwner = currentUserId === donoId;

    const handleGerenciarClick = () => {
        navigate(`/dashboard/meus-projetos/${id}/gerenciar`);
    };

    const handleChatClick = async () => {
        try {
            const conversasRef = collection(db, 'conversas');
            const q = query(
                conversasRef,
                where('projetoId', '==', id),
                where('participantes', 'array-contains', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const conversaId = querySnapshot.docs[0].id;
                navigate('/dashboard/mensagens', {
                    state: { activeChatId: conversaId },
                });
            } else {
                addToast('Chat para este projeto não encontrado!', 'error');
            }
        } catch (error) {
            console.error('Erro ao buscar chat:', error);
            addToast('Não foi possível abrir o chat.', 'error');
        }
    };

    const tagsParaExibir = [
        ...(habilidades || [])
            .slice(0, 3)
            .map((h) => ({ nome: h, tipo: 'habilidade' })),
        ...(interesses || [])
            .slice(0, 3)
            .map((i) => ({ nome: i, tipo: 'interesse' })),
    ];

    return (
        <>
            <CardWrapper>
                <CardHeader>
                    <TituloProjeto>{nome}</TituloProjeto>
                    <StatusTag
                        $color={statusStyle.$color}
                        $textColor={statusStyle.$textColor}
                    >
                        {status}
                    </StatusTag>
                </CardHeader>

                <DescricaoProjeto>{descricao}</DescricaoProjeto>

                <TagsContainer>
                    {tagsParaExibir.map((tag) => (
                        <Tag key={tag.nome} $tipo={tag.tipo}>
                            {tag.nome}
                        </Tag>
                    ))}
                </TagsContainer>

                <CardFooter>
                    {teamMembers && teamMembers.length > 0 ? (
                        <TeamDetails>
                            <TeamTitle>
                                <FiUsers size={18} />
                                Sua Equipe
                            </TeamTitle>
                            <TeamContainer>
                                {/* ALTERADO: Mapeia o estado 'teamMembers' */}
                                {teamMembers.slice(0, 3).map((p) => (
                                    <TeamMemberAvatar
                                        key={p.uid}
                                        $bgColor={p.avatarColor} // USA A COR ATUALIZADA
                                        title={`${p.nome} ${p.sobrenome}`}
                                    >
                                        {getInitials(p.nome, p.sobrenome)}
                                    </TeamMemberAvatar>
                                ))}
                            </TeamContainer>
                        </TeamDetails>
                    ) : (
                        <div />
                    )}

                    <ActionButtonsContainer>
                        <DetalhesBotao onClick={handleChatClick}>
                            Chat
                        </DetalhesBotao>

                        {isOwner ? (
                            <GerenciarButton onClick={handleGerenciarClick}>
                                <span className="desktop-text">
                                    Gerenciar Projeto
                                </span>
                                <span className="mobile-text">Gerenciar</span>
                            </GerenciarButton>
                        ) : (
                            <DetalhesBotao onClick={() => setModalAberto(true)}>
                                Ver Detalhes
                            </DetalhesBotao>
                        )}
                    </ActionButtonsContainer>
                </CardFooter>
            </CardWrapper>
            <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <VerDetalhesModal
                    projeto={projeto}
                    projetoId={projeto.id}
                    tipo="participante"
                />
            </Modal>
        </>
    );
}

export default MyProjectCard;
