import styled, { css } from 'styled-components';


const BotaoEstilizado = styled.button`
  background-color: #7C2256; /* Fundo padrão */
  color: #F5FAFC; /* Texto branco */
  font-size: 21px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 2px solid transparent;
  font-family: inherit; /*fonte roboto */

  ${(props) => {
    switch (props.$variant) {

      case 'Modal':
        return css`
          background-color: #7C2256; 
          color: #F5FAFC;
          border-radius: 10px;
          padding: 8px 50px;
          font-size: 18px;
          font-weight: 400;

          &:hover {
          background-color: #661745ff;
          }
        `;

      case 'CadastrarMenuHamburguer':
        return css`
          font-size: 24px;
          padding: 10px 20px;
          background-color: #0A528A;
          color: #F5FAFC;;
          border-color: #F5FAFC;

          &:hover {
            background-color: #3f87a34b;
            color: #0A528A
          }
        `;

      case 'EntrarMenuHamburguer':
        return css`
          font-size: 24px;
          padding: 10px 20px;
          background-color: #3f87a34b;
          color: #0A528A;
          border-color: #F5FAFC;

          &:hover {
            background-color: #0A528A;
            color: #F5FAFC;
          }
        `;

      case 'ComeceAgora':
        return css`
          font-size: 30px;
          padding: 10px 20px;
          background-color: #F5FAFC1A;
          color: #F5FAFC;
          border-color: #F5FAFC;

          &:hover {
            background-color: rgba(255, 255, 255, 0.4);
          }

          @media (max-width: 768px) {
            font-size: 26px;
          }
        `;

      case 'CadastrarSecaoInicio':
        return css`
          background-color: #0A528A1A; 
          color: #0A528A; 
          border: 1px solid #0A528A;
          height: 45px;

          &:hover {
          background-color: #0A528A; 
          color: #F5FAFC;
          }
        `;
      case 'Cadastrar':
        return css`
          background-color: transparent; 
          color: #7C2256; 
          border-color: #7C2256; 

          &:hover {
          background-color: #7C2256; /* Fundo padrão */
          color: #F5FAFC; /* Texto branco */

          }
        `;
      case 'Entrar':
      default:
        // Estilos para o botão primário (e o padrão, caso nenhuma variant seja passada)
        return css`
          &:hover {
            background-color: #F5FAFC; /* Fundo padrão */
            color: #7C2256; /* Texto branco */
            border-color: #7C2256; 
          }
        `;
    }
  }}
`;

// A função tem as seguintes propriedas para que possa ser estilizada, aceitar conteúdo
// e o "...outrasProps" serve para manipuladores e atributos HTML
function Botao({ variant, children, ...outrasProps }) {
  // Aqui no caso ela vai coletar o manipulador/evento 'onClick'
  return (
    <BotaoEstilizado $variant={variant} {...outrasProps}>
      {children}
    </BotaoEstilizado>
  );
}


export default Botao;