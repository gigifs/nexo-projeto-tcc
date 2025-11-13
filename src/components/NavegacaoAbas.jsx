// src/components/NavegacaoAbas.jsx
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const TabsContainer = styled.nav`
    width: 100%;
    background-color: #f5fafc;
    padding: 0 0.95rem;
    border-radius: 0.95rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    gap: 1.25rem;

    @media (max-width: 568px) {
        justify-content: flex-start; 
        overflow-x: auto; 
        padding: 0 0.5rem 0 0.5rem; 
        gap: 1.25rem; /* Garante que o gap volte ao normal no scroll */

        /* Esconde a barra de scroll visualmente */
        -ms-overflow-style: none; 
        scrollbar-width: none; 
        &::-webkit-scrollbar {
            display: none; 
        }
    }

    @media (min-width: 768px) {
            gap:5rem;
    }

    @media (min-width: 1400px) {
        gap: 10rem;
    }

    @media (min-width: 1600px) {
        justify-content: center;
        gap: 20rem;
    }

`;

const TabLink = styled(NavLink)`
    position: relative;
    padding: 0.875rem 1.6rem;
    font-size: 1.125rem;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    color: #555;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    border-radius: 0.6rem 0.6rem 0 0;
    border-bottom: 3px solid transparent;

    &:hover {
        color: #7c2256;
        background-color: #e6ebf0;
    }

    /* Style pra aba ativa */
    &.active {
        color: #7c2256;
        font-weight: 700;
        border-bottom-color: #7c2256;
        background-color: #e6ebf0;
    }

    @media (max-width: 992px) {
        padding: 0.75rem 1.125rem;
        font-size: 1.065rem;
    }

    @media (max-width: 768px) {
        padding: 0.625rem 0.95rem;
        font-size: 1rem;
    }

    @media (max-width: 568px) {
        font-size: 0.9rem;
    }
`;

function NavegacaoAbas({ abas }) {
    return (
        <TabsContainer>
            {abas.map((aba) => (
                // 'end' prop ensures the NavLink is only active for the exact path
                <TabLink key={aba.path} to={aba.path} end>
                    {aba.label}
                </TabLink>
            ))}
        </TabsContainer>
    );
}

export default NavegacaoAbas;