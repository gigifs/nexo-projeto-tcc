import React from "react";
import styled, { keyframes } from "styled-components";
import logo from "../assets/logoQuadrada.svg";

// Animação de giro
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.35s ease-out;
`;

const Logo = styled.img`
  width: 90px;
  height: 90px;
  animation: ${spin} 1.8s linear infinite;
  opacity: 0.85;
`;

const LoadingText = styled.p`
  position: absolute;
  bottom: 3rem;
  font-size: 1.5rem;
  color: #313030ff;
  opacity: 0.8;
`;

export default function PageLoader() {
  return (
    <LoaderWrapper>
      <Logo src={logo} alt="Carregando..." />
      <LoadingText>Carregando...</LoadingText>
    </LoaderWrapper>
  );
}