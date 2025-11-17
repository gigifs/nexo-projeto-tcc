import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import NavegacaoAbas from '../components/NavegacaoAbas';
import ConfigPerfil from '../components/ConfigPerfil';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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

    const { userData } = useAuth();
    let subtitle = 'Aqui você edita suas informações pessoais e de segurança.';
    if (userData && (!userData.github || !userData.linkedin)) {
        subtitle +=
            ' Complete seu perfil adicionando seus links do GitHub e LinkedIn!';
    }

    return (
        <HomeContainer>
            <DashboardHeader titulo={`Configurações`}>
                {subtitle}
            </DashboardHeader>

            <NavegacaoAbas abas={abas} />

            <ConfigPerfil />
        </HomeContainer>
    );
}
export default ConfiguracoesPessoaisPage;