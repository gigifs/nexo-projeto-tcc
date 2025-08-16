import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import logoNexo from '../assets/logo.svg';


const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 40px;
    background-color: #f5fafc;
    box-shadow: 0 3px 6px rgba(124, 34, 86, 0.45);
    position: sticky;
    top: 0;
    z-index: 10;

    @media (max-width: 768px) {
        padding: 8px 20px;
    }
`;

const Logo = styled.img`
    width: 170px;
    z-index: 11;
    @media (max-width: 768px) {
        width: 140px;
    }
`;
function HeaderSemLogin(){
    return(
        <HeaderEstilizado>
            <Logo src={logoNexo} alt="Logo da empresa Nexo" />
        </HeaderEstilizado>
    )
}
export default HeaderSemLogin;