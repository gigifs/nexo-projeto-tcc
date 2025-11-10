import styled from 'styled-components';
import Botao from './Botao.jsx';

const CtaContainer = styled.section`
    padding: 2.5rem;
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
    gap: 1.5rem; /* Espaço entre título, subtítulo e botão */
`;

const Titulo = styled.h2`
    font-size: 2rem;
    font-weight: 600;
    max-width: 87.5rem;
    line-height: 1.2;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 1.875rem;
    }
`;

const Subtitulo = styled.p`
    font-size: 1.75rem;
    font-weight: 400;
    max-width: 79.4rem;
    line-height: 1.2;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 1.6rem;
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