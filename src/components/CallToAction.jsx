import styled from 'styled-components';
import Botao from './Botao.jsx';

const CtaContainer = styled.section`
    padding: 40px;
    text-align: center;
    color: #f5fafc;

    background: linear-gradient(
        90deg,
        #2c8aede6 0%,
        #6b74dbe6 50%,
        #d757b4e6 100%
    );

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px; /* Espaço entre título, subtítulo e botão */
`;

const Titulo = styled.h2`
    font-size: 32px;
    font-weight: 600;
    max-width: 1400px;
    line-height: 1.2;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 30px;
    }
`;

const Subtitulo = styled.p`
    font-size: 28px;
    font-weight: 400;
    max-width: 1270px;
    line-height: 1.2;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 26px;
    }
`;

function CallToAction({ onSignupClick }) {
    return (
        <CtaContainer>
            <Titulo>
                Conecte-se, colabore, conquiste. Sua jornada acadêmica fica mais
                forte com a comunidade Nexo
            </Titulo>
            <Subtitulo>
                Faça parte da nossa crescente comunidade.
                <br />
                Descubra como milhares de alunos estão transformando ideias em
                realidade através da colaboração
            </Subtitulo>
            <Botao variant="ComeceAgora" onClick={onSignupClick}>
                Comece Agora
            </Botao>
        </CtaContainer>
    );
}

export default CallToAction;
