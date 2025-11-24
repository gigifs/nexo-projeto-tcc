import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Botao from '../components/Botao';
import HeaderSemLogin from '../components/headerSemLogin';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.js';

const PaginaContainer = styled.div`
    background-color: #e6ebf0;
`;

const BoxCentral = styled.div`
    background-color: #f5fafc;
    padding: 40px 60px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    max-width: 700px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 220px auto;
`;

const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Titulo = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: #000000ff;
    margin-top: 10px;
    margin-bottom: 20px;
`;

const SubTitulo = styled.p`
    font-size: 22px;
    font-weight: 300;
    color: #000000ff;
    line-height: 1.2;
    margin-top: 0;
    margin-bottom: 30px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 100%;
    margin: 0;
`;

const Label = styled.label`
    font-size: 20px;
    font-weight: 400;
    color: #000000ff;
    margin-bottom: 4px;
`;

const Input = styled.input`
    background-color: #f5fafc;
    padding: 15px;
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
    outline: none;
    margin: 0;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;

    &::placeholder {
        color: #999999; /* cor do placeholder!! */
        opacity: 1;
    }

    &:focus {
        border-color: #5b82e9;
        box-shadow: 0 0 0 3px #5b82e948;
    }
`;

const LinkVoltar = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #000000b3;
    cursor: pointer;
    text-decoration: none;
    align-self: flex-start;

    &:hover {
        font-weight: 600;
        color: #000000ff;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    margin: auto;
    margin-top: 30px;
`;

const MensagemDica = styled.p`
    color: #000000cc;
    font-size: 18px;
    font-weight: 300;
    margin: 22px 0 0 0;
`;

function EsqueciSenhaPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('form'); // Controla qual tela mostramos
    const navigate = useNavigate();

    const handleSubmit = async (evento) => {
        evento.preventDefault();
        if (loading || !email) return;
        setLoading(true);

        try {
            const actionCodeSettings = {
                url: `${window.location.origin}/`, // Após redefinir a senha, o utilizador volta para a Landing Page
            };
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setView('success');
        } catch (error) {
            console.error('Erro ao enviar e-mail de redefinição:', error);
            setView('success'); // Por segurança, mostramos sucesso mesmo em caso de erro
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaginaContainer>
            <HeaderSemLogin />
            <BoxCentral>
                {view === 'form' ? (
                    <Formulario onSubmit={handleSubmit}>
                        <LinkVoltar onClick={() => navigate('/')}>
                            &lt; Voltar
                        </LinkVoltar>
                        <Titulo>Esqueceu a sua senha?</Titulo>
                        <SubTitulo>
                            Insira o e-mail que você utiliza aqui no Nexo e
                            receba um link para recuperar seu acesso a
                            plataforma.
                        </SubTitulo>
                        <InputGroup>
                            <Label htmlFor="reset-email">E-mail</Label>
                            <Input
                                type="email"
                                id="reset-email"
                                placeholder="seuemail@exemplo.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>
                        <ButtonContainer>
                            <Botao
                                variant="hab-int"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? 'A enviar...'
                                    : 'Enviar Link de Recuperação'}
                            </Botao>
                        </ButtonContainer>
                    </Formulario>
                ) : (
                    <>
                        <Titulo>Recuperação iniciada!</Titulo>
                        <SubTitulo>
                            Caso o e-mail informado seja encontrado, você
                            receberá um link para redefinição de senha.
                        </SubTitulo>
                        <Botao variant="hab-int" onClick={() => navigate('/')}>
                            Voltar para Tela Inicial
                        </Botao>
                    </>
                )}
                <MensagemDica>
                    Dica: Caso não encontre o email na sua caixa de entrada,
                    verifique a pasta de Spam!
                </MensagemDica>
            </BoxCentral>
        </PaginaContainer>
    );
}

export default EsqueciSenhaPage;
