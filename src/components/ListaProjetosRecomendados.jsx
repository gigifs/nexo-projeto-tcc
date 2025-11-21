import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from './ProjectCard';

const ListWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(
        2,
        1fr
    ); /*cria duas colunas de tamanho = 1fr (uma fração do espaço disponível)*/
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
    grid-column: 1 / -1; /*Ocupa todas as colunas do grid*/
`;

function ListaProjetosRecomendados() {
    const { currentUser, userData } = useAuth();
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjetosRecomendados = async () => {
            if (!currentUser || !userData) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Busca todas as candidaturas do usuário
                const minhasCandidaturasRef = collection(
                    db,
                    'users',
                    currentUser.uid,
                    'minhasCandidaturas'
                );
                const candidaturasSnapshot = await getDocs(minhasCandidaturasRef);
                const projetosPendentesIds = new Set(
                    candidaturasSnapshot.docs
                        .filter(doc => doc.data().status === 'pendente')
                        .map((doc) => doc.id)
                );

                // Busca projetos que não são do usuário
                const projetosRef = collection(db, 'projetos');
                const q = query(
                    projetosRef,
                    where('donoId', '!=', currentUser.uid)
                );
                const querySnapshot = await getDocs(q);

                const projetosList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Filtragem em Memória
                const projetosDisponiveis = projetosList.filter((p) => {
                    // Verifica se já é participante
                    const jaParticipa =
                        p.participantIds &&
                        p.participantIds.includes(currentUser.uid);

                    // Verifica se tem candidatura PENDENTE
                    const temCandidaturaPendente = projetosPendentesIds.has(p.id);
                    return !jaParticipa && !temCandidaturaPendente;
                });

                // LÓGICA DE RECOMENDAÇÃO
                const userHabilidades = userData.habilidades || [];
                const userInteresses = userData.interesses || [];
                const userCurso = userData.curso || '';

                // Filtragem Primária
                const projetosComHabilidadeCompativeis =
                    projetosDisponiveis.filter((projeto) => {
                        const projetoHabilidades = projeto.habilidades || [];
                        // O método .some() retorna true se pelo menos um item do array passar no teste
                        return projetoHabilidades.some((habilidade) =>
                            userHabilidades.includes(habilidade)
                        );
                    });

                // Cálculo de Pontuação
                const projetosPontuados = projetosComHabilidadeCompativeis.map(
                    (projeto) => {
                        let score = 0;
                        const projetoHabilidades = projeto.habilidades || [];
                        const projetoInteresses = projeto.interesses || [];
                        const projetoArea = projeto.area || '';

                        // +3 pontos por habilidade em comum
                        projetoHabilidades.forEach((habilidade) => {
                            if (userHabilidades.includes(habilidade)) {
                                score += 3;
                            }
                        });

                        // +2 pontos por interesse em comum
                        projetoInteresses.forEach((interesse) => {
                            if (userInteresses.includes(interesse)) {
                                score += 2;
                            }
                        });

                        // +1 ponto se a área for compatível com o curso
                        if (
                            userCurso &&
                            projetoArea &&
                            userCurso.toLowerCase().includes(projetoArea.toLowerCase())
                        ) {
                            score += 1;
                        }

                        return { ...projeto, score };
                    }
                );

                // Ordenação dos projetos pela pontuação
                const projetosOrdenados = projetosPontuados.sort(
                    (a, b) => b.score - a.score
                );

                setProjetos(projetosOrdenados);
            } catch (err) {
                console.error('Erro ao buscar projetos:', err);
                setError('Não foi possível carregar os projetos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjetosRecomendados();
    }, [currentUser, userData]);

    if (loading)
        return <MensagemFeedback>A carregar projetos recomendados...</MensagemFeedback>;
    if (error) return <MensagemFeedback>{error}</MensagemFeedback>;
    if (projetos.length === 0)
        return (
            <MensagemFeedback>
                Nenhum projeto recomendado para você no momento. Que tal criar
                um?
            </MensagemFeedback>
        );

    return (
        <ListWrapper>
            {projetos.map((projeto) => (
                <ProjectCard key={projeto.id} projeto={projeto} />
            ))}
        </ListWrapper>
    );
}

export default ListaProjetosRecomendados;