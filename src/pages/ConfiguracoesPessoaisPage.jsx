import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import NavegacaoAbas from '../components/NavegacaoAbas';
import ConfigPerfil from '../components/ConfigPerfil';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;
`;

function ConfiguracoesPessoaisPage() {
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

            <ConfigPerfil />
        </HomeContainer>
    );
}
export default ConfiguracoesPessoaisPage;