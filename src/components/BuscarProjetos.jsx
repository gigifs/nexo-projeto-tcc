import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiFilter } from 'react-icons/fi';
import Botao from './Botao';
import Modal from './Modal';
import ModalFiltroBuscarProjeto from './ModalFiltroProjetos';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProjectCard from './ProjectCard'; 


const Container = styled.div`
    width: 100%;
    box-sizing: border-box;
`;

const TopActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.56rem;
`;

const SearchAndFilter = styled.div`
    display: flex;
    gap: 1.25rem;
    flex-grow: 1;
`;

const SearchInputGroup = styled.div`
    position: relative;
    flex-grow: 1;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.75rem 0.95rem 0.75rem 2.8rem;
    border: 1px solid #ccc;
    border-radius: 0.8rem;
    font-size: 1rem;
    box-sizing: border-box;
    &:focus {
        outline: none;
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;

const SearchIcon = styled(FiSearch)`
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    color: #555;
`;

const FilterButton = styled(Botao)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.8rem;
`;

const MainContent = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
    align-items: start;
`;

const ProjectsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.875rem;

    //* Quando a tela for menor que 768px, muda para 1 coluna de exibição para os cards */
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

function BuscarProjetos() {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({
        area: '',
        interesses: [],
        habilidades: [],
    });
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'projetos'));
                const projectsList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllProjects(projectsList);
            } catch (error) {
                console.error('Erro ao buscar projetos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        let tempProjects = [...allProjects];

        if (currentUser) {
            tempProjects = tempProjects.filter(
                (p) => p.donoId !== currentUser.uid
            );
        }

        if (searchTerm) {
            tempProjects = tempProjects.filter(
                (p) =>
                    (p.nome || '')
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (p.descricao || '')
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (currentFilters.area) {
            tempProjects = tempProjects.filter(
                (p) => p.area === currentFilters.area
            );
        }
        if (currentFilters.interesses.length > 0) {
            tempProjects = tempProjects.filter((p) =>
                currentFilters.interesses.some((filtro) =>
                    p.interesses?.includes(filtro)
                )
            );
        }
        if (currentFilters.habilidades.length > 0) {
            tempProjects = tempProjects.filter((p) =>
                currentFilters.habilidades.some((filtro) =>
                    p.habilidades?.includes(filtro)
                )
            );
        }

        setFilteredProjects(tempProjects);
    }, [allProjects, searchTerm, currentFilters, currentUser]);

    const handleApplyFilters = (filters) => {
        setCurrentFilters(filters);
        setIsFilterModalOpen(false);
    };

    return (
        <Container>
            <TopActions>
                <SearchAndFilter>
                    <SearchInputGroup>
                        <SearchIcon size={20} />
                        <SearchInput
                            type="text"
                            placeholder="Buscar por título ou descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </SearchInputGroup>
                    <FilterButton
                        variant="Modal"
                        onClick={() => setIsFilterModalOpen(true)}
                    >
                        <FiFilter size={20} /> Filtrar por Interesse
                    </FilterButton>
                </SearchAndFilter>
            </TopActions>

            <MainContent>
                <ProjectsGrid>
                    {loading ? (
                        <p>A carregar projetos...</p>
                    ) : filteredProjects.length > 0 ? (
                        
                        filteredProjects.map((project) => (
                            <ProjectCard key={project.id} projeto={project} />
                        ))
                    ) : (
                        <p>Nenhum projeto encontrado.</p>
                    )}
                </ProjectsGrid>
            </MainContent>

            <Modal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                size="large"
            >
                <ModalFiltroBuscarProjeto
                    onApplyFilters={handleApplyFilters}
                    onClose={() => setIsFilterModalOpen(false)}
                    initialFilters={currentFilters}
                />
            </Modal>
        </Container>
    );
}

export default BuscarProjetos;