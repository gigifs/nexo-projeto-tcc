import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProtetorRota from './components/ProtetorRota';
import { AuthProvider } from './contexts/AuthContext';
import MyProjectDashboardPage from './pages/MyProjectDashboardPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Rota pública para a página inicial */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Rota protegida para o dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtetorRota>
                                <MyProjectDashboardPage />
                            </ProtetorRota>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;