import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProtetorRota({ children }) {
    const { currentUser } = useAuth();

    // Duas verificações
    // Se existe um utilizador e se o email do utilizador foi verificado
    if (!currentUser || !currentUser.emailVerified) {
        // se qualquer uma das condições for falsa, redireciona para a página inicial
        return <Navigate to="/" />;
    }

    // se o utilizador existir e o email for verificado, mostra a pagina
    return children;
}

export default ProtetorRota;
