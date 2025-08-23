import styled from 'styled-components';
import DashboardHeader from '../components/DashboardHeader';
import NavegacaoAbas from '../components/NavegacaoAbas';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
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

            {/* Conteúdo específico da aba "Informações Pessoais" virá aqui */}
            <div>
                <h2>Em breve: Formulário para editar nome, curso, etc.</h2>
            </div>
        </HomeContainer>
    );
}
export default ConfiguracoesPessoaisPage;
