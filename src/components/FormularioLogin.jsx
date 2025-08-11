import { useState } from 'react';
import styled from 'styled-components';
import Botao from './Botao.jsx';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase.js';

const FormularioContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0 60px 0 60px;
`;

const Titulo = styled.h2`
  font-size: 30px;
  font-weight: 700;
  margin: 30px 0 10px 0;
  text-align: center;
  color: #000000;
`;

const SubTitulo = styled.h3`
  font-size: 18px;
  font-weight: 300;
  color: #000000;
  margin-bottom: 25px;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 300;
  color: #140202ff;
  margin-bottom: 2px;
`;

const Input = styled.input`
  background-color: #F5FAFC;
  padding: 12px 15px;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  border: 1px solid #00000060;
  border-radius: 10px;
  outline: none;
  margin-bottom: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #999999; /* cor do placeholder!! */
    opacity: 1;

  &:focus {
    border-color: #5B82E9; 
    box-shadow: 0 0 0 3px #5b82e948;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 25px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Espaço entre o checkbox e o texto */
`;

const CheckboxEstilizado = styled.input`
  transform: scale(1.4);
  accent-color: #7C2256;
  cursor: pointer;
`;

const LembrarDeMim = styled.label`
  font-size: 14px;
  font-weight: 300;
  
`;

const LinkEsqueciSenha = styled.a`
  font-size: 14px;
  font-weight: 300;
  color: #7C2256;
  text-decoration: none;
  text-align: right;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
`;

const NaoTemConta = styled.p`
  text-align: center;
  font-size: 16px;
  color: #030214;
  margin-top: 20px;
  font-weight: 300;

  a {
    color: #7C2256;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const MensagemErro = styled.p`
  color: #D32F2F; /* vermelho para erros */
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  margin-top: 0; 
`;

function FormularioLogin({ onSwitchToSignup, onSuccess  }) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erroLogin, setErroLogin] = useState(''); // estado para erros de login

  const handleSubmit = async (evento) => {
    evento.preventDefault(); // Impede que a página recarregue ao enviar
    setErroLogin(''); // limpa erros antigos

    try {
      //tenta fazer o login
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await user.reload();

      //verificação importante: o email foi verificado?
      if (user.emailVerified) {
        //se sim, login bem sucedido
        alert(`Bem-vindo(a) de volta!`);
        onSuccess();
        //no futuro, redirecionaremos para a pagina principal
      } else {
        //se nao, impede o login e avisa
        setErroLogin("Você precisa verificar seu e-mail antes de fazer o login.");
        // botao de reenviar no futuro???
      }
    } catch (error) {
      //erros mais comuns traduzidos
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErroLogin("E-mail ou senha inválidos.");
      } else {
        setErroLogin("Ocorreu um erro ao tentar fazer o login.");
      }
    }
  };

  return (
    <FormularioContainer onSubmit={handleSubmit}>
      <Titulo>Bem-vindo(a)</Titulo>
      <SubTitulo>Faça login para acessar o sistema</SubTitulo>
      <InputGroup>
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          type="email"
          id="login-email"
          placeholder="seuemail@exemplo.com"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <Label htmlFor="login-senha">Senha</Label>
        <Input
          type="password"
          id="login-senha"
          placeholder="••••••••"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />
      </InputGroup>
      <OptionsContainer>
        <CheckboxGroup>
          <CheckboxEstilizado
            type="checkbox"
            id="lembrar-mim"
            checked={lembrar}
            onChange={(e) => setLembrar(e.target.checked)}
          />
          <LembrarDeMim htmlFor="lembrar-mim">Lembrar de mim</LembrarDeMim>
        </CheckboxGroup>
        <LinkEsqueciSenha href="#">Esqueceu a senha?</LinkEsqueciSenha>
      </OptionsContainer>

      {erroLogin && <MensagemErro>{erroLogin}</MensagemErro>}

      <ButtonContainer>
        <Botao variant="Modal" type="submit">Entrar</Botao>
      </ButtonContainer>

      <NaoTemConta>
        Não tem uma conta? <a onClick={onSwitchToSignup}>Cadastre-se</a>
      </NaoTemConta>
    </FormularioContainer>
  );
}

export default FormularioLogin;