import { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import HeaderApp from '../components/headerApp';
import Menu from '../components/Menu';
import MeusInteresses from '../components/MeusInteresses';
import EditarInteressesModal from '../components/EditarInteressesModal';
import Modal from '../components/Modal';

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #e6ebf0;
    overflow: hidden;
`;

const CorpoDaPagina = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    padding: 40px 20px 0 40px;
    gap: 30px;
`;

const ColunaEsquerda = styled.aside`
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 360px;
    flex-shrink: 0;
`;

const ColunaDireita = styled.main`
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 20px 0 20px;
`;

function DashboardLayout() {
    const [interessesModalOpen, setInteressesModalOpen] = useState(false);

    return (
        <LayoutContainer>
            <HeaderApp />
            <CorpoDaPagina>
                <ColunaEsquerda>
                    <Menu />
                    <MeusInteresses
                        onEditClick={() => setInteressesModalOpen(true)}
                    />
                </ColunaEsquerda>
                <ColunaDireita>
                    {/* O <Outlet> é a "janela" onde o conteúdo das outras páginas irá aparecer. */}
                    <Outlet />
                </ColunaDireita>
            </CorpoDaPagina>

            <Modal
                isOpen={interessesModalOpen}
                onClose={() => setInteressesModalOpen(false)}
                size="hab-int"
            >
                <EditarInteressesModal
                    onSuccess={() => setInteressesModalOpen(false)}
                />
            </Modal>
        </LayoutContainer>
    );
}

export default DashboardLayout;
