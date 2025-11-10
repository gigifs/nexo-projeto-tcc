import { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import HeaderApp from '../components/headerApp';
import Menu from '../components/Menu';
import MeusInteresses from '../components/MeusInteresses';
import EditarInteressesModal from '../components/EditarInteressesModal';
import Modal from '../components/Modal';
import { FiChevronsLeft } from 'react-icons/fi'; // Importar o ícone de fechar

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e6ebf0;
  overflow-y: auto; /* Permitir scroll geral se necessário */
  position: relative; /* Para o overlay e menu */
`;

const CorpoDaPagina = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 2.5rem 1.25rem 1.25rem 2.5rem; /* Adicionado padding bottom */
  gap: 1.875rem;
  position: relative; /* Contexto de empilhamento */

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 1.25rem;
    overflow-x: hidden; /* Evitar scroll horizontal */
  }
`;

// Botão para fechar o menu lateral
const CloseMenuButton = styled.button`
  display: none; /* Escondido por padrão */
  background-color: transparent;
  border-radius: 1rem;
  border: none;
  position: absolute;
  top: 0.95rem;
  right: 0.95rem;
  cursor: pointer;
  color: #7c2256;
  font-size: 1.5rem;
  z-index: 1001; /* Acima do menu */

  &:hover {
    color: #a21065ff;
    background-color: #c56ca02f;
  }

  @media (max-width: 1024px) {
    display: block; /* Visível em telas menores */
  }
`;

const ColunaEsquerda = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  width: 22.5rem;
  flex-shrink: 0;
  position: relative; /* Para o botão de fechar */

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0; /* Ocupa altura total */
    width: 18.75rem; /* Largura do menu lateral */
    background-color: #f5fafc; /* Cor de fundo diferente para destaque */
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    padding: 4.375rem 1.25rem 1.875rem; /* Mais padding no topo para o HeaderApp */
    transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    overflow-y: auto;

    /* Esconde a barra de rolagem na maioria dos navegadores */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
  }
`;

const ColunaDireita = styled.main`
  flex-grow: 1;
  /* Removido overflow-y: auto daqui, LayoutContainer controla o scroll principal */
  padding: 0 1.25rem 1.25rem 0px; /* Ajustado padding */
  min-height: 0;
  min-width: 0; /* Evita que o conteúdo force a largura */

  @media (max-width: 1024px) {
    padding: 0;
  }
`;

const Overlay = styled.div`
  display: none; /* Escondido por padrão */
  @media (max-width: 1024px) {
    display: block; /* Mostrado apenas em telas menores */
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparente */
    z-index: 999; /* Abaixo do menu, acima do conteúdo */
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
    transition: opacity 0.3s ease-in-out;
  }
`;

function DashboardLayout() {
  const [interessesModalOpen, setInteressesModalOpen] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Função para abrir/fechar o menu
  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <LayoutContainer>
      {/* Passando onToggleMenu e isMenuOpen para o HeaderApp */}
      <HeaderApp onToggleMenu={toggleMenu} isMenuOpen={menuAberto} />
      <CorpoDaPagina>
        {/* Passando o estado $isOpen para a ColunaEsquerda */}
        <ColunaEsquerda $isOpen={menuAberto}>
          {/* Botão de fechar dentro do menu */}
          <CloseMenuButton onClick={toggleMenu}>
            <FiChevronsLeft size={30} />
          </CloseMenuButton>
          <Menu />
          <MeusInteresses onEditClick={() => setInteressesModalOpen(true)} />
        </ColunaEsquerda>

        {/* Passando o estado isMenuOpen para a ColunaDireita */}
        <ColunaDireita /* $isMenuOpen={menuAberto} */>
          <Outlet />
        </ColunaDireita>
      </CorpoDaPagina>

      {/* O Overlay só é ativado quando o menu está aberto */}
      <Overlay $isOpen={menuAberto} onClick={toggleMenu} />

      <Modal
        isOpen={interessesModalOpen}
        onClose={() => setInteressesModalOpen(false)}
        size="hab-int"
      >
        <EditarInteressesModal
          onSuccess={() => setInteressesModalOpen(false)}
        />
      </Modal>
    </LayoutContainer>
  );
}

export default DashboardLayout;