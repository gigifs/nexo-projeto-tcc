import { useState } from 'react';
import styled from 'styled-components';
import HeaderApp from '../components/headerApp.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import Modal from '../components/Modal.jsx';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto.jsx';
import MeusInteresses from '../components/MeusInteresses.jsx';
import EditarInteressesModal from '../components/EditarInteressesModal.jsx';
import Menu from '../components/Menu.jsx';

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #e6ebf0;
    overflow: hidden;
`;

const MainContent = styled.main`
    flex-grow: 1;
    overflow-y: auto;
    padding: 50px 40px;
`;

const LayoutDashboard = styled.div`
    display: flex;
    gap: 50px;
    align-items: flex-start;
`;

const ColunaEsquerda = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 360px;
    flex-shrink: 0; /* Impede que a coluna encolha */
`;

const ColunaDireita = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px; /* Espaço para futuros componentes */
    flex-grow: 1; /* Faz esta coluna ocupar todo o espaço restante */
`;

function DashboardPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [interessesModalOpen, setInteressesModalOpen] = useState(false);

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
                        <DashboardHeader
                            onCriarProjetoClick={() => setModalOpen(true)}
                        />
                        {/*Menu, cards ... */}
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

export default DashboardPage;
