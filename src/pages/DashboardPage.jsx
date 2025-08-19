import { useState } from 'react';
import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';

// Styled Components para o conteúdo específico desta página
const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

function HomeDashboardPage() {
    // A lógica de modais que pertencem apenas a esta página (como o de Criar Projeto) fica aqui.
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <HomeContainer>
            <DashboardHeader onCriarProjetoClick={() => setModalOpen(true)} />

            {/* Aqui entrarão as abas e os cards de projetos da Home */}
            <div>
                <h2>
                    Abas de Navegação (Projetos Recomendados / Meus Projetos)
                </h2>
                {/* O conteúdo dos cards virá aqui */}
            </div>

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

export default HomeDashboardPage;
