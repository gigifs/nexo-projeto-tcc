// src/contexts/ToastContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

// Cria o contexto (armazém)
const ToastContext = createContext();

// Hook customizado para facilitar o uso do contexto
export const useToast = () => useContext(ToastContext);

// Componente Provedor que gerencia o estado e fornece os dados
export const ToastProvider = ({ children }) => {
    // Estado que guarda a lista de toasts ativos
    const [toasts, setToasts] = useState([]);

    // Função para adicionar um novo toast à lista
    // useCallback evita recriações desnecessárias da função
    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        // Duração aumentada para 4 segundos
        const id = Math.random().toString(36).substring(2, 9); // Gera ID único simples
        // Adiciona o novo toast ao array existente
        setToasts((prevToasts) => [
            ...prevToasts,
            { id, message, type, duration },
        ]);
        console.log('Toast adicionado:', { id, message, type }); // Log para depuração
    }, []);

    // Função para remover um toast da lista pelo ID
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
        console.log('Toast removido:', id); // Log para depuração
    }, []);

    // Objeto com os valores que o contexto vai fornecer
    const value = { addToast, removeToast, toasts };

    // Retorna o Provedor do Contexto, "abraçando" o resto da aplicação (children)
    return (
        <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    );
};
