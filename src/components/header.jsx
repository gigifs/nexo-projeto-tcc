import React, { useState } from 'react'; //importação completa
import styled, { css } from 'styled-components';
import Botao from './Botao.jsx';
import logoNexo from '../assets/logo.svg';
import { FiMenu, FiX } from 'react-icons/fi'; //importação dos ícones

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2.5rem;
    background-color: #f5fafc;
    box-shadow: 0 3px 6px rgba(124, 34, 86, 0.45);
    position: sticky;
    top: 0;
    z-index: 10;

    @media (max-width: 768px) {
        padding: 0.5rem 1.25rem;
    }
`;

const NavBotoes = styled.nav`
    display: flex;
    gap: 1rem; /* Cria um espaço entre os botões */

    @media (max-width: 768px) {
        display: none;
    }
`;

// Placeholder para o logo, só para ter algo no lugar
const Logo = styled.img`
    width: 10.5rem;
    z-index: 11;

    @media (max-width: 1024px) {
        width: 8rem;
    }

    @media (max-width: 768px) {
        width: 8.5rem;
    }
`;

//links do menu hamburguer :)
const NavLinks = styled.nav`
    display: flex;
    @media (max-width: 768px) {
        background-color: rgba(245, 250, 252, 0.98);
        backdrop-filter: blur(5px);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: ${(props) => (props.$menuAberto ? 'flex' : 'none')};
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

const ListaLinks = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0 0 0 6.25rem;
    display: flex;
    gap: 2.85rem;

    @media (max-width: 1200px) {
        gap: 1.4rem;
        margin: 0 0 0 4rem;
    }

    @media (max-width: 1024px) {
        gap: 2rem;
        margin: 0 0 0 1rem;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        margin: 0;
        gap: 2.5rem;
        text-align: center;
    }
`;

const LinkEstilizado = styled.a`
    text-decoration: none;
    color: #0a528a;
    font-weight: 400;
    font-size: 1.4rem;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #23328fff;
        font-weight: 500;
    }

    @media (max-width: 1200px) {
        font-size: 1.3rem;
    }

    @media (max-width: 1024px) {
        font-size: 1.2rem
    }

    @media (max-width: 768px) {
        font-size: 1.7rem;
    }
`;

const MenuHamburguer = styled.div`
    display: none;
    z-index: 11;

    @media (max-width: 768px) {
        display: block;
        cursor: pointer;
    }
`;

// Container para os botões que só aparecem no menu mobile
const NavBotoesMobile = styled.div`
    display: none; /* Escondido por padrão */

    @media (max-width: 768px) {
        display: flex;
        flex-direction: row;
        gap: 20px;
        margin-top: 80px;
    }
`;

function Header({ onLoginClick, onSignupClick }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <HeaderEstilizado>
            <Logo src={logoNexo} alt="Logo da empresa Nexo" />

            <NavLinks $menuAberto={menuAberto}>
                <ListaLinks>
                    <li>
                        <LinkEstilizado href="#inicio" onClick={toggleMenu}>
                            Início
                        </LinkEstilizado>
                    </li>
                    <li>
                        <LinkEstilizado
                            href="#como-funciona"
                            onClick={toggleMenu}
                        >
                            Como Funciona
                        </LinkEstilizado>
                    </li>
                    <li>
                        <LinkEstilizado href="#sobre-nos" onClick={toggleMenu}>
                            Sobre nós
                        </LinkEstilizado>
                    </li>
                    <li>
                        <LinkEstilizado href="#contatos" onClick={toggleMenu}>
                            Contatos
                        </LinkEstilizado>
                    </li>
                </ListaLinks>
                <NavBotoesMobile>
                    <Botao
                        variant="EntrarMenuHamburguer"
                        onClick={onLoginClick}
                    >
                        Entrar
                    </Botao>
                    <Botao
                        variant="CadastrarMenuHamburguer"
                        onClick={onSignupClick}
                    >
                        Cadastre-se
                    </Botao>
                </NavBotoesMobile>
            </NavLinks>
            <NavBotoes>
                {/* O evento de clique é conectado diretamente com
                    as funções que o header recebeu como propriedade */}
                <Botao variant="Entrar" onClick={onLoginClick}>
                    Entrar
                </Botao>
                <Botao variant="Cadastrar" onClick={onSignupClick}>
                    Cadastre-se
                </Botao>
            </NavBotoes>
            <MenuHamburguer onClick={toggleMenu}>
                {menuAberto ? (
                    <FiX size={30} color="#0A528A" />
                ) : (
                    <FiMenu size={30} color="#0A528A" />
                )}
            </MenuHamburguer>
        </HeaderEstilizado>
    );
}

export default Header;