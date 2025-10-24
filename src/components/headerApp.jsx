import { useState } from 'react';
import styled from 'styled-components';
import logoNexo from '../assets/logo.svg';
// Importar FiMenu e FiX
import { FiBell, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';
import MenuSuspenso from './MenuSuspenso.jsx';
import Notificacoes from './Notificacoes.jsx';

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 40px;
    background-color: #f5fafc;
    box-shadow: 0 3px 6px rgba(124, 34, 86, 0.45);
    width: 100%;
    position: sticky; /* Mantém no topo */
    top: 0;
    z-index: 10; /* Fica acima do conteúdo, mas abaixo do menu lateral */

    @media (max-width: 1024px) {
        padding: 8px 20px;
        /* justify-content: right; // Remover se quiser o menu hambúrguer à esquerda */
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
    width: 170px;
    z-index: 11;

    @media (max-width: 1024px) {
        display: none; /* Esconde o logo em telas menores */
    }
`;

const UserArea = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative; /* Para o menu suspenso se posicionar corretamente */

    /* Garante que a UserArea vá para a direita quando o logo some */
    @media (max-width: 1024px) {
      margin-left: auto;
    }
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
    background-color: ${(props) => props.$bgColor || '#0a528a'};
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

// Receber as novas props onToggleMenu e isMenuOpen
function HeaderApp({ onToggleMenu, isMenuOpen }) {
    const { userData } = useAuth();
    const [menuSuspensoAberto, setMenuSuspensoAberto] = useState(false);
    const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

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
                <IconeNotificacao onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}>
                    <FiBell size={32} strokeWidth={2.5} />
                </IconeNotificacao>

                {notificacoesAbertas && <Notificacoes onClose={() => setNotificacoesAbertas(false)} />}

                <Avatar $bgColor={userData?.avatarColor}>
                    {getInitials(userData?.nome, userData?.sobrenome)}
                </Avatar>

                <Nome>{userData?.nome}</Nome>
                <UserProfile onClick={() => setMenuSuspensoAberto(!menuSuspensoAberto)}>
                    <span>
                        <FiChevronDown
                            size={30}
                            strokeWidth={2.5}
                            color="#030214b3"
                        />
                    </span>
                </UserProfile>

                {menuSuspensoAberto && <MenuSuspenso />}
            </UserArea>
        </HeaderEstilizado>
    );
}

export default HeaderApp;