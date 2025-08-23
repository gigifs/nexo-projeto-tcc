import { useState } from 'react';
import styled from 'styled-components';
import Botao from './Botao';

const FormContainer = styled.div`
    padding: 20px 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
`;

const Titulo = styled.h2`
    font-size: 28px;
    font-weight: 600;
    margin: 0;
    margin-bottom: 16px;
`;

const Paragrafo = styled.p`
    font-size: 22px;
    font-weight: 400;
    line-height: 1.2;
    color: #000;
    margin-bottom: 10px;
    margin-top: 0;
`;

const Input = styled.input`
    width: 100%;
    background-color: #f5fafc;
    padding: 12px 15px;
    font-size: 20px;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
    outline: none;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
    box-sizing: border-box;

    &::placeholder {
        color: #999999;
        opacity: 1;
    }

    &:focus {
        border-color: #e95b5bff;
        box-shadow: 0 0 0 3px #e95b5b48;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 8px;
`;

const MensagemErro = styled.p`
    color: red;
    font-size: 14px;
    margin-top: -15px;
    margin-bottom: 15px;
    min-height: 20px;
`;

function FormularioExcluirConta({ onClose, onConfirmDelete, loading, error }) {
    const [step, setStep] = useState(1);
    const [senha, setSenha] = useState('');

    const handleSubmit = (evento) => {
        evento.preventDefault();
        onConfirmDelete(senha);
    };

    if (step === 1) {
        return (
            <FormContainer>
                <Titulo>Excluir Conta?</Titulo>
                <Paragrafo>A exclusão da sua conta será permanente.</Paragrafo>
                <Paragrafo>
                    Quando você excluir sua conta do NEXO, seu perfil e projetos
                    serão removidos permanentemente.
                </Paragrafo>
                <ButtonGroup>
                    <Botao variant="cancelar-excluir" onClick={onClose}>
                        Cancelar
                    </Botao>
                    <Botao variant="hab-int" onClick={() => setStep(2)}>
                        Continuar
                    </Botao>
                </ButtonGroup>
            </FormContainer>
        );
    }

    if (step === 2) {
        return (
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <Titulo>Excluir Conta</Titulo>
                    <Paragrafo>Digite sua senha para confirmar.</Paragrafo>
                    <Input
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoFocus
                        required
                    />
                    <MensagemErro>{error}</MensagemErro>
                    <ButtonGroup>
                        <Botao
                            variant="cancelar-excluir"
                            type="button"
                            onClick={() => setStep(1)}
                        >
                            Cancelar
                        </Botao>
                        <Botao
                            variant="excluir"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Excluindo...' : 'Excluir'}
                        </Botao>
                    </ButtonGroup>
                </form>
            </FormContainer>
        );
    }

    return null;
}

export default FormularioExcluirConta;
