import styled from 'styled-components';
import HeaderApp from '../components/headerApp.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import Modal from '../components/Modal.jsx';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto.jsx';
import { useState } from 'react';

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #E6EBF0;
`;

const MainContent = styled.main`
    flex-grow: 1;
    padding: 30px;
    overflow-y: auto;
`;

function DashboardPage() {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <PageLayout>
            <HeaderApp/>
                <MainContent>
                    <DashboardHeader onCriarProjetoClick={() => setModalOpen(true)} />
                    {/*Menu, cards ... */}
                </MainContent>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                size='large'
            >
                <FormularioCriarProjeto onClose={() => setModalOpen(false)} />


            </Modal>
        </PageLayout>
    );
}

export default DashboardPage;
