import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import NavegacaoAbas from '../components/NavegacaoAbas';
import PrivacidadeSeguranca from '../components/PrivacidadeSeguranca';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function ConfiguracoesSegurancaPage() {
    const abas = [
        { label: 'Informações Pessoais', path: '/dashboard/configuracoes' },
        {
            label: 'Privacidade e Segurança',
            path: '/dashboard/configuracoes/seguranca',
        },
    ];

    return (
        <HomeContainer>
            <DashboardHeader titulo={`Configurações`}>
                Aqui você edita suas informações pessoais e de segurança.
            </DashboardHeader>

            <NavegacaoAbas abas={abas} />

            <PrivacidadeSeguranca />
        </HomeContainer>
    );
}
export default ConfiguracoesSegurancaPage;
