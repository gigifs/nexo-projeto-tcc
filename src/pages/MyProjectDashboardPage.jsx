import { useState } from 'react';
import styled from 'styled-components';

// Importação dos componentes
import Menu from '../components/Menu';
import MeusInteresses from '../components/MeusInteresses';
import ProjectTabs from '../components/ProjectTabs';
import HeaderApp from '../components/headerApp';
import DashboardHeader from '../components/DashboardHeader';
import MyProjectDashboardHeader from '../components/MyProjectDashboardHeade';
import ProjectList from '../components/ProjectList';
import MyProjectsList from '../components/MyProjectsList';
import Modal from '../components/Modal';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';
import EditarInteressesModal from '../components/EditarInteressesModal';

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const DashboardContainer = styled.div`
    display: flex;
    gap: 30px;
    padding: 30px;
    background-color: #e6ebf0; // Um fundo para a página inteira
    flex-grow: 1; /* Faz este container crescer para ocupar o espaço disponível */
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    max-width: 360px;
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
`;

function MyProjectDashboardPage() {
    const [activeTab, setActiveTab] = useState('recomendados');

    const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
    const [isEditInterestsModalOpen, setEditInterestsModalOpen] = useState(false);

    return (
        <PageWrapper>
            <HeaderApp />
            <DashboardContainer>
                <LeftColumn>
                    <Menu />
                    <MeusInteresses onEditClick={() => setEditInterestsModalOpen(true)} />
                </LeftColumn>

                <MainContent>
                    {activeTab === 'recomendados' ? (
                        <DashboardHeader onCriarProjetoClick={() => setCreateProjectModalOpen(true)} />
                    ) : (
                        <MyProjectDashboardHeader onCriarProjetoClick={() => setCreateProjectModalOpen(true)} />
                    )}
                    
                    <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                    {activeTab === 'recomendados' ? <ProjectList /> : <MyProjectsList />}
                </MainContent>
            </DashboardContainer>

            <Modal isOpen={isCreateProjectModalOpen} onClose={() => setCreateProjectModalOpen(false)}>
                <FormularioCriarProjeto onClose={() => setCreateProjectModalOpen(false)} />
            </Modal>

            <Modal isOpen={isEditInterestsModalOpen} onClose={() => setEditInterestsModalOpen(false)} size="hab-int">
                <EditarInteressesModal onSuccess={() => setEditInterestsModalOpen(false)} />
            </Modal>
        </PageWrapper>
    );
}

export default MyProjectDashboardPage;