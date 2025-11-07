import { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoNexo from '../assets/logo.svg';
// Importar FiMenu e FiX
import { FiBell, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';
import MenuSuspenso from './MenuSuspenso.jsx';
import Notificacoes from './Notificacoes.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2.5rem;
    background-color: #f5fafc;
    box-shadow: 0 3px 6px rgba(124, 34, 86, 0.45);
    width: 100%;
    position: sticky; /* Mantém no topo */
    top: 0;
    z-index: 10; /* Fica acima do conteúdo, mas abaixo do menu lateral */

    @media (max-width: 768px) {
        padding: 0.5rem 1.25rem;
        justify-content: right;
    }
`;

// Novo: Ícone do Menu Hambúrguer
const MenuToggleButton = styled.button`
    display: none; /* Escondido em telas grandes */
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-right: 15px; /* Espaço entre o ícone e o logo (se visível) ou user area */
    color: #7c2256; /* Cor roxa */

    @media (max-width: 1024px) {
        display: block; /* Mostra em telas menores */
        z-index: 11; /* Garante que fique acima de outros elementos do header */
    }
`;

// Novo: Container para agrupar logo e botão de menu (opcional, mas ajuda no layout)
const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled.img`
    width: 10.5rem; /*10.625rem é o tamanho certo, 170px*/
    z-index: 11;

    @media (max-width: 1024px) {
        display: none; /* Esconde o logo em telas menores */
    }
`;

const UserArea = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative; /* Para o menu suspenso se posicionar corretamente */

    /* Garante que a UserArea vá para a direita quando o logo some */
    @media (max-width: 1024px) {
        margin-left: auto;
    }
`;

const IconeNotificacao = styled.div`
    position: relative;
    cursor: pointer;
    color: #7c2256;
`;

const BadgeContador = styled.span`
    position: absolute;
    top: -0.2rem;
    right: -0.4rem;
    background-color: #e80e0eff;
    color: white;
    border-radius: 50%;
    width: 1.3rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
    border: 1px solid #f5fafc;
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Avatar = styled.div`
    width: 2.813rem; /*45px*/
    height: 2.813rem; /*45px*/
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Nome = styled.span`
    font-size: 1.25rem;
    font-weight: 300;
    color: #000000ff;
    align-self: center;
    /* Esconder o nome em telas muito pequenas, se necessário */
    @media (max-width: 576px) {
        display: none;
    }
`;

// Função para pegar as iniciais do nome
const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome[0]}${sobrenome ? sobrenome[0] : ''}`.toUpperCase();
};

function HeaderApp({ isMenuOpen, onToggleMenu }) {
    const { userData, currentUser } = useAuth();
    const [menuAberto, setMenuAberto] = useState(false);
    const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
    const [contagemNotificacoes, setContagemNotificacoes] = useState(0);
    const { addToast } = useToast();

    const toggleNotificacoes = () => {
        setNotificacoesAbertas((prev) => !prev);
        setMenuAberto(false);
    };

    const toggleMenu = () => {
        setMenuAberto((prev) => !prev);
        setNotificacoesAbertas(false);
    };

    useEffect(() => {
        if (!currentUser) return;

        const projetosRef = collection(db, 'projetos');
        const qProjetos = query(
            projetosRef,
            where('donoId', '==', currentUser.uid)
        );

        let unsubscribes = [];

        const buscarContagem = async () => {
            try {
                const projetosSnapshot = await getDocs(qProjetos);
                const projetos = projetosSnapshot.docs.map((doc) => doc.id);
                console.log(
                    'Projetos encontrados:',
                    projetosSnapshot.docs.length
                );
                if (projetos.length === 0) {
                    setContagemNotificacoes(0);
                    return;
                }

                // array que vai armazenar os totais de cada projeto
                const contagensPorProjeto = {};

                unsubscribes = projetos.map((id) => {
                    const ref = collection(db, 'projetos', id, 'candidaturas');
                    const q = query(ref, where('lida', '==', false));

                    return onSnapshot(q, (snapshot) => {
                        console.log('Snapshot do projeto', id, snapshot.size);
                        // atualiza o total de não lidas deste projeto
                        contagensPorProjeto[id] = snapshot.size;

                        // soma total de todas as não lidas dos projetos
                        const totalNaoLidas = Object.values(
                            contagensPorProjeto
                        ).reduce((acc, count) => acc + count, 0);

                        setContagemNotificacoes(totalNaoLidas);
                    });
                });
            } catch (error) {
                console.error(
                    'Erro ao buscar contagem de notificações:',
                    error
                );
                addToast('Erro ao carregar contagem de notificações.', 'error');
            }
        };

        buscarContagem();

        return () => {
            unsubscribes.forEach((unsub) => unsub && unsub());
        };
    }, [currentUser]);

    return (
        <HeaderEstilizado>
            <LeftSection>
                {/* Botão do Menu Hambúrguer */}
                <MenuToggleButton onClick={onToggleMenu}>
                    {/* Muda o ícone baseado no estado isMenuOpen */}
                    {isMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
                </MenuToggleButton>
                <Logo src={logoNexo} alt="Logo da empresa Nexo" />
            </LeftSection>

            <UserArea>
                <IconeNotificacao onClick={toggleNotificacoes}>
                    <FiBell size={32} strokeWidth={2.5} />
                    {contagemNotificacoes > 0 && (
                        <BadgeContador>
                            {contagemNotificacoes > 9
                                ? '9+'
                                : contagemNotificacoes}
                        </BadgeContador>
                    )}
                </IconeNotificacao>

                {currentUser && (
                    <>
                        {notificacoesAbertas && (
                            <Notificacoes
                                onClose={() => setNotificacoesAbertas(false)}
                            />
                        )}

                        {/* ALTERADO: Passamos a cor do avatar dinamicamente */}
                        <Avatar $bgColor={userData?.avatarColor}>
                            {getInitials(userData?.nome, userData?.sobrenome)}
                        </Avatar>

                        <Nome>{userData?.nome}</Nome>

                        <UserProfile onClick={toggleMenu}>
                            <FiChevronDown
                                size={30}
                                strokeWidth={2.5}
                                color="#030214b3"
                            />
                        </UserProfile>

                        {menuAberto && <MenuSuspenso />}
                    </>
                )}
            </UserArea>
        </HeaderEstilizado>
    );
}

export default HeaderApp;
