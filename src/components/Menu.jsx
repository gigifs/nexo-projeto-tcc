import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
    FiHome,
    FiSearch,
    FiBriefcase,
    FiMessageSquare,
    FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const MenuEstilizado = styled.aside`
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
    padding: 25px;
    display: flex;
    flex-direction: column;
    font-family: 'Roboto', sans-serif;
`;

const PerfilEstilizado = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 8px 6px;
    margin-bottom: 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #238cd74d; /* Cor de fundo azul clara do hover */
    }
`;

const Avatar = styled.div`
    width: 60px;
    height: 60px;
    background-color: #0a528a;
    color: #ffffff;
    font-weight: 700;
    font-size: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const PerfilInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const Nome = styled.span`
    font-weight: 400;
    font-size: 20px;
    color: #000;
`;

const Curso = styled.span`
    font-size: 20px;
    font-weight: 300;
    color: #000;
`;

const MenuLista = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MenuItem = styled.li`
    display: flex;
    align-items: center;
    gap: 16px;
    height: 50px;
    padding: 0 20px;
    border-radius: 20px;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    /* Lógica para o item ativo */
    background-color: ${({ $ativo }) => ($ativo ? '#238cd74d' : 'transparent')};
    color: ${({ $ativo }) => ($ativo ? '#000' : '#000')};
    font-weight: ${({ $ativo }) => ($ativo ? '500' : '300')};

    /* O ícone também muda de cor */
    svg {
        color: ${({ $ativo }) => ($ativo ? '#0A528A' : '#000')};
        stroke-width: ${({ $ativo }) => ($ativo ? '2.5px' : '2px')};
    }

    &:hover {
        background-color: #238cd74d;
        color: #000;
        font-weight: 500;

        svg {
            color: #0a528a;
            stroke-width: 3px;
        }
    }
`;

// Função para pegar as iniciais do nome
const getInitials = (nome, sobrenome) => {
    if (!nome || !sobrenome) return '?';
    return `${nome[0]}${sobrenome[0]}`.toUpperCase();
};

function Menu() {
    const { userData } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <MenuEstilizado>
            <PerfilEstilizado
                $ativo={location.pathname === '/dashboard/perfil'}
                onClick={() => navigate('/dashboard/perfil')}
            >
                <Avatar>
                    {userData
                        ? getInitials(userData.nome, userData.sobrenome)
                        : 'US'}
                </Avatar>
                <PerfilInfo>
                    <Nome>
                        {userData?.nome || 'Nome do Usuário'}{' '}
                        {userData?.sobrenome}
                    </Nome>
                    <Curso>{userData?.curso || 'Curso não informado'}</Curso>
                </PerfilInfo>
            </PerfilEstilizado>

            <MenuLista>
                <MenuItem
                    $ativo={location.pathname === '/dashboard'}
                    onClick={() => navigate('/dashboard')}
                >
                    <FiHome size={32} /> Home
                </MenuItem>
                <MenuItem
                    $ativo={location.pathname === '/dashboard/buscar-projetos'}
                    onClick={() => navigate('/dashboard/buscar-projetos')}
                >
                    <FiSearch size={32} /> Buscar Projetos
                </MenuItem>
                <MenuItem
                    $ativo={location.pathname === '/dashboard/meus-projetos'}
                    onClick={() => navigate('/dashboard/meus-projetos')}
                >
                    <FiBriefcase size={32} /> Meus Projetos
                </MenuItem>
                <MenuItem
                    $ativo={location.pathname === '/dashboard/mensagens'}
                    onClick={() => navigate('/dashboard/mensagens')}
                >
                    <FiMessageSquare size={32} /> Mensagens
                </MenuItem>
                <MenuItem
                    $ativo={location.pathname === '/dashboard/configuracoes'}
                    onClick={() => navigate('/dashboard/configuracoes')}
                >
                    <FiSettings size={32} /> Configurações
                </MenuItem>
            </MenuLista>
        </MenuEstilizado>
    );
}

export default Menu;
