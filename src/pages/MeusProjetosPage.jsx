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

function MeusProjetosPage() {
    // A lógica de modais que pertencem apenas a esta página (como o de Criar Projeto) fica aqui.
    const [isModalOpen, setModalOpen] = useState(false);

    const { userData } = useAuth();
    const nomeUsuario = userData?.nome || 'Usuário';

    return (
        <HomeContainer>
            <DashboardHeader
                titulo={`Meus Projetos`}
                botaoTexto="+ Criar Projeto"
                onBotaoClick={() => setModalOpen(true)}
            >
                Comece a criar ou continue o que já está em andamento!
            </DashboardHeader>

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
export default MeusProjetosPage;
