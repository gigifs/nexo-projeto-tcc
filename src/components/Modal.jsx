import styled, { css } from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed; /* Cobre a tela inteira */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fundo preto semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Garante que fique na frente de tudo */
`;

const ModalBox = styled.div`
  background-color: #F5FAFC;
  padding: 20px;
  border-radius: 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  position: relative;
  width: 90%;
  
  ${(props) => {
    switch (props.size) {
      case 'large':
        return css` max-width: 620px; `;
      case 'small':
        return css` max-width: 560px; `;
      default:
        // Tamanho padrão se nenhuma prop 'size' for passada
        return css` max-width: 700px; `;
    }
  }}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000000;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: #0A528A;
  }
`;

function Modal({ isOpen, onClose, children, size }) {
  // Se a prop 'isOpen' for falsa, o componente não renderiza nada.
  // Forma eficiente de esconder um componente em React!
  if (!isOpen) {
    return null;
  }

  return (
    // Isso significa que aquele fundo mais escuro exerce o poder de fechar o modal caso clicado
    <ModalOverlay onClick={onClose}>
      {/* Usamos e.stopPropagation() para evitar que um clique DENTRO do modal feche ele. */}
      <ModalBox onClick={(e) => e.stopPropagation()} size={size}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        {children}
      </ModalBox>
    </ModalOverlay>
  );
}

export default Modal;