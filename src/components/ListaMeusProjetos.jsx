import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import MyProjectCard from './MyProjectCard';
import { useToast } from '../contexts/ToastContext';

const ListWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /*cria duas colunas de tamanho = 1fr (uma fração do espaço disponível)*/
    gap: 1.875rem;
    width: 100%;

    /* Quando a tela for menor que 768px, muda para 1 coluna de exibição para os cards */
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MensagemFeedback = styled.p`
    font-size: 1.125rem;
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
    const { addToast } = useToast();

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const projetosRef = collection(db, 'projetos');

        // Como o dono também está em 'participantIds'
        // pego tuo em uma única query
        const qTodos = query(
            projetosRef,
            where('participantIds', 'array-contains', currentUser.uid)
        );

        const unsubscribe = onSnapshot(qTodos, (snapshot) => {
            const listaProjetos = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));

            // Ordenação do mais recente para o mais antigo
            const projetosOrdenados = listaProjetos.sort((a, b) => {
                const timeA = a.criadoEm?.toDate()?.getTime() || 0;
                const timeB = b.criadoEm?.toDate()?.getTime() || 0;
                return timeB - timeA;
            });

            setProjetos(projetosOrdenados);
            setLoading(false);
        }, (err) => {
            console.error("Erro ao buscar projetos:", err);
            setError('Não foi possível carregar seus projetos.');
            addToast('Erro de conexão ao buscar projetos.', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
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