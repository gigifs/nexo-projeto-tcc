import styled from "styled-components";
import Botao from "./Botao";

const Container = styled.div`
    padding: 10px;
    text-align: center;
`;

const Titulo = styled.h2`
    font-size: 32px;
    font-weight: 700;
    margin: 10px 0 15px 0;
`;

const Mensagem = styled.p`
    font-size: 18px;
    line-height: 1.4;
    color: #333;
    margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
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