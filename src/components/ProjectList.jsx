import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
                //A query busca projetos onde o dono NÃO É o usuário atual
                const q = query(projetosRef, where('donoId', '!=', currentUser.uid));

                const querySnapshot = await getDocs(q);
                const projetosList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProjetos(projetosList);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err);
                setError('Não foi possível carregar os projetos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjetosRecomendados();
    }, [currentUser]); //Roda a busca apenas quando o usuário é definido

    if (loading) return <MensagemFeedback>Carregando projetos...</MensagemFeedback>;
    if (error) return <MensagemFeedback>{error}</MensagemFeedback>;
    //Se não houver nenhum projeto criado, aparece essa menssagem
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