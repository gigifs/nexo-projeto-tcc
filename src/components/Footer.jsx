import styled, { css } from 'styled-components';
import logoQuadrada from '../assets/logoQuadrada.svg';
import { FiLinkedin } from "react-icons/fi";
import { FiInstagram } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";

const FooterContainer = styled.footer`
    background-color: #383838;
    color: #f8f9fa;
    padding: 40px 100px 10px 100px;
    font-family: 'Roboto', 'Poppins';
`;

const FooterConteudo = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
`;

const FooterColuna = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-width: 200px;
`;

const Logo = styled.img`
    width: 100px;
`;

const Descricao = styled.p`
    font-size: 13px;
    line-height: 1.6;
    color: #FFFFFF;
    max-width: 200px;
    margin: 0;
`;

const TituloColuna = styled.h4`
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 5px 0;
    color: #ffffff;
`;

const FooterLink = styled.a`
    color: #adb5bd;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s;

    &:hover {
        color: #ffffff
    }
`;

const RedesSocias = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #adb5bd;
    text-decorations: none;
    font-size: 16px;
    transition: color 0.2s;

    &:hover {
        color: #ffffff
    }
`;

const Divisoria = styled.hr`
    border: 0;
    border-top: 1px solid #adb5bd;
`;

const TextoCopyright = styled.p`
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    margin: 0;
`;

function Footer() {
    return (
        <FooterContainer id='contatos'>
            <FooterConteudo>
                <FooterColuna>
                    <Logo src={logoQuadrada} alt='Logo Nexo'/>
                    <Descricao>
                        Conectando estudantes com eficiência, promovendo colaboração e aprendizado de qualidade.
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
                    <FooterLink href="mailto:nexo.org@hotmail.com">Email: nexo.org@hotmail.com</FooterLink>
                </FooterColuna>

                <FooterColuna>
                    <TituloColuna>Redes Sociais</TituloColuna>
                    <RedesSocias href="#" target="_blank" rel="noonpener noreferrer">
                        <FiLinkedin size={20}/> LinkedIn
                    </RedesSocias>
                    <RedesSocias href="#" target="_blank" rel="noonpener noreferrer">
                        <FiInstagram size={20}/> Instagram
                    </RedesSocias>
                    <RedesSocias href="#" target="_blank" rel="noonpener noreferrer">
                        <FiFacebook size={20}/> Facebook
                    </RedesSocias>
                </FooterColuna>
            </FooterConteudo>

            <Divisoria/>

            <TextoCopyright>
                © 2025 NEXO. Todos os direitos reservados.
            </TextoCopyright>
        </FooterContainer>

    );
}

export default Footer;