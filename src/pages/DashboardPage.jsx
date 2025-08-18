import { useState } from 'react';
import styled from 'styled-components';
import HeaderApp from '../components/headerApp.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import Modal from '../components/Modal.jsx';
import FormularioCriarProjeto from '../components/FormularioCriarProjeto.jsx';
import MeusInteresses from '../components/MeusInteresses.jsx';
import EditarInteressesModal from '../components/EditarInteressesModal.jsx';
import Menu from '../components/Menu.jsx';
import ProjectTabs from '../components/ProjectTabs.jsx'; //Retângulo de abas
import ProjectList from '../components/ProjectList.jsx'; //Lista de projetos
//Importei o card para visuzalização dos dados mocados
import ProjectCard from '../components/ProjectCard.jsx';

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

//Tirar essa const assim que os componentes do Anthony forem integrados
const MeusProjetosPlaceholder = styled.div`
    text-align: center;
    padding: 60px;
    color: #888;
    background-color: #f5fafc;
    border-radius: 20px;
    border: 2px dashed #ccc;
`;

//Dados Mocados para a visualização do Card
const mockProject = {
    id: '123',
    nome: 'Melhor site de aprendizado de estrutura de dados já visto',
    descricao: 'Site que te ensina estrutura de dados. É bom pq tem estrutura de dados I e estrutura de dados II, ambas são muito difíceis e de alta complexidade. Por isso esse site é muito bom!Site que te ensina estrutura de dados. É bom pq tem estrutura de dados I e estrutura de dados II, ambas são muito difíceis e de alta complexidade. Por isso esse site é muito bom!',
    dono: 'Giovana Celestino',
    status: 'Aberto para Candidaturas',
    curso: 'Design Gráfico',
    habilidades: ['Habilidade', 'Habilidade', 'Habilidade'],
    interesses: ['Interesse', 'Interesse'],
};

function DashboardPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [interessesModalOpen, setInteressesModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('recomendados'); //Estado para a aba ativa

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
                        
                        {/*Lógica das abas*/}
                        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        {activeTab === 'recomendados' ? (
                            <ProjectList />
                        ) : (
                            //Placeholder temporário!
                            <MeusProjetosPlaceholder>
                                <h3>Área de "Meus Projetos"</h3>
                                <p>Componente do Anthony.</p>
                            </MeusProjetosPlaceholder>
                        )}
                        {/*Card com dados mocados para visualização*/}
                        <div style={{ maxWidth: '450px' }}>
                            <ProjectCard projeto={mockProject} />
                        </div>

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