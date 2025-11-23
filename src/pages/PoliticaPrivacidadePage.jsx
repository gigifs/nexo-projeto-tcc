import styled from 'styled-components';
import HeaderSemLogin from '../components/headerSemLogin.jsx'; // Importando o novo header
import Footer from '../components/Footer.jsx';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: 'Roboto', 'Poppins', sans-serif;
    background-color: #ffffff;
`;

const MainContent = styled.main`
    flex: 1;
    padding: 40px 20px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
`;

const Titulo = styled.h1`
    font-size: 2.5rem;
    color: #7c2256;
    margin-bottom: 10px;
    font-weight: 700;
    text-align: center;
`;

const Subtitulo = styled.p`
    text-align: center;
    color: #666;
    margin-bottom: 50px;
    font-size: 0.9rem;
`;

const Section = styled.section`
    margin-bottom: 35px;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    color: #222;
    margin-bottom: 15px;
    font-weight: 600;
`;

const Paragraph = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: #444;
    margin-bottom: 10px;
    text-align: justify;
`;

const List = styled.ul`
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 15px;
`;

const ListItem = styled.li`
    margin-bottom: 8px;
    line-height: 1.6;
    color: #444;

    strong {
        color: #333;
        font-weight: 600;
    }
`;

function PoliticaPrivacidadePage() {
    return (
        <PageContainer>
            {/* Usando o Header simplificado */}
            <HeaderSemLogin />
            
            <MainContent>
                <Titulo>Política de Privacidade do Nexo</Titulo>
                <Subtitulo>Esta política explica como coletamos, usamos e gerenciamos as suas informações.</Subtitulo>

                <Section>
                    <SectionTitle>1. Informações que Coletamos</SectionTitle>
                    <Paragraph>
                        Para prestar o nosso serviço, coletamos as informações que você nos fornece voluntariamente, incluindo:
                    </Paragraph>
                    <List>
                        <ListItem>Dados pessoais (como nome).</ListItem>
                        <ListItem>Informações académicas (curso e competências).</ListItem>
                        <ListItem>Interesses que você cadastrou explicitamente.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>2. Como Usamos as Suas Informações</SectionTitle>
                    <Paragraph>Utilizamos os seus dados para personalizar a sua experiência na plataforma:</Paragraph>
                    <List>
                        <ListItem><strong>Personalização:</strong> Usamos o seu perfil para adaptar o conteúdo exibido.</ListItem>
                        <ListItem><strong>Sistemas de Recomendação:</strong> Os nossos sistemas utilizam os interesses selecionados e as suas interações diretas (como candidaturas enviadas) para entender quais projetos ou perfis são relevantes para si.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>3. O que NÃO fazemos</SectionTitle>
                    <List>
                        <ListItem><strong>Rastreamento:</strong> Não rastreamos o seu histórico de navegação externo à plataforma. A recomendação baseia-se estritamente nos dados internos (interesses e interações no Nexo).</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>4. Controle, Exclusão e Retenção de Dados</SectionTitle>
                    <Paragraph>
                        Você possui controle sobre as suas informações através das configurações de Privacidade e Segurança.
                    </Paragraph>
                    <List>
                        <ListItem><strong>Exclusão de Conta:</strong> Se você desejar excluir a sua conta permanentemente, poderá fazê-lo através das configurações de perfil.</ListItem>
                        <ListItem><strong>Retenção:</strong> O conteúdo deixa de ser visível imediatamente após a exclusão. No entanto, cópias de segurança (backups) podem ser mantidas por um período limitado estritamente por questões técnicas de segurança e integridade do sistema.</ListItem>
                    </List>
                </Section>
            </MainContent>

            <Footer />
        </PageContainer>
    );
}

export default PoliticaPrivacidadePage;
