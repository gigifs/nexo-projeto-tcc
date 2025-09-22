import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from './ProjectCard';

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
    grid-column: 1 / -1; /*Ocupa todas as colunas do grid*/
`;

function ListaProjetosRecomendados() {
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
                //Busca inicial, projetos que não são do usuário
                const projetosRef = collection(db, 'projetos');
                const q = query(projetosRef, where('donoId', '!=', currentUser.uid));
                const querySnapshot = await getDocs(q);

                let projetosList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                //Filtra projetos onde o usuário já é participante
                const projetosFiltrados = projetosList.filter(
                    (p) => !(p.participantIds && p.participantIds.includes(currentUser.uid))
                );

                //Verifica as candidaturas para os projetos restantes
                const verificacaoCandidaturas = projetosFiltrados.map(async (projeto) => {
                    const candidaturaRef = doc(db, 'projetos', projeto.id, 'candidaturas', currentUser.uid);
                    const candidaturaSnap = await getDoc(candidaturaRef);
                    return { ...projeto, jaCandidatou: candidaturaSnap.exists() };
                });

                //Espera todas as verificações terminarem
                const projetosComStatusCandidatura = await Promise.all(verificacaoCandidaturas);

                //Filtro final, remove os projetos onde o usuário já se candidatou
                const projetosFinais = projetosComStatusCandidatura.filter(p => !p.jaCandidatou);

                setProjetos(projetosFinais);

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

export default ListaProjetosRecomendados;
