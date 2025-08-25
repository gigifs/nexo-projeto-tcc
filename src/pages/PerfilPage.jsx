import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader.jsx';
import QuadroPerfil from '../components/QuadroPerfil.jsx';

const PerfilContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

function PerfilPage() {
    return (
        <PerfilContainer>
            <DashboardHeader
                titulo="Seu Perfil"
                botaoTexto="Editar Perfil"
                onBotaoClick={() => alert('Função Editar Perfil a ser implementada!')}
            >
                É assim que você aparece para os outros colaboradores.
            </DashboardHeader>

            <QuadroPerfil />
        </PerfilContainer>
    );
}

export default PerfilPage;
