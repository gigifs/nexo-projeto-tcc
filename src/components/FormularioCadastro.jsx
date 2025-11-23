import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Botao from './Botao.jsx';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
} from 'firebase/auth';
import { auth, db } from '../firebase.js';
import { doc, setDoc } from 'firebase/firestore';

const FormularioContainer = styled.form`
    display: flex;
    flex-direction: column;
    padding: 0 70px 0 70px;
`;

const Titulo = styled.h2`
    font-size: 30px;
    font-weight: 700;
    margin: 30px 0 20px 0;
    text-align: center;
    color: #000000;
`;

const SubTitulo = styled.h3`
    font-size: 18px;
    font-weight: 300;
    color: #000000;
    margin-top: 0;
    margin-bottom: 25px;
    text-align: center;
`;

const ContainerNomes = styled.div`
    display: flex;
    gap: 20px;
    align-items: baseline;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    flex: 1;
`;

const Label = styled.label`
    font-size: 16px;
    font-weight: 300;
    color: #140202ff;
    margin-bottom: 2px;
`;

const Input = styled.input`
    width: 100%;
    background-color: #f5fafc;
    padding: 12px 15px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
    outline: none;
    margin-bottom: 15px;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;

    &::placeholder {
        color: #999999;
        opacity: 1;
    }

    &:focus {
        border-color: #5b82e9;
        box-shadow: 0 0 0 3px #5b81e948;
    }
`;

const TextoTermos = styled.p`
    font-size: 14px;
    font-weight: 300;
    color: #000000;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 20px;
    line-height: 1.2;

    a {
        color: #7c2256; /* Cor de destaque */
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    margin: auto;
`;

const JaTemConta = styled.p`
    text-align: center;
    font-size: 16px;
    color: #030214;
    margin-top: 20px;
    margin-bottom: 15px;
    font-weight: 300;

    a {
        color: #7c2256;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const MensagemErro = styled.p`
    color: #d32f2f; /* vermelho para erros */
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    margin-top: 0;
`;

//initialEmail é para permitir que o email seja previamente preenchido na tela inicial
function FormularioCadastro({ onSwitchToLogin, initialEmail, onSuccess }) {
    // o hook useState é para o react redesenhar na tela sempre que a variavel mudar
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState(initialEmail || '');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //aqui é a logica para receber o email de fora e exibir
    useEffect(() => {
        setEmail(initialEmail || '');
    }, [initialEmail]);

    //função mais importante, pra quando o usuario enviar formulario
    //async significa que a funçao vai fazer operaçõoes que podem demorar
    const handleSubmit = async (evento) => {
        evento.preventDefault(); //impede que o navegador recarregue a pagina
        setErro(''); // Limpa erros antigos antes de tentar de novo

        //validação de senha simples, pode aumentar
        if (senha !== confirmaSenha) {
            setErro('As senhas não coincidem!');
            return;
        }

        setLoading(true);
        //firebase a partir daqui
        try {
            // a função é o que pega o email e senha e tenta criar um usuario
            //usar o await para esperar a resposta do Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

            //Se o cadastro deu certo
            const user = userCredential.user;

            // aqui é a conexão com o firestore
            // estamos criando uma referencia para um local no banco de dados
            // db = banco de dados; users = uma coleção; user.uid = identificador unico
            await setDoc(doc(db, 'users', user.uid), {
                nome: nome,
                sobrenome: sobrenome,
                email: user.email, // salvar email pra facilitar identificação
            });

            const actionCodeSettings = {
                url: 'http://localhost:5173/verificacao-concluida', // define onde o usuario vai parar apos clicar no link de confirmação
            };

            // função para garantir que o usuario é real, envia um email automatico
            await sendEmailVerification(user, actionCodeSettings);

            // Desconectamos o utilizador para garantir que ele não fique logado
            await signOut(auth);

            // redirecionamos para a tela de espera
            navigate('/aguardando-verificacao');
        } catch (error) {
            //Se o Firebase retornou um erro
            console.error(
                'Erro ao cadastrar no Firebase:',
                error.code,
                error.message
            );

            //traduzindo os erros mais comuns do Firebase para o usuário
            if (error.code === 'auth/email-already-in-use') {
                setErro('Este e-mail já está em uso por outra conta.');
            } else if (error.code === 'auth/weak-password') {
                setErro('A senha é muito fraca. Use pelo menos 6 caracteres.');
            } else if (error.code === 'auth/invalid-email') {
                setErro('O formato do e-mail é inválido.');
            } else {
                setErro('Ocorreu um erro ao criar a conta. Tente novamente.');
            }
        } finally {
            // Este bloco será executado sempre, garantindo que o botão seja reativado.
            setLoading(false);
        }
    };

    return (
        <FormularioContainer onSubmit={handleSubmit}>
            <Titulo>Crie sua conta</Titulo>
            <SubTitulo>
                Para prosseguir com o cadastro, certifique-se de preencher todos
                os campos indicados.
            </SubTitulo>

            <ContainerNomes>
                <InputGroup>
                    <Label htmlFor="signup-nome">Nome:</Label>
                    <Input
                        type="text"
                        id="signup-nome"
                        placeholder="Nome"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="signup-sobrenome">Sobrenome:</Label>
                    <Input
                        type="text"
                        id="signup-sobrenome"
                        placeholder="Sobrenome"
                        required
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                    />
                </InputGroup>
            </ContainerNomes>

            <InputGroup style={{ flex: 'none' }}>
                {' '}
                {/* Evita que este InputGroup tente se esticar */}
                <Label htmlFor="signup-email">E-mail</Label>
                <Input
                    type="email"
                    id="signup-email"
                    placeholder="seuemail@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </InputGroup>

            <InputGroup style={{ flex: 'none' }}>
                <Label htmlFor="signup-senha">Senha</Label>
                <Input
                    type="password"
                    id="signup-senha"
                    placeholder="Digite a senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
            </InputGroup>

            <InputGroup style={{ flex: 'none' }}>
                <Label htmlFor="signup-confirma-senha">Confirmar Senha</Label>
                <Input
                    type="password"
                    id="signup-confirma-senha"
                    placeholder="Digite a senha novamente"
                    required
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                />
            </InputGroup>

            {erro && <MensagemErro>{erro}</MensagemErro>}

            <TextoTermos>
                Ao preencher o formulário acima você concorda com os nossos{' '}
                <br />
                <a 
                    href="/termos-de-uso" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Termos de uso
                </a> e nossa{' '}
                <a 
                    href="/politica-privacidade" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Política de Privacidade
                </a>
            </TextoTermos>

            <ButtonContainer>
                <Botao variant="Modal" type="submit" disabled={loading}>
                    {loading ? 'A registar...' : 'Cadastrar'}
                </Botao>
            </ButtonContainer>

            <JaTemConta>
                Já tem uma conta? <a onClick={onSwitchToLogin}>Entre</a>
            </JaTemConta>
        </FormularioContainer>
    );
}

export default FormularioCadastro;