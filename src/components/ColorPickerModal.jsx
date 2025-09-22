import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Botao from './Botao'; // Assumindo que você tem um Botao

const ColorPickerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    max-width: 300px;
    margin: auto;
    text-align: center;
`;

const StyledInputColor = styled.input`
    width: 100%;
    height: 60px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    -webkit-appearance: none; /* Para customizar em navegadores WebKit */
    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    &::-webkit-color-swatch {
        border: 1px solid #ccc;
        border-radius: 5px;
    }
`;

function ColorPickerModal({ currentColor, onSelectColor, onClose }) {
    const [selectedColor, setSelectedColor] = useState(currentColor);

    useEffect(() => {
        setSelectedColor(currentColor);
    }, [currentColor]);

    const handleSave = () => {
        onSelectColor(selectedColor);
    };

    return (
        <ColorPickerContainer>
            <h3>Escolha a cor do seu Avatar</h3>
            <StyledInputColor
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Botao variant="Cancelar" onClick={onClose}>
                    Cancelar
                </Botao>
                <Botao variant="Modal" onClick={handleSave}>
                    Confirmar
                </Botao>
            </div>
        </ColorPickerContainer>
    );
}

export default ColorPickerModal;