import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProtetorRota({ children }) {
    const { currentUser, userData } = useAuth();
    const location = useLocation();

    // Duas verificações - Login e E-mail
    // Se existe um utilizador e se o email do utilizador foi verificado
    if (!currentUser || !currentUser.emailVerified) {
        // se qualquer uma das condições for falsa, redireciona para a página inicial
        return <Navigate to="/" />;
    }
    
    // Verificação de Onboarding
    // Usamos !userData.onboardingCompleted para pegar 'false' E 'undefined'
    const precisaDeOnboarding = userData && !userData.onboardingCompleted;

    if (precisaDeOnboarding && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" />;
    }

    if (!precisaDeOnboarding && location.pathname === '/onboarding') {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default ProtetorRota;