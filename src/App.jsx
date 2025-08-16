import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtetorRota from './components/ProtetorRota.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* rota principal */}
                <Route path="/" element={<LandingPage />} />
                {/* rota depois de logado */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtetorRota>
                            <DashboardPage />
                        </ProtetorRota>
                    }
                />
                {/* no futuro, adicionaremos outras rotas aqui */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
