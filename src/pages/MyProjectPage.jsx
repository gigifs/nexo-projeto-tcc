import { useState } from 'react';
import styled from 'styled-components';
import HeaderApp from '../components/headerApp';
import DashboardHeader from '../components/DashboardHeader';
import MyProjectList from '../components/MyProjectList';
import ProjectList from '../components/ProjectList';
import Modal from '../components/Modal';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';
import Menu from '../components/Menu';
import MeusInteresses from '../components/MeusInteresses';
import EditarInteressesModal from '../components/EditarInteressesModal';
import ProjectTabs from '../components/ProjectTabs';

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #e6ebf0;
`;

const MainContent = styled.main`
    flex-grow: 1;
    padding: 20px 40px;
`;

const LayoutDashboard = styled.div`
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 20px;
    width: 100%;
`;

const ColunaEsquerda = styled.aside`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ColunaDireita = styled.section`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

function MyProjectsPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [interessesModalOpen, setInteressesModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('meus-projetos');

    return (
        <PageLayout>
            <HeaderApp />
            <MainContent>
                <LayoutDashboard>
                    <ColunaEsquerda>
                        <Menu />
                        <MeusInteresses
                            onEditClick={() => setInteressesModalOpen(true)}
                        />
                    </ColunaEsquerda>

                    <ColunaDireita>
                        {/* -> Passa os textos personalizados para o cabeçalho, mudança realizada no DashboardHeader */}
                        <DashboardHeader
                            onCriarProjetoClick={() => setModalOpen(true)}
                            titulo="Meus Projetos"
                            subtitulo="Comece a criar ou continue o que já está em andamento!"
                        />
                        
                        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                        {activeTab === 'recomendados' ? (
                            <ProjectList /> 
                        ) : (
                            <MyProjectList />
                        )}
                    </ColunaDireita>
                </LayoutDashboard>
            </MainContent>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                size="large"
            >
                <FormularioCriarProjeto onClose={() => setModalOpen(false)} />
            </Modal>
            
            <Modal
                isOpen={interessesModalOpen}
                onClose={() => setInteressesModalOpen(false)}
                size="hab-int"
            >
                <EditarInteressesModal
                    onSuccess={() => setInteressesModalOpen(false)}
                />
            </Modal>
        </PageLayout>
    );
}

export default MyProjectsPage;