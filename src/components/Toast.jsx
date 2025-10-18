// src/components/Toast.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiX, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

// Animação de entrada (desliza da direita)
const toastEnter = keyframes`
  from {
    transform: translateX(110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Animação de saída (desliza para a direita)
const toastLeave = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(110%);
    opacity: 0;
  }
`;

const ToastWrapper = styled.div`
    background-color: #fff;
    color: #333;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    min-width: 300px;
    /* Animação de entrada */
    animation: ${toastEnter} 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;

    /* Aplica animação de saída se $exiting for true */
    ${({ $exiting }) =>
        $exiting &&
        css`
            animation: ${toastLeave} 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)
                forwards;
        `}

    /* Borda lateral colorida baseada no tipo */
    ${({ $type }) => {
        switch ($type) {
            case 'success':
                return css`
                    border-left: 5px solid #4caf50; /* Verde */
                    svg {
                        color: #4caf50;
                    }
                `;
            case 'error':
                return css`
                    border-left: 5px solid #f44336; /* Vermelho */
                    svg {
                        color: #f44336;
                    }
                `;
            case 'info':
            default:
                return css`
                    border-left: 5px solid #2196f3; /* Azul */
                    svg {
                        color: #2196f3;
                    }
                `;
        }
    }}
`;

const ToastIcon = styled.div`
    font-size: 24px;
    flex-shrink: 0;
`;

const ToastMessage = styled.p`
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    flex-grow: 1; /* Ocupa espaço disponível */
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 18px;
    padding: 5px;
    margin-left: auto; /* Empurra para a direita */
    line-height: 1;
    flex-shrink: 0;

    &:hover {
        color: #555;
    }
`;

// Mapeamento dos tipos para os ícones
const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertTriangle />,
    info: <FiInfo />,
};

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
    // Estado para controlar a animação de saída
    const [exiting, setExiting] = useState(false);

    // useEffect para iniciar o timer de auto-fechamento
    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true); // Inicia animação de saída
            // Chama onClose (que remove o toast do contexto) após a animação
            setTimeout(onClose, 400); // Duração da animação de saída
        }, duration);

        // Função de limpeza: cancela o timer se o toast for fechado antes
        return () => clearTimeout(timer);
    }, [duration, onClose]); // Re-executa se a duração ou onClose mudarem

    // Função para fechar o toast manualmente (clicando no 'X')
    const handleClose = () => {
        setExiting(true);
        setTimeout(onClose, 400); // Duração da animação de saída
    };

    return (
        // Passa o tipo e o estado 'exiting' para os styled-components
        <ToastWrapper $type={type} $exiting={exiting}>
            {/* Usa o ícone correspondente ao tipo, ou 'info' como padrão */}
            <ToastIcon>{icons[type] || icons['info']}</ToastIcon>
            <ToastMessage>{message}</ToastMessage>
            <CloseButton onClick={handleClose}>
                <FiX />
            </CloseButton>
        </ToastWrapper>
    );
};

export default Toast;
