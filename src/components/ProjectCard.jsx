import styled from 'styled-components';
import Botao from './Botao';
import { FaGraduationCap } from 'react-icons/fa';
import { useState, useEffect } from 'react'; // Adicionado useEffect
import Modal from './Modal';
import VerDetalhesModal from './VerDetalhesModal';
import { doc, getDoc } from 'firebase/firestore'; // Importações do Firestore
import { db } from '../firebase'; // Importação da instância do DB

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
    height: 310px; /*Atura máxima do card*/
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
    /*Limita a quantidade de linhas do titulo*/
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /*Título terá no máx 2 linhas*/
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

//Tags com cores condicionais de acordo com o tipo
const Tag = styled.span`
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    /*Define a cor com base na propriedade '$tipo'*/
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#aed9f4' : '#ffcced'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#0b5394' : '#9c27b0')};
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto; /*Empurra o rodapé pro final do card*/
    border-top: 1px solid #eee; /*Barra entre tags e curso, pode tirar caso não gostem*/
`;

const OwnerDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FooterText = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #333;
`;

//Avatar com as iniciais do criador do projeto
const Avatar = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0; /*Impede que o avatar encolha*/
`;

const DetalhesBotao = styled(Botao)`
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 10px;
`;

//Pega as iniciais do nome de quem criou o projeto, e as deixam maiúsculas.
const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    const parts = nome.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
};

//Condição para a cor da tag de status do projeto
const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        case 'Em Andamento':
            return { $color: '#786de080', $textColor: '#372b9cff' };
        case 'Concluido':
            return { $color: '', $textColor: '' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};

function ProjectCard({ projeto }) {
    const [modalAberto, setModalAberto] = useState(false);
    const [donoInfo, setDonoInfo] = useState({
        nome: projeto.donoNome,
        sobrenome: projeto.donoSobrenome,
        avatarColor: projeto.donoAvatarColor,
    });

    const {
        nome,
        descricao,
        donoId, // Precisamos do ID do dono para a busca
        curso,
        status,
        habilidades,
        interesses,
        corProjeto,
    } = projeto;

    // EFEITO PARA BUSCAR OS DADOS ATUALIZADOS DO DONO
    useEffect(() => {
        const fetchDonoData = async () => {
            if (!donoId) return;

            try {
                const userDocRef = doc(db, 'users', donoId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const donoData = userDocSnap.data();
                    setDonoInfo({
                        nome: donoData.nome,
                        sobrenome: donoData.sobrenome,
                        avatarColor: donoData.avatarColor,
                    });
                }
            } catch (error) {
                console.error(
                    'Erro ao buscar dados do dono do projeto:',
                    error
                );
            }
        };

        fetchDonoData();
    }, [donoId]);

    const statusStyle = getStatusStyle(status);
    const nomeCompletoDono =
        `${donoInfo.nome || ''} ${donoInfo.sobrenome || ''}`.trim();
    const avatarInicial = getInitials(donoInfo.nome, donoInfo.sobrenome);

    const corExibicao = corProjeto || donoInfo.avatarColor || '#0a528a';

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
                    {status && (
                        <StatusTag
                            $color={statusStyle.$color}
                            $textColor={statusStyle.$textColor}
                        >
                            {status}
                        </StatusTag>
                    )}
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
                    <OwnerDetails>
                        <FooterText>
                            <FaGraduationCap size={20} color="#555" />
                            <span>{curso || 'Curso não informado'}</span>
                        </FooterText>
                        <FooterText>
                            <Avatar $bgColor={corExibicao}>
                                {avatarInicial}
                            </Avatar>
                            <span>{nomeCompletoDono || 'Nome do Dono'}</span>
                        </FooterText>
                    </OwnerDetails>

                    <DetalhesBotao onClick={() => setModalAberto(true)}>
                        Ver Detalhes
                    </DetalhesBotao>
                </CardFooter>
            </CardWrapper>

            <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <VerDetalhesModal projeto={projeto} projetoId={projeto.id} />
            </Modal>
        </>
    );
}

export default ProjectCard;
