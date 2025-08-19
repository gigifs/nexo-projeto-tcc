import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function MensagensPage() {
    return (
        <HomeContainer>
            <DashboardHeader titulo={`Mensagens`}>
                Conecte-se e organize suas conversas. Aqui, você encontra seus
                chats privados e em grupo.
            </DashboardHeader>
        </HomeContainer>
    );
}
export default MensagensPage;
