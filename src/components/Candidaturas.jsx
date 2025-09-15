import styled from 'styled-components';
import Botao from './Botao';
import { FiUserCheck } from 'react-icons/fi';

const SecaoCandidaturas = styled.div`
    padding: 20px;
    background-color: #e6ebf0;
    border-radius: 10px;
    max-height: 300px;
    overflow: auto;
`;

const TituloSecao = styled.h3`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 600;
    color: #7c2256;
`;

const CandidaturaItem = styled.div`
    background-color: #f5fafc;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DetalhesBotao = styled(Botao)`
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 10px;
    background-color: #e6ebf0;
    color: #7c2256;
`;

function Candidaturas({ candidaturas, onVerPerfil }) {
    return (
        <>
            <TituloSecao>
                <FiUserCheck size={22} /> Candidaturas Pendentes
            </TituloSecao>
            <SecaoCandidaturas>
                {candidaturas.length > 0 ? (
                    candidaturas.map((c) => (
                        <CandidaturaItem key={c.id}>
                            <p>
                                <strong>
                                    {c.nome} {c.sobrenome}
                                </strong>{' '}
                                se candidatou para o seu projeto!
                            </p>
                            <DetalhesBotao
                                type="button"
                                onClick={() => onVerPerfil(c)}
                            >
                                Ver Perfil
                            </DetalhesBotao>
                        </CandidaturaItem>
                    ))
                ) : (
                    <p>Ainda não há candidaturas para este projeto.</p>
                )}
            </SecaoCandidaturas>
        </>
    );
}

export default Candidaturas;