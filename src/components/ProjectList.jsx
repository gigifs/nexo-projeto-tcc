import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, getDocs } from 'firebase/firestore'; // Removido o 'where' que não será usado
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from './ProjectCard';

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
    grid-column: 1 / -1; /*Ocupa todas as colunas do grid*/
`;

function ProjectList() {
    const { currentUser } = useAuth();
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjetosRecomendados = async () => {
            if (!currentUser) return;

            setLoading(true);
            setError('');
            try {
                const projetosRef = collection(db, 'projetos');
                // 1. A query agora busca TODOS os projetos, sem filtros.
                const q = query(projetosRef);

                const querySnapshot = await getDocs(q);
                const todosOsProjetos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // 2. Filtramos a lista para excluir projetos do usuário atual.
                const projetosFiltrados = todosOsProjetos.filter(projeto => {
                    // Garante que participantIds seja um array antes de verificar
                    const isParticipant = Array.isArray(projeto.participantIds) 
                        ? projeto.participantIds.includes(currentUser.uid) 
                        : false;
                    
                    // Retorna 'false' se o usuário for o dono OU um participante,
                    // removendo o projeto da lista final.
                    return projeto.donoId !== currentUser.uid && !isParticipant;
                });

                setProjetos(projetosFiltrados);

            } catch (err) {
                console.error("Erro ao buscar projetos:", err);
                setError('Não foi possível carregar os projetos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjetosRecomendados();
    }, [currentUser]);

    if (loading) return <MensagemFeedback>Carregando projetos...</MensagemFeedback>;
    if (error) return <MensagemFeedback>{error}</MensagemFeedback>;
    if (projetos.length === 0) return <MensagemFeedback>Nenhum projeto encontrado para você no momento.</MensagemFeedback>;

    return (
        <ListWrapper>
            {projetos.map(projeto => (
                <ProjectCard key={projeto.id} projeto={projeto} />
            ))}
        </ListWrapper>
    );
}

export default ProjectList;