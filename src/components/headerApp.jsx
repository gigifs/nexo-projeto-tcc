import { useState } from 'react';
import styled from 'styled-components';
import logoNexo from '../assets/logo.svg';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';
import MenuSuspenso from './MenuSuspenso.jsx';

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 40px;
    background-color: #f5fafc;
    box-shadow: 0 3px 6px rgba(124, 34, 86, 0.45);
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 10;

    @media (max-width: 768px) {
        padding: 8px 20px;
        justify-content: right;
    }
`;

const Logo = styled.img`
    width: 170px;
    z-index: 11;

    @media (max-width: 768px) {
        display: none;
    }
`;

const UserArea = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative; /* Para o menu suspenso se posicionar corretamente */
`;

const IconeNotificacao = styled.div`
    cursor: pointer;
    color: #7c2256;
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Avatar = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Nome = styled.span`
    font-size: 20px;
    font-weight: 300;
    color: #000000ff;
    align-self: center;
`;

// Função para pegar as iniciais do nome
const getInitials = (nome, sobrenome) => {
    if (!nome || !sobrenome) return '?';
    return `${nome[0]}${sobrenome[0]}`.toUpperCase();
};

function HeaderApp() {
    const { userData } = useAuth();
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <HeaderEstilizado>
            <Logo src={logoNexo} alt="Logo da empresa Nexo" />

            <UserArea>
                <IconeNotificacao>
                    <FiBell size={32} strokeWidth={2.5} />
                </IconeNotificacao>
                <Avatar>
                    {getInitials(userData?.nome, userData?.sobrenome)}
                </Avatar>
                <Nome>{userData?.nome}</Nome>
                <UserProfile onClick={() => setMenuAberto(!menuAberto)}>
                    <span>
                        <FiChevronDown
                            size={30}
                            strokeWidth={2.5}
                            color="#030214b3"
                        />
                    </span>
                </UserProfile>

                {menuAberto && <MenuSuspenso />}
            </UserArea>
        </HeaderEstilizado>
    );
}

export default HeaderApp;
