import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function ConfiguracoesPage() {
    return (
        <HomeContainer>
            <DashboardHeader titulo={`Configurações`}>
                Aqui você edita suas informações pessoais e de segurança.
            </DashboardHeader>
            <div>
                <h2>
                    Abas de Navegação (Informações Pessoais / Privacidade e
                    Segurança)
                </h2>
            </div>
        </HomeContainer>
    );
}
export default ConfiguracoesPage;
