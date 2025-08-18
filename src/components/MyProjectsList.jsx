import { useState, useEffect } from 'react';
import styled from 'styled-components';
// As importações do Firebase foram comentadas para o teste
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useAuth } from '../contexts/AuthContext';
import MyProjectCard from './MyProjectCard';

const ListWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    width: 100%;
`;

// --- DADOS MOCADOS INSERIDOS AQUI ---
const mockCurrentUser = { uid: 'user-123' };

const mockProjetos = [
    {
        id: 'proj-NEXO',
        nome: 'NEXO - Plataforma de Match Acadêmico',
        descricao: 'Desenvolvimento de uma plataforma web para conectar estudantes para a formação de grupos de estudo e projetos acadêmicos.',
        donoId: 'user-123',
        participantIds: ['user-123', 'user-456'],
        status: 'Aberto para Candidaturas',
        habilidades: ['React', 'JavaScript', 'Firebase'],
        interesses: ['UI/UX', 'Gestão de Projetos'],
        curso: 'Ciência da Computação',
        dono: 'Anthony'
    },
    {
        id: 'proj-ANALISE',
        nome: 'Análise de Sentimentos em Redes Sociais',
        descricao: 'Projeto de pesquisa focado em analisar e classificar sentimentos de postagens em redes sociais utilizando técnicas de Machine Learning.',
        donoId: 'user-999',
        participantIds: ['user-999', 'user-123'],
        status: 'Novo',
        habilidades: ['Python', 'Pandas', 'Scikit-learn'],
        interesses: ['IA', 'Processamento de Linguagem Natural'],
        curso: 'Engenharia de Software',
        dono: 'Julia'
    }
];
// --- FIM DOS DADOS MOCADOS ---


function MyProjectsList() {
    // const { currentUser } = useAuth(); // Comentado para o teste
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // A lógica original do Firebase foi substituída por esta simulação
        setLoading(true);
        setTimeout(() => {
            setProjetos(mockProjetos);
            setLoading(false);
        }, 500); // Simula um carregamento de 0.5 segundos

    }, []);

    if (loading) return <p>Carregando seus projetos...</p>;

    return (
        <ListWrapper>
            {projetos.map((projeto) => (
                <MyProjectCard 
                    key={projeto.id} 
                    projeto={projeto} 
                    // Passamos o ID do nosso usuário mocado para o Card
                    currentUserId={mockCurrentUser.uid} 
                />
            ))}
        </ListWrapper>
    );
}

export default MyProjectsList;