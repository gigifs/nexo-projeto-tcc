import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import MyProjectCard from './MyProjectCard';

const ListWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /*cria duas colunas de tamanho = 1fr (uma fração do espaço disponível)*/
    gap: 30px;
    width: 100%;
`;

const MensagemFeedback = styled.p`
    font-size: 18px;
    color: #666;
    text-align: center;
    width: 100%;
    grid-column: 1 / -1;
`;

function ListaMeusProjetos() {
    const { currentUser } = useAuth();
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const projetosRef = collection(db, 'projetos');

        // Query para projetos onde o usuário é o dono
        const qOwned = query(
            projetosRef,
            where('donoId', '==', currentUser.uid)
        );

        // Query para projetos onde o usuário é participante
        const qMember = query(
            projetosRef,
            where('participantIds', 'array-contains', currentUser.uid)
        );

        // Função para combinar e remover duplicatas
        const combineProjects = (owned, member) => {
            const allProjects = new Map();
            owned.forEach(p => allProjects.set(p.id, p));
            member.forEach(p => allProjects.set(p.id, p));
            return Array.from(allProjects.values());
        };

        // Ouvinte para projetos do qual é dono
        const unsubscribeOwned = onSnapshot(qOwned, (snapshot) => {
            const ownedProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Atualiza o estado principal
            setProjetos(currentProjects => {
                const memberProjects = currentProjects.filter(p => p.donoId !== currentUser.uid);
                return combineProjects(ownedProjects, memberProjects);
            });
            
            setLoading(false);
        }, (err) => {
            console.error("Erro ao buscar projetos (dono):", err);
            setError('Não foi possível carregar seus projetos.');
            setLoading(false);
        });

        // Ouvinte para projetos do qual é membro
        const unsubscribeMember = onSnapshot(qMember, (snapshot) => {
            const memberProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setProjetos(currentProjects => {
                const ownedProjects = currentProjects.filter(p => p.donoId === currentUser.uid);
                return combineProjects(ownedProjects, memberProjects);
            });

            setLoading(false);
        }, (err) => {
            console.error("Erro ao buscar projetos (membro):", err);
            setError('Não foi possível carregar seus projetos.');
            setLoading(false);
        });

        // Retorna a função de limpeza para ambos os ouvintes
        return () => {
            unsubscribeOwned();
            unsubscribeMember();
        };
    }, [currentUser]);

    if (loading) return <MensagemFeedback>Carregando seus projetos...</MensagemFeedback>;
    
    if (error) return <MensagemFeedback>{error}</MensagemFeedback>;

    if (projetos.length === 0) {
        return <MensagemFeedback>Você ainda não criou ou participa de nenhum projeto.</MensagemFeedback>;
    }

    return (
        <ListWrapper>
            {projetos.map((projeto) => (
                <MyProjectCard
                    key={projeto.id}
                    projeto={projeto}
                    currentUserId={currentUser.uid}
                />
            ))}
        </ListWrapper>
    );
}

export default ListaMeusProjetos;