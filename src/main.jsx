import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* aplicamos o authProvider no nosso app */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);