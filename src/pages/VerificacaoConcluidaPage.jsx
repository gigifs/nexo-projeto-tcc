import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';
import Botao from '../components/Botao';
import HeaderSemLogin from '../components/headerSemLogin';

const PaginaContainer = styled.div`
    background-color: #e6ebf0;
`;

const BoxCentral = styled.div`
    background-color: #f5fafc;
    padding: 60px 70px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    max-width: 700px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 58px;
    margin: 220px auto;
`;

const Titulo = styled.h1`
    font-size: 36px;
    font-weight: 700;
    color: #000000ff;
    margin: 0;
`;

const Paragrafo = styled.p`
    font-size: 28px;
    font-weight: 400;
    color: #000000ff;
    line-height: 1.2;
    margin: 0;
`;

function VerificacaoConcluidaPage() {
    const navigate = useNavigate();

    return (
        <PaginaContainer>
            <HeaderSemLogin />
            <BoxCentral>
                <Titulo>E-mail Verificado com Sucesso!</Titulo>
                <Paragrafo>
                    Parabéns! Sua conta no NEXO está agora ativa. Agora você já
                    pode fazer login para começar a criar e colaborar em
                    projetos académicos.
                </Paragrafo>
                <Botao variant="Verificacao" onClick={() => navigate('/')}>
                    Voltar para a Tela Inicial
                </Botao>
            </BoxCentral>
        </PaginaContainer>
    );
}

export default VerificacaoConcluidaPage;
