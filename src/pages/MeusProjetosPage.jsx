import { useState } from 'react';
import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import { Outlet } from 'react-router-dom';
import NavegacaoAbas from '../components/NavegacaoAbas';
import Modal from '../components/Modal';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

// Este seria o componente que busca e exibe os cards dos projetos do próprio utilizador
const ListaMeusProjetos = () => {
    return <h3>Conteúdo dos Meus Projetos...</h3>;
};

function MeusProjetosPage() {
    // A lógica de modais que pertencem apenas a esta página (como o de Criar Projeto) fica aqui.
    const [isModalOpen, setModalOpen] = useState(false);

    // As abas são as mesmas, para manter a consistência na navegação
    const abasDoMeusProjetos = [
        { label: 'Projetos Recomendados', path: '/dashboard' },
        { label: 'Meus Projetos', path: '/dashboard/meus-projetos' },
    ];

    return (
        <HomeContainer>
            <DashboardHeader
                titulo={`Meus Projetos`}
                botaoTexto="+ Criar Projeto"
                onBotaoClick={() => setModalOpen(true)}
            >
                Comece a criar ou continue o que já está em andamento!
            </DashboardHeader>

            <NavegacaoAbas abas={abasDoMeusProjetos} />

            {/* O conteúdo específico desta página (Meus Projetos) é renderizado aqui */}
            <ListaMeusProjetos />

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
