import styled, { css } from 'styled-components';
import logoQuadrada from '../assets/logoQuadrada.svg';
import { FiLinkedin } from 'react-icons/fi';
import { FiInstagram } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';

const FooterContainer = styled.footer`
    background-color: #383838;
    color: #f8f9fa;
    padding: 2.5rem 6.25rem 0.625rem 6.25rem;
    font-family: 'Roboto', 'Poppins';
`;

const FooterConteudo = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin-bottom: 2.5rem;
`;

const FooterColuna = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
    min-width: 2.5rem;
`;

const Logo = styled.img`
    width: 6.25rem;
`;

const Descricao = styled.p`
    font-size: 0.815rem;
    line-height: 1.6;
    color: #ffffff;
    max-width: 12.5rem;
    margin: 0;
`;

const TituloColuna = styled.h4`
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0 0 5px 0;
    color: #ffffff;
`;

const FooterLink = styled.a`
    color: #adb5bd;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.2s;

    &:hover {
        color: #ffffff;
    }
`;

const RedesSocias = styled.a`
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: #adb5bd;
    text-decorations: none;
    font-size: 1rem;
    transition: color 0.2s;

    &:hover {
        color: #ffffff;
    }
`;

const Divisoria = styled.hr`
    border: 0;
    border-top: 1px solid #adb5bd;
`;

const TextoCopyright = styled.p`
    text-align: center;
    font-size: 0.875rem;
    color: #ffffff;
    margin: 0;
`;

function Footer() {
    return (
        <FooterContainer id="contatos">
            <FooterConteudo>
                <FooterColuna>
                    <Logo src={logoQuadrada} alt="Logo Nexo" />
                    <Descricao>
                        Conectando estudantes com eficiência, promovendo
                        colaboração e aprendizado de qualidade.
                    </Descricao>
                </FooterColuna>

                <FooterColuna>
                    <TituloColuna>Navegação</TituloColuna>
                    <FooterLink href="#inicio">Início</FooterLink>
                    <FooterLink href="#como-funciona">Como Funciona</FooterLink>
                    <FooterLink href="#sobre-nos">Sobre nós</FooterLink>
                </FooterColuna>

                <FooterColuna>
                    <TituloColuna>Legal</TituloColuna>
                    <FooterLink href="#">Política de Pivacidade</FooterLink>
                    <FooterLink href="#">Termos de Uso</FooterLink>
                </FooterColuna>

                <FooterColuna>
                    <TituloColuna>Suporte/Contato</TituloColuna>
                    <FooterLink href="mailto:nexo.app.oficial@gmail.com">
                        Email: nexo.app.oficial@gmail.com
                    </FooterLink>
                </FooterColuna>

                <FooterColuna>
                    <TituloColuna>Redes Sociais</TituloColuna>
                    <RedesSocias
                        href="https://www.linkedin.com/in/nexo-oficial"
                        target="_blank"
                        rel="noonpener noreferrer"
                    >
                        <FiLinkedin size={20} /> LinkedIn
                    </RedesSocias>
                    <RedesSocias
                        href="https://www.instagram.com/nexo.app.ofc/"
                        target="_blank"
                        rel="noonpener noreferrer"
                    >
                        <FiInstagram size={20} /> Instagram
                    </RedesSocias>
                    <RedesSocias
                        href="https://x.com/Nexo165471"
                        target="_blank"
                        rel="noonpener noreferrer"
                    >
                        <FaXTwitter size={20} /> X
                    </RedesSocias>
                </FooterColuna>
            </FooterConteudo>

            <Divisoria />

            <TextoCopyright>
                © 2025 NEXO. Todos os direitos reservados.
            </TextoCopyright>
        </FooterContainer>
    );
}

export default Footer;
