import React, { useState } from 'react';
import styled from 'styled-components';
import Botao from '../Botao';

const InputArea = styled.form`
    display: flex;
    padding: 20px;
    border-top: 1px solid #ddd;
    background-color: #e6ebf0;
    border-radius: 0 0 20px 0; /* Arredonda os cantos inferiores */

    @media (max-width: 1024px) {
        border-radius: 0 0 20px 20px;
        padding: 15px;
    }
`;

const InputMensagem = styled.input`
    flex-grow: 1;
    padding: 12px 20px;
    border: 1px solid #ccc;
    border-radius: 25px;
    outline: none;
    font-size: 16px;
    margin-right: 10px;
`;

function MensagemInput({ onEnviarMensagem, onTyping }) {
    const [novaMensagem, setNovaMensagem] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Chama a função que foi passada pelo pai
        onEnviarMensagem(novaMensagem);
        setNovaMensagem(''); // Limpa o input localmente
    };

    const handleInputChange = (e) => {
        const texto = e.target.value;
        setNovaMensagem(texto);
        // Avisa o pai se o usuário está digitando ou não
        onTyping(texto.length > 0);
    };

    return (
        <InputArea onSubmit={handleSubmit}>
            <InputMensagem
                type="text"
                placeholder="Digite sua mensagem..."
                value={novaMensagem}
                onChange={handleInputChange}
            />
            <Botao variant="enviar" type="submit">
                Enviar
            </Botao>
        </InputArea>
    );
}

export default MensagemInput;
