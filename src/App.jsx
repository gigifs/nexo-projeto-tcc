import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota principal */}
        <Route path="/" element={<LandingPage />} />
        {/* no futuro, adicionaremos outras rotas aqui */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;