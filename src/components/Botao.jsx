import styled, { css } from 'styled-components';

const BotaoEstilizado = styled.button`
    background-color: #7c2256; /* Fundo padrão */
    color: #f5fafc; /* Texto branco */
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
            case 'enviar':
                return css`
                    background-color: #7c2256;
                    color: #f5fafc;
                    border-radius: 25px;
                    padding: 8px 16px;
                    font-size: 20px;
                    font-weight: 600;

                    &:hover {
                        background-color: #661745ff;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                    }
                `;
            case 'excluir':
                return css`
                    background-color: #f6171a33;
                    color: #f6171a;
                    border-radius: 10px;
                    padding: 8px 20px;
                    font-size: 22px;
                    font-weight: 500;

                    &:hover {
                        background-color: #f6171a88;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                    }
                `;

            case 'hab-int':
                return css`
                    background-color: #7c2256;
                    color: #f5fafc;
                    border-radius: 10px;
                    padding: 8px 16px;
                    font-size: 20px;
                    font-weight: 500;

                    &:hover {
                        background-color: #661745ff;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                    }
                `;
            case 'cancelar-excluir':
                return css`
                    background-color: #f5fafc;
                    color: #7c2256;
                    border-radius: 10px;
                    border: 1px solid #00000066;
                    padding: 8px 16px;
                    font-size: 20px;
                    font-weight: 500;

                    &:hover {
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                    }
                `;
            //Novo botão: para a janela modal 'FormularioCriarProjeto.jsx'
            case 'AdicionarHabilidade':
                return css`
                    background-color: #7c2256;
                    color: #f5fafc;
                    border-radius: 10px;
                    font-size: 20px;
                    font-weight: bold;

                    &:hover {
                        background-color: #661745ff;
                    }
                `;
            //Novo botão: para a janela modal 'FormularioCriarProjeto.jsx'
            case 'Cancelar':
                return css`
                    background-color: #f5fafc;
                    color: #000000ff;
                    border: 1px solid #00000067;
                    border-radius: 10px;
                    padding: 8px 50px;
                    font-size: 20px;
                    font-weight: 400;

                    &:hover {
                        background-color: #661745ff;
                        color: #f5fafc;
                    }
                `;

            case 'Modal':
                return css`
                    background-color: #7c2256;
                    color: #f5fafc;
                    border-radius: 10px;
                    padding: 8px 50px;
                    font-size: 18px;
                    font-weight: 400;

                    &:hover {
                        background-color: #661745ff;
                    }
                `;

            case 'header':
                return css`
                    border-radius: 10px;
                    padding: 8px 16px;
                    font-size: 24px;
                    font-weight: 500;

                    &:hover {
                        background-color: #661745ff;
                    }
                `;

            case 'CadastrarMenuHamburguer':
                return css`
                    font-size: 24px;
                    padding: 10px 20px;
                    background-color: #0a528a;
                    color: #f5fafc;
                    border-color: #f5fafc;

                    &:hover {
                        background-color: #3f87a34b;
                        color: #0a528a;
                    }
                `;

            case 'EntrarMenuHamburguer':
                return css`
                    font-size: 24px;
                    padding: 10px 20px;
                    background-color: #3f87a34b;
                    color: #0a528a;
                    border-color: #f5fafc;

                    &:hover {
                        background-color: #0a528a;
                        color: #f5fafc;
                    }
                `;

            case 'ComeceAgora':
                return css`
                    font-size: 30px;
                    padding: 10px 20px;
                    background-color: #f5fafc1a;
                    color: #f5fafc;
                    border-color: #f5fafc;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.4);
                    }

                    @media (max-width: 768px) {
                        font-size: 26px;
                    }
                `;

            case 'CadastrarSecaoInicio':
                return css`
                    background-color: #0a528a1a;
                    color: #0a528a;
                    border: 1px solid #0a528a;
                    height: 60px;

                    &:hover {
                        background-color: #0a528a;
                        color: #f5fafc;
                    }
                `;
            case 'Cadastrar':
                return css`
                    background-color: transparent;
                    color: #7c2256;
                    border-color: #7c2256;

                    &:hover {
                        background-color: #7c2256; /* Fundo padrão */
                        color: #f5fafc; /* Texto branco */
                    }
                `;
            case 'Verificacao':
                return css`
                    border-radius: 10px;
                    padding: 8px 16px;
                    font-size: 24px;
                    font-weight: 500;

                    &:hover {
                        background-color: #661745ff;
                    }
                `;
            case 'Entrar':
            default:
                // Estilos para o botão primário (e o padrão, caso nenhuma variant seja passada)
                return css`
                    &:hover {
                        background-color: #f5fafc; /* Fundo padrão */
                        color: #7c2256; /* Texto branco */
                        border-color: #7c2256;
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
