import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';
import { useAuth } from '../contexts/AuthContext';
import NavegacaoAbas from '../components/NavegacaoAbas';

// Styled Components para o conteúdo específico desta página
const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

// Este seria o componente que busca e exibe os cards de projetos recomendados
const ListaProjetosRecomendados = () => {
    return <h3>Conteúdo dos Projetos Recomendados...</h3>;
};

function DashboardPage() {
    // A lógica de modais que pertencem apenas a esta página (como o de Criar Projeto) fica aqui.
    const [isModalOpen, setModalOpen] = useState(false);

    const { userData } = useAuth();
    const nomeUsuario = userData?.nome || 'Usuário';

    // Define as abas que esta página irá mostrar
    const abasDaHome = [
        { label: 'Projetos Recomendados', path: '/dashboard' },
        { label: 'Meus Projetos', path: '/dashboard/meus-projetos' },
    ];

    return (
        <HomeContainer>
            <DashboardHeader
                titulo={`Bem-vindo(a), ${nomeUsuario}!`}
                botaoTexto="+ Criar Projeto"
                onBotaoClick={() => setModalOpen(true)}
            >
                Descubra um mundo de possibilidades ao seu alcance.
            </DashboardHeader>

            <NavegacaoAbas abas={abasDaHome} />

            {/* O conteúdo específico desta página (Home) é renderizado aqui */}
            <ListaProjetosRecomendados />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                size="large"
            >
                <FormularioCriarProjeto onClose={() => setModalOpen(false)} />
            </Modal>
        </HomeContainer>
    );
}

export default DashboardPage;