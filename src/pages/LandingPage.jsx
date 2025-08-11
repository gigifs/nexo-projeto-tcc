import { useState } from 'react';
import Header from '../components/header.jsx'
import Inicio from '../components/Inicio.jsx'
import ComoFunciona from '../components/ComoFunciona.jsx'
import CallToAction from '../components/CallToAction.jsx'
import SobreNos from '../components/SobreNos.jsx';
import Footer from '../components/Footer.jsx';
import Modal from '../components/Modal.jsx';
import FormularioLogin from '../components/FormularioLogin.jsx';
import FormularioCadastro from '../components/FormularioCadastro.jsx';

function LandingPage() {
    //controla a visibilidade do modal login
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    //controla a visibilidade do modal cadastro
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    // guarda o email digitado no form da seção inicio
    const [initialEmail, setInitialEmail] = useState('');

    //função que troca o modal login pelo de cadastro
    const switchToSignup = () => {
        setLoginModalOpen(false);
        setSignupModalOpen(true);
    };

    //função que troca o modal cadastro pelo de login
    const switchToLogin = () => {
        setSignupModalOpen(false);
        setLoginModalOpen(true);
    };

    //função para lidar com o envio do form do inicio
    const handleHeroSignup = (email) => {
        setInitialEmail(email); // guarda o email
        setSignupModalOpen(true); // abre o modal de cadastro
    };

    return (
        <>
            {/* recebe funções para abrir modais */}
            <Header
                onLoginClick={() => setLoginModalOpen(true)}
                onSignupClick={() => {
                    setInitialEmail(''); // limpa o email antes de abrir
                    setSignupModalOpen(true);
                }}
            />
            {/* recebe função para lidar com o form */}
            <Inicio onSignupClick={handleHeroSignup}/>
            <ComoFunciona />
            {/* tambem pode abrir o modal cadastro */}
            <CallToAction
                onSignupClick={() => {
                    setInitialEmail('');
                    setSignupModalOpen(true);
                }}
            />
            <SobreNos />
            <Footer />

            {/* modal de login: visibilidade controlada pelo estado loginModalOpen */}
            <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} size="small">
                <FormularioLogin
                    onSwitchToSignup={switchToSignup}
                    onSuccess={() => setLoginModalOpen(false)} // fecha o modal em caso de sucesso
                />
            </Modal>

            {/* modal de cadastro: visibilidade controlada pelo estado signupModalOpen */}
            <Modal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} size="large">
                <FormularioCadastro
                    onSwitchToLogin={switchToLogin}
                    initialEmail={initialEmail}
                    onSuccess={() => setSignupModalOpen(false)} // fecha o modal em caso de sucesso
                />
            </Modal>
        </>
    );
}

export default LandingPage;