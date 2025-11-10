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
    border-radius: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
    padding: 1.563rem;
    display: flex;
    flex-direction: column;
    font-family: 'Roboto', sans-serif;
`;

const PerfilEstilizado = styled.div`
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.5rem 0.4rem;
    margin-bottom: 1.25rem;
    border-radius: 1.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #238cd74d; /* Cor de fundo azul clara do hover */
    }
`;

// ALTERADO: Avatar agora aceita a propriedade $bgColor
const Avatar = styled.div`
    width: 3.75rem;
    height: 3.75rem;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-weight: 700;
    font-size: 1.875rem;
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
    font-weight: 450;
    font-size: 1.25rem;
    color: #000;
`;

const Curso = styled.span`
    font-size: 1.25rem;
    font-weight: 450;
    color: #6a6767ff;
    padding: 5px 3px 3px 0;

    @media (max-width: 1300px) {
        font-size: 1.1rem;
   }
`;

const MenuLista = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const MenuItem = styled.li`
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 3.125rem;
    padding: 0 1.25rem;
    border-radius: 1.25rem;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    background-color: ${({ $ativo }) => ($ativo ? '#238cd74d' : 'transparent')};
    color: ${({ $ativo }) => ($ativo ? '#000' : '#000')};
    font-weight: ${({ $ativo }) => ($ativo ? '500' : '300')};

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

    @media (max-width: 1024px) {
        font-size: 1.2rem;
        
  }
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome[0]}${sobrenome ? sobrenome[0] : ''}`.toUpperCase();
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
                {/* ALTERADO: Passamos a cor do avatar dinamicamente */}
                <Avatar $bgColor={userData?.avatarColor}>
                    {getInitials(userData?.nome, userData?.sobrenome)}
                </Avatar>
                <PerfilInfo>
                    <Nome>
                        {userData?.nome || 'Nome'}{' '}
                        {userData?.sobrenome || 'Sobrenome'}
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
                    $ativo={location.pathname.startsWith('/dashboard/configuracoes')}
                    onClick={() => navigate('/dashboard/configuracoes')}
                >
                    <FiSettings size={32} /> Configurações
                </MenuItem>
            </MenuLista>
        </MenuEstilizado>
    );
}

export default Menu;