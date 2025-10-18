// src/components/NavegacaoAbas.jsx
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const TabsContainer = styled.nav`
    width: 100%;
    background-color: #f5fafc;
    padding: 0 30px;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    gap: 40px; /* Espaço entre os botões */
`;

// Usamos styled(NavLink) para estilizar o componente NavLink do router
const TabLink = styled(NavLink)`
    position: relative;
    padding: 16px 225px;
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
    background: none;
    border: none;
    color: #000000ff; /* Cor padrão para inativo */
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;

    &:hover {
        color: #7c2256; /* Cor roxa no hover */
        font-weight: 500;
    }

    /* 3. Criamos a nossa linha customizada com o ::after */
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%; /* A linha terá 100% da largura do TabLink (incluindo o padding) */
        height: 3px; /* A espessura da linha */
        background-color: #7c2256;

        transform: scaleX(0); /* Começa "invisível" (encolhida) */
        transition: transform 0.3s ease;
    }

    /* 4. Quando o link estiver ativo, a linha aparece */
    &.active {
        color: #7c2256;
        font-weight: 500;

        &::after {
            transform: scaleX(1); /* A linha expande para 100% da sua largura */
        }
    }
`;

function NavegacaoAbas({ abas }) {
    return (
        <TabsContainer>
            {abas.map((aba) => (
                <TabLink key={aba.path} to={aba.path} end>
                    {aba.label}
                </TabLink>
            ))}
        </TabsContainer>
    );
}

export default NavegacaoAbas;
