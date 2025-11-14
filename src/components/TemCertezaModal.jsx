import styled from "styled-components";
import Botao from "./Botao";

const Container = styled.div`
    padding: 0.6rem;
    text-align: center;
`;

const Titulo = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    margin: 0.6rem 0 0.94rem 0;

    @media (max-width: 1400px) {
        font-size: 1.7rem;
    }
`;

const Mensagem = styled.p`
    font-size: 1.125rem;
    line-height: 1.4;
    color: #333;
    margin-bottom: 1.25rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 1.25rem;

    @media (max-width: 1400px) {
        gap: 1.5rem;
    }
`;

function TemCertezaModal ({
    titulo,
    mensagem,
    onConfirm,
    onClose,
    loading = false,
    textoConfirmar = 'Sim',
    textoCancelar = 'Não',
}) {
    return (
        <Container>
            <Titulo>{titulo}</Titulo>
            <Mensagem>{mensagem}</Mensagem>
            <ButtonGroup>
                <Botao
                    variant='sim'
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? 'Aguarde...' : textoConfirmar}
                </Botao>
                <Botao
                    variant='nao'
                    onClick={onClose}
                    disabled={loading}
                >
                    {textoCancelar}
                </Botao>
            </ButtonGroup>
        </Container>
    );
}

export default TemCertezaModal;