import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtetorRota from './components/ProtetorRota.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AguardandoVerificacaoPage from './pages/AguardandoVerificacaoPage.jsx';
import VerificacaoConcluidaPage from './pages/VerificacaoConcluidaPage.jsx';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage.jsx';
import BuscarProjetosPage from './pages/BuscarProjetosPage';
import MeusProjetosPage from './pages/MeusProjetosPage.jsx';
import MensagensPage from './pages/MensagensPage.jsx';
import ConfiguracoesPessoaisPage from './pages/ConfiguracoesPessoaisPage.jsx';
import ConfiguracoesSegurancaPage from './pages/ConfiguracoesSegurancaPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import EsqueciSenhaPage from './pages/EsqueciSenhaPage.jsx';
import GerenciarProjetoPage from './pages/GerenciarProjetoPage.jsx';
import MinhasCandidaturasPage from './pages/MinhasCandidaturasPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* rota principal */}
                <Route path="/" element={<LandingPage />} />

                <Route
                    path="/aguardando-verificacao"
                    element={<AguardandoVerificacaoPage />}
                />
                <Route
                    path="/verificacao-concluida"
                    element={<VerificacaoConcluidaPage />}
                />
                <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtetorRota>
                            <DashboardLayout />
                        </ProtetorRota>
                    }
                >
                    {/* As rotas filhas são renderizadas dentro do <Outlet> */}
                    <Route index element={<DashboardPage />} />
                    <Route
                        path="buscar-projetos"
                        element={<BuscarProjetosPage />}
                    />
                    <Route
                        path="meus-projetos"
                        element={<MeusProjetosPage />}
                    />
                    <Route
                        path="meus-projetos/:id/gerenciar"
                        element={<GerenciarProjetoPage />}
                    />
                    <Route path="mensagens" element={<MensagensPage />} />
                    <Route
                        path="configuracoes"
                        element={<ConfiguracoesPessoaisPage />}
                    />
                    <Route
                        path="configuracoes/seguranca"
                        element={<ConfiguracoesSegurancaPage />}
                    />
                    <Route path="perfil" element={<PerfilPage />} />
                    <Route
                        path="minhas-candidaturas"
                        element={<MinhasCandidaturasPage />}
                    />
                </Route>
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default App;
