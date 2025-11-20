import React from 'react';
import styled from 'styled-components';
import BuscarProjetos from '../components/BuscarProjetos';
import DashboardHeader from '../components/DashboardHeader';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';
import Modal from '../components/Modal';
import { useState } from 'react';
import Botao from '../components/Botao';
import { FiPlus } from 'react-icons/fi';

const PageContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

function BuscarProjetosPage() {
    const [isCriarProjetoModalOpen, setIsCriarProjetoModalOpen] =
        useState(false);

    return (
        <PageContainer>
            <DashboardHeader
                titulo="Buscar Projetos"
                botaoTexto="+ Criar Projeto"
                onBotaoClick={() => setIsCriarProjetoModalOpen(true)}
                semFundo
            >
                Explore e encontre o projeto perfeito para você!
            </DashboardHeader>
            <BuscarProjetos />
            <Modal
                isOpen={isCriarProjetoModalOpen}
                onClose={() => setIsCriarProjetoModalOpen(false)}
            >
                <FormularioCriarProjeto
                    onClose={() => setIsCriarProjetoModalOpen(false)}
                />
            </Modal>
        </PageContainer>
    );
}

export default BuscarProjetosPage;
