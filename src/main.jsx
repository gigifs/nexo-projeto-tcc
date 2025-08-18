import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { auth } from './firebase';
import {
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence,
} from 'firebase/auth';

// logica da persistencia do lembrar de mim
const persistenceType = localStorage.getItem('firebasePersistence');

// Escolhe a persistência com base no que está guardado, ou usa 'session' como padrão
const persistenceToSet =
    persistenceType === 'local'
        ? browserLocalPersistence
        : browserSessionPersistence;

// Chamamos o setPersistence ANTES de renderizar a app.

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* aplicamos o authProvider no nosso app */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
