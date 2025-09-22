import { useState } from 'react';
import styled, { css } from 'styled-components';
import Botao from './Botao';
import logoQuadrada from '../assets/logoQuadrada.svg';
import detalhes from '../assets/detalhes.svg';

const DetalhesBackground = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
`;

const InicioEstilizado = styled.section`
    background-color: #f5fafc;
    position: relative;
    overflow: hidden;
    width: 100%;
    box-shadow: 0 2px 4px #d97ec8ff; /*tira??*/
`;

//nova const, por conta da responsividade
const ConteudoInicio = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 60px 40px;
    min-height: 80vh;
    max-width: 1700px;
    margin: 0 auto;
    box-sizing: border-box;
    gap: 40px;
    position: relative; /* Garante que o conteúdo fique sobre a imagem de fundo */
    z-index: 1;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        padding: 60px 20px;
        min-height: 60vh;
    }
`;

const ConteudoEsquerdo = styled.div`
    flex: 1;
    max-width: 700px;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        align-items: center;
        max-width: 100%;
    }
`;

const Titulo = styled.h1`
    font-size: 64px;
    font-weight: 800;
    color: #030214;
    margin-bottom: 2px;
    line-height: 1.2;

    @media (max-width: 768px) {
        font-size: 48px;
    }
`;

const Subtitulo = styled.p`
    font-size: 52px;
    font-weight: 500;
    color: #030214;
    margin-bottom: 60px;
    line-height: 1; /*checar*/

    @media (max-width: 768px) {
        font-size: 36px;
        margin-bottom: 40px;
    }
`;

const FormCadastro = styled.form`
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    max-width: 700px; /* Garante que não fique maior que o conteúdo esquerdo */

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        gap: 30px;
    }
`;

const InputEmail = styled.input`
    padding: 0 15px;
    font-size: 24px;
    border: 1px solid #0a528acc;
    border-radius: 50px;
    width: 100%;
    height: 60px;
    outline: none;
    box-sizing: border-box; /* Garante que o padding não aumente o tamanho total */

    &::placeholder {
        color: #0a528a;
    }

    &:focus {
        border-color: #0a528acc;
        box-shadow: 0 0 0 2px #0a528acc;
    }

    @media (max-width: 768px) {
        font-size: 20px;
        height: 45px;
    }
`;

const LogoInicio = styled.img`
    max-width: 500px;
    height: auto;
    user-select: none;

    @media (max-width: 768px) {
        display: none;
    }
`;

function Inicio({ onSignupClick }) {
    // o hook useState é para o react redesenhar na tela sempre que a variavel mudar
    const [email, setEmail] = useState('');

    const handleSubmit = (evento) => {
        evento.preventDefault();
        onSignupClick(email);
    };

    return (
        <InicioEstilizado id="inicio">
            <DetalhesBackground src={detalhes} alt="Detalhes de fundo" />

            <ConteudoInicio>
                <ConteudoEsquerdo>
                    <Titulo>Crie projetos incríveis com o NEXO</Titulo>
                    <Subtitulo>Conecte-se, colabore, conquiste.</Subtitulo>
                    <FormCadastro onSubmit={handleSubmit}>
                        <InputEmail
                            type="email"
                            placeholder="E-mail..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Botao variant="CadastrarSecaoInicio" type="submit">
                            Cadastrar
                        </Botao>
                    </FormCadastro>
                </ConteudoEsquerdo>

                <LogoInicio src={logoQuadrada} alt="Logo Nexo" />
            </ConteudoInicio>
        </InicioEstilizado>
    );
}

export default Inicio;
