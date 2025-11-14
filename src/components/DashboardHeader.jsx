import styled, { css } from 'styled-components';
import Botao from './Botao';

const HeaderContainer = styled.div`
    /* Estilos que se aplicam sempre */
    padding: 2.2rem 2.5rem 2.2rem 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    /* Estilos que SÓ se aplicam se a prop '$semFundo' NÃO for passada */
    ${(props) =>
        !props.$semFundo &&
        css`
            background-color: #f5fafc;
            border-radius: 1.25rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        `}

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.25rem;
        padding: 1.5rem;
        align-items: stretch;
    }
`;

const HeaderText = styled.div``;

const Titulo = styled.h2`
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: #000000;

    @media (max-width: 1400px) {
        font-size: 1.8rem;
    }

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Subtitulo = styled.p`
    margin: 0.5rem 0 0;
    color: #000000;
    font-size: 1.5rem;
    font-weight: 300;

    @media (max-width: 1400px) {
        font-size: 1.3rem;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
        font-weight: 500;
        color: #555;
    }
`;

const AcoesWrapper = styled.div`
    /* Em desktop, não faz nada */

    /* Em mobile, alinha corretamente */
    @media (max-width: 768px) {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
`;

// O componente está mais flexível
function DashboardHeader({
    titulo,
    children,
    botaoTexto,
    onBotaoClick,
    acoes,
    semFundo,
}) {
    return (
        <HeaderContainer $semFundo={semFundo}>
            <HeaderText>
                <Titulo>{titulo}</Titulo>
                <Subtitulo>{children}</Subtitulo>
            </HeaderText>

            {acoes ? (
                // Se a prop 'acoes' foi passada, renderiza ela
                <AcoesWrapper>{acoes}</AcoesWrapper>
            ) : botaoTexto ? (
                // Senão, se a prop 'botaoTexto' foi passada, renderiza o botão antigo
                <AcoesWrapper>
                    <Botao variant="header" onClick={onBotaoClick}>
                        {botaoTexto}
                    </Botao>
                </AcoesWrapper>
            ) : null}
        </HeaderContainer>
    );
}

export default DashboardHeader;