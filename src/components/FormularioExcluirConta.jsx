import { useState } from 'react';
import styled from 'styled-components';
import Botao from './Botao';

// ANTES: chamava-se ModalContainer. AGORA: é um container de conteúdo.
const FormContainer = styled.div`
    /* Os estilos aqui devem ser apenas para o conteúdo interno */
    padding: 20px;
    text-align: center;
    display: flex; /* Adicionado para centralizar melhor o conteúdo */
    flex-direction: column; /* Adicionado para alinhar verticalmente */
    justify-content: center; /* Adicionado para centralizar */
    height: 100%; /* Ocupa a altura do ModalBox */
`;

const Titulo = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin: 10px 0 15px 0;
`;

const Paragrafo = styled.p`
    font-size: 16px;
    line-height: 1.5;
    color: #3c3c3e;
    margin-bottom: 24px;
`;

const Input = styled.input`
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 24px;
    outline: none;
    &:focus {
        border-color: #c62828;
        box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.2);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
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

    // --- ETAPA 1: Confirmação inicial ---
    if (step === 1) {
        return (
            <FormContainer>
                <Titulo>Excluir Conta?</Titulo>
                <Paragrafo>
                    A exclusão da sua conta será permanente. Quando você excluir
                    sua conta do NEXO, seu perfil e projetos serão removidos
                    permanentemente.
                </Paragrafo>
                <ButtonGroup>
                    <Botao variant="cancelar" onClick={onClose}>
                        Cancelar
                    </Botao>
                    <Botao variant="excluir" onClick={() => setStep(2)}>
                        Continuar
                    </Botao>
                </ButtonGroup>
            </FormContainer>
        );
    }

    // --- ETAPA 2: Confirmação com senha ---
    if (step === 2) {
        return (
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <Titulo>Confirmar Exclusão</Titulo>
                    <Paragrafo>
                        Para sua segurança, digite sua senha para confirmar.
                    </Paragrafo>
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
                            variant="cancelar"
                            type="button"
                            onClick={() => setStep(1)}
                        >
                            Voltar
                        </Botao>
                        <Botao
                            variant="excluir"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'A excluir...'
                                : 'Excluir Permanentemente'}
                        </Botao>
                    </ButtonGroup>
                </form>
            </FormContainer>
        );
    }

    return null;
}

export default FormularioExcluirConta;
