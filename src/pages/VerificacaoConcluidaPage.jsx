import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';
import Botao from '../components/Botao';
import HeaderSemLogin from '../components/headerApp';
import MyProjectCard from '../components/MyProjectCard';
import MyProjectsList from '../components/MyProjectList';
import Menu from '../components/Menu';

const PaginaContainer = styled.div`
    background-color: #e6ebf0;
`;

const BoxCentral = styled.div`
    background-color: #f5fafc;
    padding: 60px 70px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    max-width: 700px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 58px;
    margin: 220px auto;
`;

const Titulo = styled.h1`
    font-size: 36px;
    font-weight: 700;
    color: #000000ff;
    margin: 0;
`;

const Paragrafo = styled.p`
    font-size: 28px;
    font-weight: 400;
    color: #000000ff;
    line-height: 1.2;
    margin: 0;
`;

function VerificacaoConcluidaPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verificando');
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const actionCode = searchParams.get('oobCode');

            if (actionCode) {
                applyActionCode(auth, actionCode)
                    .then(() => {
                        setStatus('sucesso');
                    })
                    .catch((error) => {
                        console.error('Erro ao verificar e-mail:', error);
                        setStatus('erro');
                    });
            } else {
                setStatus('erro');
            }
        }
        // Isto garante que na segunda execução do Strict Mode, o nosso 'if' falhe.
        return () => {
            effectRan.current = true;
        };
    }, [searchParams]);

    const renderContent = () => {
        switch (status) {
            case 'sucesso':
                return (
                    <>
                        <Titulo>E-mail Verificado com Sucesso!</Titulo>
                        <Paragrafo>
                            Parabéns! Seu e-mail foi confirmado e sua conta no
                            NEXO está agora ativa. Agora você já pode fazer
                            login para começar a criar e colaborar em projetos
                            académicos.
                        </Paragrafo>
                        <Botao
                            variant="Verificacao"
                            onClick={() => navigate('/')}
                        >
                            Voltar para a Tela Inicial
                        </Botao>
                    </>
                );
            case 'erro':
                return (
                    <>
                        <Titulo>Ocorreu um Erro</Titulo>
                        <Paragrafo>
                            O link de verificação é inválido, já foi utilizado
                            ou expirou. Por favor, tente registar-se novamente.
                        </Paragrafo>
                        <Botao
                            variant="Verificacao"
                            onClick={() => navigate('/')}
                        >
                            Voltar para a Tela Inicial
                        </Botao>
                    </>
                );
            default:
                return <Paragrafo>A verificar o seu e-mail...</Paragrafo>;
        }
    };

    return (
        <PaginaContainer>
            <HeaderSemLogin />
            <BoxCentral>{renderContent()}</BoxCentral>
        </PaginaContainer>
    );
}

export default VerificacaoConcluidaPage;
