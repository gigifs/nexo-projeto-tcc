import styled from 'styled-components';
import Botao from './Botao';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import VerDetalhesModal from './VerDetalhesModal';
import { FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CardWrapper = styled.div`
    background-color: #f5fafc;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 15px;
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
    height: 310px;
    position: relative;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
`;

const TituloProjeto = styled.h3`
    font-size: 22px;
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
    padding: 6px 14px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    background-color: ${(props) => props.$color || '#e0e0e0'};
    color: ${(props) => props.$textColor || '#000'};
`;

const DescricaoProjeto = styled.p`
    font-size: 16px;
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
    gap: 6px;
    height: 30px; /* Altura fixa para apenas UMA linha de tags */
    overflow: hidden; /* Esconde qualquer tag que passe para a segunda linha */
`;

const Tag = styled.span`
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#aed9f4' : '#ffcced'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0')};
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    padding-top: 5px;
    border-top: 1px solid #eee;
`;

const TeamDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
`;

const TeamTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const TeamContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const TeamMemberAvatar = styled.div`
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
    cursor: pointer;
    flex-shrink: 0;
    border: 2px solid #f5fafc; /* Adicionado para criar separação */

    /* Sobreposição dos avatares */
    &:not(:first-child) {
        margin-left: -16px;
    }
`;

const ActionButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const DetalhesBotao = styled(Botao)`
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 10px;
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    if (!sobrenome) return nome.substring(0, 2).toUpperCase();
    return `${nome[0]}${sobrenome[0]}`.toUpperCase();
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        case 'Em Andamento':
            return { $color: '#C9B7F4', $textColor: '#5824d2ff' };
        case 'Concluído':
            return { $color: '#B7F4BB', $textColor: '#18a422ff' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};

function MyProjectCard({ projeto, currentUserId }) {
    const [modalAberto, setModalAberto] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const {
        id,
        nome = 'Projeto sem nome',
        descricao = 'Sem descrição disponível.',
        donoId,
        status = 'Indefinido',
        habilidades = [],
        interesses = [],
        participantes = [],
    } = projeto;

    const statusStyle = getStatusStyle(status);
    const isOwner = currentUserId === donoId;

    const handleGerenciarClick = () => {
        navigate(`/dashboard/meus-projetos/${id}/gerenciar`);
    };

    // Função para abrir o chat
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
                alert('Chat para este projeto não encontrado!');
            }
        } catch (error) {
            console.error('Erro ao buscar chat:', error);
            alert('Não foi possível abrir o chat.');
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
                    {participantes && participantes.length > 0 ? (
                        <TeamDetails>
                            <TeamTitle>
                                <FiUsers size={18} />
                                Sua Equipe
                            </TeamTitle>
                            <TeamContainer>
                                {/* Lógica de limite adicionada aqui com .slice(0, 3) */}
                                {participantes.slice(0, 3).map((p) => (
                                    <TeamMemberAvatar
                                        key={p.uid}
                                        title={`${p.nome} ${p.sobrenome}`}
                                    >
                                        {getInitials(p.nome, p.sobrenome)}
                                    </TeamMemberAvatar>
                                ))}
                            </TeamContainer>
                        </TeamDetails>
                    ) : (
                        //Se a condição for falsa, renderiza o placeholder
                        <div />
                    )}

                    <ActionButtonsContainer>
                        <DetalhesBotao onClick={handleChatClick}>
                            Chat
                        </DetalhesBotao>

                        {isOwner ? (
                            <DetalhesBotao onClick={handleGerenciarClick}>
                                Gerenciar Projeto
                            </DetalhesBotao>
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
