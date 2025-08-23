import styled, { css } from 'styled-components';
import Botao from './Botao';

const HeaderContainer = styled.div`
    /* Estilos que se aplicam sempre */
    padding: 35px 40px 35px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    /* Estilos que SÓ se aplicam se a prop '$semFundo' NÃO for passada */
    ${(props) =>
        !props.$semFundo &&
        css`
            background-color: #f5fafc;
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        `}
`;

const HeaderText = styled.div``;

const Titulo = styled.h2`
    margin: 0;
    font-size: 32px;
    font-weight: 600;
    color: #000000;
`;

const Subtitulo = styled.p`
    margin: 8px 0 0;
    color: #000000;
    font-size: 24px;
    font-weight: 300;
`;

// O componente está mais flexível
function DashboardHeader({
    titulo,
    children,
    botaoTexto,
    onBotaoClick,
    semFundo,
}) {
    return (
        <HeaderContainer $semFundo={semFundo}>
            <HeaderText>
                <Titulo>{titulo}</Titulo>
                <Subtitulo>{children}</Subtitulo>
            </HeaderText>

            {/* O botão só é renderizado SE a prop 'botaoTexto' existir */}
            {botaoTexto && (
                <Botao variant="header" onClick={onBotaoClick}>
                    {botaoTexto}
                </Botao>
            )}
        </HeaderContainer>
    );
}

export default DashboardHeader;