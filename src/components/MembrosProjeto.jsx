import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUsers, FiUserX } from 'react-icons/fi';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const SecaoMembros = styled.div`
    background-color: #e6ebf0;
    padding: 5px;
    border-radius: 20px;
    max-height: 200px;
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

const MembroItem = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border-bottom: 1px solid #ccc;

    &:last-child {
        border-bottom: none;
    }
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const MembroInfo = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BotaoRemover = styled.button`
    background: none;
    border: none;
    color: #000000;
    cursor: pointer;
    padding: 5px;
`;

const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    return `${nome.charAt(0)}${
        sobrenome ? sobrenome.charAt(0) : ''
    }`.toUpperCase();
};

function MembrosProjeto({ projeto, currentUserId, onRemoverMembro }) {
    const { userData } = useAuth();
    const [membrosComCor, setMembrosComCor] = useState([]);

    // SEU CÓDIGO DE VOLTA: Este useEffect busca a cor atualizada dos participantes.
    useEffect(() => {
        const fetchMemberData = async () => {
            if (!projeto || !projeto.participantes) return;
            
            const promises = projeto.participantes.map(async (member) => {
                const userDocRef = doc(db, 'users', member.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    return {
                        ...member,
                        avatarColor: userDocSnap.data().avatarColor,
                    };
                }
                return member;
            });

            const membrosCompletos = await Promise.all(promises);
            setMembrosComCor(membrosCompletos);
        };

        fetchMemberData();
    }, [projeto]);

    // LÓGICA DA COR DO DONO: Garante que a sua cor como dono está sempre atualizada.
    const corDoDono = currentUserId === projeto.donoId 
        ? userData.avatarColor 
        : projeto.donoAvatarColor;

    return (
        <>
            <TituloSecao>
                <FiUsers size={22} /> Membros do Projeto
            </TituloSecao>
            <SecaoMembros>
                <MembroItem>
                    <Avatar $bgColor={corDoDono}>
                        {getInitials(projeto.donoNome, projeto.donoSobrenome)}
                    </Avatar>
                    <MembroInfo>
                        <span>
                            <strong>
                                {projeto.donoNome} {projeto.donoSobrenome}{' '}
                                (Dono)
                            </strong>
                        </span>
                    </MembroInfo>
                </MembroItem>
                {membrosComCor && // Usamos o estado 'membrosComCor' que o seu useEffect preenche
                    membrosComCor
                        .filter((p) => p.uid !== projeto.donoId)
                        .map((p) => (
                            <MembroItem key={p.uid}>
                                <Avatar $bgColor={p.avatarColor}>
                                    {getInitials(p.nome, p.sobrenome)}
                                </Avatar>
                                <MembroInfo>
                                    <span>
                                        {p.nome} {p.sobrenome}
                                    </span>
                                    {currentUserId === projeto.donoId && (
                                        <BotaoRemover
                                            onClick={() => onRemoverMembro(p)}
                                            title="Remover Membro"
                                        >
                                            <FiUserX size={18} />
                                        </BotaoRemover>
                                    )}
                                </MembroInfo>
                            </MembroItem>
                        ))}
            </SecaoMembros>
        </>
    );
}

export default MembrosProjeto;