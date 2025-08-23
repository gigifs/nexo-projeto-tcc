import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
    gap: 32px;
    margin: 220px auto;
`;

const Titulo = styled.h1`
    font-size: 36px;
    font-weight: 700;
    color: #000000ff;
    margin: 0;
`;

const Paragrafo = styled.p`
    font-size: 26px;
    font-weight: 400;
    color: #000000ff;
    line-height: 1.2;
    margin: 0;
`;

const AvisoSpam = styled.p`
    font-size: 26px;
    font-weight: 300;
    color: #000000ff;
    line-height: 1.2;
    margin: 0;
`;

function AguardandoVerificacaoPage() {
    const navigate = useNavigate();

    return (
        <PaginaContainer>
            <HeaderSemLogin />
            <BoxCentral>
                <Titulo>Quase lá! Verifique seu e-mail.</Titulo>
                <Paragrafo>
                    Enviámos um link de confirmação para o seu e-mail. Por
                    favor, aceda à sua caixa de entrada e clique no link para
                    ativar sua conta no NEXO.
                </Paragrafo>
                <AvisoSpam>
                    Não recebeu o e-mail? Confira nas pastas de spam e lixeira.
                </AvisoSpam>
                <Botao variant="Verificacao" onClick={() => navigate('/')}>
                    Voltar para Tela Inicial
                </Botao>
            </BoxCentral>
        </PaginaContainer>
    );
}

export default AguardandoVerificacaoPage;
