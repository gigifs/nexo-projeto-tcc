import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function PerfilPage() {
    return (
        <HomeContainer>
            <DashboardHeader titulo={`Seu Perfil`}>
                É assim que você aparece para os outros colaboradores.
            </DashboardHeader>
        </HomeContainer>
    );
}
export default PerfilPage;
