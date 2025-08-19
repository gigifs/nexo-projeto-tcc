import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import MyProjectCard from './MyProjectCard';

const ListWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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

function MyProjectsList() {
    const { currentUser } = useAuth();
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const projetosRef = collection(db, 'projetos');

                const qOwned = query(
                    projetosRef,
                    where('donoId', '==', currentUser.uid)
                );

                const qMember = query(
                    projetosRef,
                    where('participantIds', 'array-contains', currentUser.uid)
                );

                const [ownedSnapshot, memberSnapshot] = await Promise.all([
                    getDocs(qOwned),
                    getDocs(qMember),
                ]);

                const projetosMap = new Map();

                ownedSnapshot.docs.forEach((doc) => {
                    projetosMap.set(doc.id, { id: doc.id, ...doc.data() });
                });

                memberSnapshot.docs.forEach((doc) => {
                    projetosMap.set(doc.id, { id: doc.id, ...doc.data() });
                });

                const projetosList = Array.from(projetosMap.values());
                setProjetos(projetosList);

            } catch (err) {
                console.error('Erro ao buscar os projetos do usuário:', err);
                setError('Não foi possível carregar seus projetos.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProjects();
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

export default MyProjectsList;