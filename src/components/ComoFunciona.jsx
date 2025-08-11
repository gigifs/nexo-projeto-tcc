import styled, { css } from 'styled-components';
import { FaUserPlus, FaSearch, FaUsers } from 'react-icons/fa'
import { BolinhasContainer, Bolinha } from './Bolinhas.jsx';

const SectionContainer = styled.section`
    padding-top: 20px;
    padding-bottom: 40px;
    text-align: center;
    background-color: #E6EBF0;
    scroll-margin-top: 80px;
`;

const Titulo = styled.h2`
    font-size: 56px;
    font-weight: 500;
    color: #000000;
    margin: 0 0 30px 0;

    @media(max-width: 768px){
        font-size: 40px;
    }
`;

const SubTitulo = styled.p`
    font-size: 28px;
    color: #000000;
    max-width: 1620px;
    margin: 0 auto 48px auto; /* Centraliza o parágrafo e adiciona margem embaixo */
    line-height: 1.2;
    padding: 0 10px 0 10px; /* Para não ficar colado nos cantos das telas */

    @media(max-width: 768px){
        font-size: 26px;
    }
`;

const CardsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 60px; /* Espaço entre os cards */

  @media (max-width: 768px) {
    flex-direction: column; 
    align-items: center; 
  }
`;

const Card = styled.div`
    background-color: #F5FAFC;
    border-radius: 30px;
    padding: 20px;
    max-width: 450px;
    text-align: left;
    transition: transform 0.3s;

    box-shadow: 0 6px 12px rgba(${(props) => props.shadowRgb || '0,0,0'}, 0.5);

    &:hover {
    transform: translateY(-5px); /* Efeito de "levantar" o card ao passar o mouse */
    box-shadow: 0 8px 14px rgba(${(props) => props.shadowRgb || '0,0,0'}, 0.7);
    }
`;

const IconContainer = styled.div`
    color: ${props => props.color || '#000000'};
    margin-bottom: 12px;
`;

const CardTitulo = styled.h3`
    font-size: 30px;
    font-weight: 700;
    color: #000000;
    margin: 0 0 12px 0;
`;

const CardTexto = styled.p`
    font-size: 24px;
    font-weight: 400;
    color: #000000;
    line-height: 1.0;
    margin: 0;
`;

function ComoFunciona(){
    return(
        <SectionContainer id="como-funciona">
            <Titulo>Como Funciona</Titulo>
            <SubTitulo>
                Nosso aplicativo foi desenvolvido para facilitar a criação e a busca de grupos para projetos acadêmicos.<br/>
                Após realizar o cadastro, o usuário pode criar um perfil com suas habilidades e interesses. Com base nessas informações, o app utiliza filtros e sugestões inteligentes para conectar estudantes com perfis compatíveis.<br/>
                É possível criar um projeto e candidatar-se a projetos já existentes. Além disso, a plataforma oferece recursos de chat interno.
            </SubTitulo>
            <CardsContainer>
                <Card $shadowRgb="215,87,180">
                    <IconContainer color='#D757B4'><FaUserPlus size={45}/></IconContainer>
                    <CardTitulo>Crie seu perfil</CardTitulo>
                    <CardTexto>Cadastre-se com seu email universitário, adicione suas habilidades e interesses para encontrar matches perfeitos.</CardTexto>
                </Card>
                <Card $shadowRgb="107,116,219">
                    <IconContainer color='#6B74DB'><FaSearch size={45} /></IconContainer>
                    <CardTitulo>Encontre projetos ou pessoas</CardTitulo>
                    <CardTexto>Busque por projetos que combinam com suas habilidades ou encontre colaboradores para seu próprio projeto.</CardTexto>
                </Card>
                <Card $shadowRgb="44,138,237">
                    <IconContainer color='#2C8AED'><FaUsers size={45} /></IconContainer>
                    <CardTitulo>Conecte-se e colabore</CardTitulo>
                    <CardTexto>Entre em contato, converse e comece a colaborar em projetos acadêmicos que fazem a diferença</CardTexto>
                </Card>
            </CardsContainer>

            <BolinhasContainer>
                <Bolinha color="rgba(215, 87, 180, 0.3)"/>
                <Bolinha color="rgba(91, 130, 233, 0.3)"/>
                <Bolinha color="rgba(35, 140, 215, 0.3)"/>
            </BolinhasContainer>
        </SectionContainer>
    )
}

export default ComoFunciona;