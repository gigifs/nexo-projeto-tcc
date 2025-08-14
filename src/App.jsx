//import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import LandingPage from './pages/LandingPage.jsx';

//function App() {
//    return (
//        <BrowserRouter>
//            <Routes>
//                {/* rota principal */}
//                <Route path="/" element={<LandingPage />} />
//                {/* no futuro, adicionaremos outras rotas aqui */}
//            </Routes>
//        </BrowserRouter>
//    );
//}


//export default App;

// import { useState } from "react";
// import ModalCriarProjeto from "./components/ModalCriarProjeto";
// 
// function App() {
//   const [modalOpen, setModalOpen] = useState(false);
// 
//   return (
//     <div>
//       <button onClick={() => setModalOpen(true)}>Abrir Modal</button>
//       <ModalCriarProjeto isOpen={modalOpen} onClose={() => setModalOpen(false)} />
//     </div>
//   );
// }
// 
// export default App;

import ModalCriarProjeto from "./components/ModalCriarProjeto";

function App() {
  return (
    <div>
      <ModalCriarProjeto />
    </div>
  );
}

export default App;


