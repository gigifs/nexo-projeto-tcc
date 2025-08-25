import styled from 'styled-components';
import Botao from './Botao';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ModalWrapper = styled.div`
    padding: 10px 30px 20px 30px;
    color: #333;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 25px;
`;

const TituloProjeto = styled.h2`
    font-size:28px;
    font-weight: 700;
    color: #000;
    margin: 10px 0 5px 0;
    line-height: 1.2;
`;

const CriadoPor = styled.p`
    font-size: 16px;
    color: #000000;
    margin: 0;

    span {
        font-weight: 600;
        color: #7C2256;
    }
`;

const Secao = styled.div``;

const ConteudoSuperior = styled.div`
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
`;

const ColunaEsquerda = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ColunaDireita = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #E6EBF0;
    padding: 20px;
    border-radius: 10px;
    max-height: 250px;
    overflow-y: auto; /*Adiciona scroll se a descrição for mt grande*/
    padding-right: 10px;
`;

const SecaoTitulo = styled.h4`
    font-size: 18px;
    font-weight: 600;
    color: #000;
    margin: 0 0 10px 0;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Tag = styled.span`
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    background-color: ${(props) =>
        props.$tipo === 'habilidade'
            ? '#aed9f4'
            : props.$tipo === 'status'
              ? '#d3cce6'
              : props.$tipo === 'area'
                ? '#7C225666' 
                : '#ffcced'}; // Cor de fallback
    color: ${(props) =>
        props.$tipo === 'habilidade'
            ? '#0b5394'
            : props.$tipo === 'status'
              ? '#59447d'
              : props.$tipo === 'area'
                ? '#7C2256' 
                : '#9c27b0'};
`;
const IntegrantesLista = styled.div`
        display: flex;
        flex-direction: column;
        gap: 15px;
`;

const IntegranteItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Avatar = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #0a528a;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const NomeIntegrante = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #000000;
`;

const DescricaoContainer = styled.div`
    margin-bottom: 20px;
`;

const Descricao = styled.p`
    font-size: 16px;
    line-height: 1.5;
    text-align: justify;
    margin: 0;
    max-height: 150px;
    overflow-y: auto; /*Adiciona scroll se a descrição for mt grande*/
    padding-right: 10px;
`;

const Footer = styled.div`
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #eee;
`;

function VerDetalhesModal({ projeto, projetoId }) {
    // Hooks para controlar estado do formulário e autenticação
    const { currentUser, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    // Desestruturação dos dados do projeto para usar no JSX
    const {
        nome,
        donoNome,
        donoSobrenome,
        descricao,
        habilidades = [],
        interesses = [],
        area,
    } = projeto;

    // A lógica para o botão "Candidatar-se"
    const handleCandidatura = async () => {
        setLoading(true);
        setFeedback('');

        if (!currentUser || !userData) {
            setFeedback('Você precisa estar logado para se candidatar.');
            setLoading(false);
            return;
        }

        if (currentUser.uid === projeto.donoId) {
            setFeedback('Você não pode se candidatar ao seu próprio projeto.');
            setLoading(false);
            return;
        }

        try {
            const candidaturaRef = doc(db, 'projetos', projetoId, 'candidaturas', currentUser.uid);

            const candidaturaSnap = await getDoc(candidaturaRef);
            if (candidaturaSnap.exists()) {
                setFeedback('Você já se candidatou a este projeto.');
                setLoading(false);
                return;
            }

            await setDoc(candidaturaRef, {
                userId: currentUser.uid,
                nome: userData.nome,
                sobrenome: userData.sobrenome,
                status: 'pendente',
                dataCandidatura: new Date(),
            });

            setFeedback('Candidatura enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar candidatura:', error);
            setFeedback('Ocorreu um erro ao enviar sua candidatura. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper>
            <Header>
                <TituloProjeto>{nome}</TituloProjeto>
                <CriadoPor>
                    Criado por:{' '}
                    <span>
                        {donoNome} {donoSobrenome}
                    </span>
                </CriadoPor>
            </Header>

            <ConteudoSuperior>
                <ColunaEsquerda>
                    <Secao>
                        <SecaoTitulo>Status</SecaoTitulo>
                        <TagsContainer>
                            <Tag $tipo="status">{projeto.status || 'Não definido'}</Tag>
                        </TagsContainer>
                    </Secao>
                    <Secao>
                        <SecaoTitulo>Área</SecaoTitulo>
                        <TagsContainer>
                            {area && (
                                <Tag $tipo='area'>
                                    {area}
                                </Tag>
                            )}
                        </TagsContainer>
                    </Secao>
                    <Secao>
                        <SecaoTitulo>Habilidades Relevantes</SecaoTitulo>
                        <TagsContainer>
                            {habilidades.map((h) => (
                                <Tag key={h} $tipo="habilidade">
                                    {h}
                                </Tag>
                            ))}
                        </TagsContainer>
                    </Secao>
                </ColunaEsquerda>

                <ColunaDireita>
                    <Secao>
                        <SecaoTitulo>INTEGRANTES</SecaoTitulo>
                        <IntegrantesLista>
                            {/* Dono do projeto */}
                            <IntegranteItem>
                                <Avatar>{`${donoNome?.[0] || ''}${donoSobrenome?.[0] || ''}`.toUpperCase()}</Avatar>
                                <NomeIntegrante>
                                    {donoNome} {donoSobrenome} (Dono)
                                </NomeIntegrante>
                            </IntegranteItem>

                            {/* Mapeia e exibe outros participantes */}
                            {projeto.participantes?.map((p) => (
                                <IntegranteItem key={p.uid}>
                                    <Avatar>{`${p.nome?.[0] || ''}${p.sobrenome?.[0] || ''}`.toUpperCase()}</Avatar>
                                    <NomeIntegrante>
                                        {p.nome} {p.sobrenome}
                                    </NomeIntegrante>
                                </IntegranteItem>
                            ))}
                        </IntegrantesLista>
                    </Secao>
                </ColunaDireita>
            </ConteudoSuperior>

            <DescricaoContainer>
                <SecaoTitulo>Descrição do Projeto</SecaoTitulo>
                <Descricao>{descricao}</Descricao>
            </DescricaoContainer>

            <Footer>
                <Botao variant="hab-int" onClick={handleCandidatura} disabled={loading}>
                    {loading ? 'A enviar...' : 'Candidatar-se'}
                </Botao>
                {feedback && <p style={{ marginTop: '10px' }}>{feedback}</p>}
            </Footer>
        </ModalWrapper>
    );
}

export default VerDetalhesModal;