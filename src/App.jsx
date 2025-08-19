import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MyProjectsPage from './pages/MyProjectPage.jsx';
import ProtetorRota from './components/ProtetorRota.jsx';
import AguardandoVerificacaoPage from './pages/AguardandoVerificacaoPage.jsx';
import VerificacaoConcluidaPage from './pages/VerificacaoConcluidaPage.jsx';


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

                {/* rota depois de logado */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtetorRota>

                            <MyProjectsPage/>
                        </ProtetorRota>
                    }
                />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;