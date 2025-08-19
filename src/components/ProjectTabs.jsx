import styled from 'styled-components';

const TabsContainer = styled.div`
    display: flex;
    gap: 150px;
    background-color: #F5FAFC;
    border-radius: 20px;
    border-bottom: 2px solid #ccc;
    justify-content: center;
    width: 100%;
`;

const TabButton = styled.button`
    padding: 10px 20px;
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    color: ${props => (props.$ativo ? '#7C2256' : '#666')};
    border-bottom: 3px solid ${props => (props.$ativo ? '#7C2256' : 'transparent')};
    transition: all 0.2s ease-in-out;

    &:hover {
        color: #7C2256;
    }
`;

function ProjectTabs({ activeTab, setActiveTab }) {
    return (
        <TabsContainer>
            <TabButton 
                $ativo={activeTab === 'recomendados'} 
                onClick={() => setActiveTab('recomendados')}
            >
                Projetos Recomendados
            </TabButton>
            <TabButton 
                $ativo={activeTab === 'meus-projetos'} 
                onClick={() => setActiveTab('meus-projetos')}
            >
                Meus Projetos
            </TabButton>
        </TabsContainer>
    );
}

export default ProjectTabs;