import { useState } from 'react';
import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function BuscarProjetosPage() {
    // A lógica de modais que pertencem apenas a esta página (como o de Criar Projeto) fica aqui.
    const [isModalOpen, setModalOpen] = useState(false);

    const { userData } = useAuth();
    const nomeUsuario = userData?.nome || 'Usuário';

    return (
        <HomeContainer>
            <DashboardHeader
                titulo={`Buscar Projetos`}
                botaoTexto="+ Criar Projeto"
                onBotaoClick={() => setModalOpen(true)}
                semFundo={true}
            >
                Explore e encontre o projeto perfeito para você!
            </DashboardHeader>

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
export default BuscarProjetosPage;
