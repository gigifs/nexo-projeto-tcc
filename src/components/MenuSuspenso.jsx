import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FiUser, FiMessageSquare, FiSettings, FiLogOut } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';

const MenuContainer = styled.div`
    position: absolute;
    top: 60px; /* Distância do topo do header */
    right: 0;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    width: 280px;
    z-index: 100;
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const MenuItem = styled.a`
    position: relative;
    z-index: 1;
    font-size: 20px;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 15px;
    color: #000000ff;
    text-decoration: none;
    cursor: pointer;
    border-radius: 8px;
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
        border-radius: 20px;

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
`;

const Separator = styled.hr`
    border: 0;
    border-top: 1px solid #0000004d;
    margin: 0;
`;

function DropdownMenu() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // Redireciona aqui
    };

    return (
        <MenuContainer>
            <MenuItem href="#">
                <FiUser size={34} strokeWidth={2.2} /> Perfil
            </MenuItem>
            <MenuItem href="#">
                <FiMessageSquare size={34} strokeWidth={2.2} /> Mensagens
            </MenuItem>
            <MenuItem href="#">
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
