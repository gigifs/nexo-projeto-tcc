import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUsers, FiUserX } from 'react-icons/fi';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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
    const [membrosComCor, setMembrosComCor] = useState([]);

    useEffect(() => {
        const fetchMemberData = async () => {
            if (!projeto || !projeto.donoId) return;

            // Junta o dono e os participantes em uma lista para buscar as informações
            const todosOsMembrosInfo = [
                {
                    uid: projeto.donoId,
                    nome: projeto.donoNome,
                    sobrenome: projeto.donoSobrenome,
                },
                ...(projeto.participantes || []),
            ];

            // Remove duplicatas para evitar buscas desnecessárias
            const uniqueMembers = [
                ...new Map(
                    todosOsMembrosInfo.map((m) => [m.uid, m])
                ).values(),
            ];

            // Busca os dados de cada usuário no banco (incluindo a cor)
            const promises = uniqueMembers.map(async (member) => {
                const userDocRef = doc(db, 'users', member.uid);
                const userDocSnap = await getDoc(userDocRef);
                const isDono = member.uid === projeto.donoId;

                if (userDocSnap.exists()) {
                    return {
                        ...member,
                        isDono,
                        avatarColor: userDocSnap.data().avatarColor,
                    };
                }
                return { ...member, isDono };
            });

            const membrosCompletos = await Promise.all(promises);
            setMembrosComCor(membrosCompletos);
        };

        fetchMemberData();
    }, [projeto]);

    return (
        <>
            <TituloSecao>
                <FiUsers size={22} /> Membros do Projeto
            </TituloSecao>
            <SecaoMembros>
                {membrosComCor.map((membro) => (
                    <MembroItem key={membro.uid}>
                        <Avatar $bgColor={membro.avatarColor}>
                            {getInitials(membro.nome, membro.sobrenome)}
                        </Avatar>
                        <MembroInfo>
                            <span>
                                <strong>
                                    {membro.nome} {membro.sobrenome}
                                    {membro.isDono && ' (Dono)'}
                                </strong>
                            </span>
                            {currentUserId === projeto.donoId &&
                                !membro.isDono && (
                                    <BotaoRemover
                                        onClick={() => onRemoverMembro(membro)}
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