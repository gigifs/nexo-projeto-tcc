import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FiUser, FiMessageSquare, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const MenuContainer = styled.div`
    position: absolute;
    top: 3.75rem; /* Distância do topo do header */
    right: 0;
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    width: 17.5rem;
    z-index: 100;
    overflow: hidden;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.94rem;

    @media (max-width: 768px) {
        width: 14rem;
    }
`;

const MenuItem = styled.div`
    position: relative;
    z-index: 1;
    font-size: 1.25rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 0.94rem;
    color: #000000ff;
    text-decoration: none;
    cursor: pointer;
    border-radius: 0.5rem;
    transition:
        background-color 0.2s,
        color 0.2s;

    &::before {
        content: '';
        position: absolute;
        z-index: -1; /* Coloca o fundo atrás do texto e do ícone */

        /* Faz o fundo ser um pouco maior*/
        top: -6px;
        left: -8px;
        right: -8px;
        bottom: -6px;

        background-color: #238cd766;
        border-radius: 1.25rem;

        /* Padrão para esconder segundo o gemini */
        opacity: 0;
        transform: scale(0.95);
        transition: all 0.2s ease-in-out;
    }

    &:hover {
        font-weight: 700;

        /* Aqui que a gente faz o fundo surgir */
        &::before {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (max-width: 768px) {
        font-size: 1.3rem;
        gap: 0.6rem;

        svg {
            width: 1.4rem;
            height: 1.4rem;
        }
    }
`;

const Separator = styled.hr`
    border: 0;
    border-top: 1px solid #0000004d;
    margin: 0;
`;

function DropdownMenu() {
    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = async () => {
        console.log('Botão Sair clicado. A chamar a função logout...');
        await logout();
        console.log('Logout concluído. A navegar para a página inicial...');
        navigate('/'); // Redireciona aqui
    };

    return (
        <MenuContainer>
            <MenuItem onClick={() => navigate('/dashboard/perfil')}>
                <FiUser size={34} strokeWidth={2.2} /> Perfil
            </MenuItem>
            <MenuItem onClick={() => navigate('/dashboard/mensagens')}>
                <FiMessageSquare size={34} strokeWidth={2.2} /> Mensagens
            </MenuItem>
            <MenuItem onClick={() => navigate('/dashboard/configuracoes')}>
                <FiSettings size={34} strokeWidth={2.2} /> Configurações
            </MenuItem>
            <Separator />
            <MenuItem onClick={handleLogout}>
                <FiLogOut size={34} strokeWidth={2.2} /> Sair
            </MenuItem>
        </MenuContainer>
    );
}

export default DropdownMenu;
