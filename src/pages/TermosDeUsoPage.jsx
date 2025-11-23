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

function TermosDeUsoPage() {
    return (
        <PageContainer>
            {/* Usando o Header simplificado */}
            <HeaderSemLogin />
            
            <MainContent>
                <Titulo>Termos de Uso do Nexo</Titulo>
                <Subtitulo>Estes termos regem a sua relação contratual com a plataforma Nexo e as regras de conduta.</Subtitulo>

                <Section>
                    <SectionTitle>1. O Serviço do Nexo</SectionTitle>
                    <Paragraph>
                        Concordamos em fornecer a você o Serviço do Nexo. O Serviço inclui todos os produtos, recursos, aplicações, serviços, tecnologias e software que fornecemos para promover a missão de conectar talentos a projetos inovadores e facilitar a colaboração académica e profissional.
                    </Paragraph>
                    <Paragraph>O Serviço é composto pelos seguintes aspetos:</Paragraph>
                    <List>
                        <ListItem><strong>Oportunidades de conexão:</strong> Recursos para criar projetos, encontrar colaboradores, enviar candidaturas e comunicar-se com outros utilizadores.</ListItem>
                        <ListItem><strong>Ambiente Seguro:</strong> Trabalhamos para garantir que a interação entre donos de projetos e candidatos seja respeitosa e segura.</ListItem>
                        <ListItem><strong>Sistemas de Recomendação:</strong> Ferramentas que sugerem projetos ou perfis relevantes.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>2. Condições de Acesso</SectionTitle>
                    <Paragraph>
                        Atualmente, o acesso ao Nexo é fornecido de forma gratuita para facilitar a conexão entre estudantes e criadores de projetos.
                    </Paragraph>
                    <List>
                        <ListItem><strong>Quem pode usar:</strong> O serviço é voltado para um público com maturidade académica e profissional. Você não deve ter sido proibido anteriormente de usar o nosso Serviço.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>3. Regras de Conduta e Proibições</SectionTitle>
                    <Paragraph>Para garantir um ambiente seguro, você compromete-se a:</Paragraph>
                    <List>
                        <ListItem><strong>Não se passar por outras pessoas:</strong> Fornecer informações atualizadas e precisas no seu perfil.</ListItem>
                        <ListItem><strong>Não usar para fins ilícitos:</strong> Não promover atividades ilegais, discriminatórias ou fraudulentas.</ListItem>
                        <ListItem><strong>Respeito na Comunidade:</strong> É proibido assediar, intimidar ou enviar spam para outros utilizadores através do chat ou comentários.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>4. Propriedade Intelectual e Licenças</SectionTitle>
                    <List>
                        <ListItem><strong>Licença de Conteúdo:</strong> Não reivindicamos a propriedade dos projetos que você carrega. No entanto, para exibir o seu projeto e recomendá-lo, você concede-nos uma licença não exclusiva, gratuita e válida mundialmente para hospedar, usar, distribuir, exibir e executar publicamente o seu conteúdo no Nexo.</ListItem>
                        <ListItem><strong>Término da Licença:</strong> Esta licença encerra-se quando o seu conteúdo é excluído dos nossos sistemas.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>5. Direitos da Plataforma e Moderação</SectionTitle>
                    <List>
                        <ListItem><strong>Nomes de utilizador:</strong> Se você selecionar um nome de utilizador ou de projeto que viole direitos de marca ou seja ofensivo, podemos alterá-lo ou removê-lo.</ListItem>
                        <ListItem><strong>Atualizações:</strong> Podemos atualizar o código e as funcionalidades da plataforma sem aviso prévio para melhorias ou correções de segurança.</ListItem>
                        <ListItem><strong>Remoção de Conteúdo:</strong> Podemos remover qualquer projeto ou mensagem se acreditarmos que viola estes Termos.</ListItem>
                        <ListItem><strong>Suspensão:</strong> Podemos suspender ou encerrar a sua conta se você criar risco legal para nós ou violar regras da comunidade.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>6. Natureza do Serviço e Resolução de Conflitos</SectionTitle>
                    <List>
                        <ListItem><strong>"Como está":</strong> O Serviço é fornecido "no estado em que se encontra". O Nexo é uma ferramenta de conexão e não garante o sucesso dos projetos ou a contratação efetiva dos candidatos.</ListItem>
                        <ListItem><strong>Feedback:</strong> Sugestões enviadas são bem-vindas, mas podemos usá-las sem obrigação de compensação financeira.</ListItem>
                        <ListItem><strong>Lei Aplicável:</strong> Se você residir no Brasil, as leis da República Federativa do Brasil regerão estes Termos.</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>7. Atualização destes Termos</SectionTitle>
                    <Paragraph>
                        Podemos alterar o Serviço e as políticas conforme o projeto evolui. Notificaremos você sobre alterações materiais. O uso contínuo implica aceitação dos novos termos.
                    </Paragraph>
                </Section>
            </MainContent>

            <Footer />
        </PageContainer>
    );
}

export default TermosDeUsoPage;
