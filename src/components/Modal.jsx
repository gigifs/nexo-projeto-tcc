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
    background-color: #f5fafc;
    padding: 1.25rem;
    border-radius: 2.5rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    position: relative;
    width: 90%;
    max-height: 90vh; /* altura máxima segura para desktop */
    overflow-y: auto;

    /* Esconde a barra de rolagem */
    scrollbar-width: none; /* Para Firefox */
    -ms-overflow-style: none; /* Para IE e Edge antigos */
    /* Para Chrome, Safari, Opera (navegadores WebKit) */
    &::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 768px) {
        max-height: 85vh; /* altura máxima de 80% para mobile */
        width: 95%;
        padding: 1.2rem 0.6rem 1rem 0.6rem;
    }

    ${(props) => {
        switch (props.size) {
            case 'excluir-projeto':
                return css`
                    max-width: 25rem;
                    border-radius: 1.875rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                `;

            case 'large':
                return css`
                    max-width: 38.75rem;
                `;
            case 'small':
                return css`
                    max-width: 35rem;
                `;
            case 'hab-int':
                return css`
                    border-radius: 1.25rem;
                    max-width: 35rem;
                `;
            case 'excluir':
                return css`
                    max-width: 28.75rem;
                    border-radius: 1.875rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                `;
            default:
                // Tamanho padrão se nenhuma prop 'size' for passada
                return css`
                    max-width: 43.75rem;
                `;
        }
    }}
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #000000;
    transition: all 0.3s ease-in-out;

    &:hover {
        color: #0a528a;
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
