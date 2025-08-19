import styled from 'styled-components';
import Botao from './Botao';
import { useAuth } from '../contexts/AuthContext'; //Para pegar os dados do Firebase

const HeaderContainer = styled.div`
    background-color: #f5fafc;
    padding: 20px 30px 20px 30px;
    border-radius: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
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

// --->> ALTERAÇÃO AQUI <<---
// 1 -> O componente aceita 'titulo' e 'subtitulo'
function DashboardHeader({ onCriarProjetoClick, titulo, subtitulo }) {
    const { userData } = useAuth();
    const nomeUsuario = userData?.nome || 'Usuário';

    // -> Defini o texto padrão caso não tenha parametro
    const tituloExibido = titulo || `Bem-vindo(a), ${nomeUsuario}!`;
    const subtituloExibido =
        subtitulo || 'Descubra um mundo de possibilidades ao seu alcance.';

    return (
        <HeaderContainer>
            <HeaderText>
                <Titulo>{tituloExibido}</Titulo>
                <Subtitulo>{subtituloExibido}</Subtitulo>
            </HeaderText>
            <Botao variant="Modal" onClick={onCriarProjetoClick}>
                + Criar Projeto
            </Botao>
        </HeaderContainer>
    );
}

export default DashboardHeader;