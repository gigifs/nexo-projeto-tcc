import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Botao from './Botao';
import { FiX } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// --- ESTILOS ---
const ModalContent = styled.div`
    padding: 20px 30px;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 25px;
`;

const ModalTitle = styled.h2`
    margin: 0;
    color: #333;
    font-size: 24px;
    font-weight: 600;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
`;

const Label = styled.label`
    font-size: 18px;
    font-weight: 500;
    color: #333;
`;

const Select = styled.select`
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
    background-color: #fff;
    &:focus {
        outline: none;
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;

const MultiSelectContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 8px 10px;
    background-color: #fff;
    min-height: 48px;
    align-items: center;
    cursor: text;

    &:focus-within {
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;

const MultiSelectInput = styled.input`
    flex-grow: 1;
    border: none;
    outline: none;
    padding: 5px 0;
    font-size: 16px;
    min-width: 120px;
`;

const SelectedTag = styled.span`
    background-color: #e6ebf0;
    color: #333;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;

    button {
        background: none;
        border: none;
        color: #7c2256;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        display: flex;
        align-items: center;
        padding: 0;
    }
`;

const SuggestionsContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 5px 0 0 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    max-height: 150px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: absolute;
    width: 100%;
    top: 100%;
    z-index: 10;
`;

const SuggestionItem = styled.li`
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 20px;
`;

function ModalFiltroBuscarProjeto({ onApplyFilters, onClose, initialFilters }) {
    const [filters, setFilters] = useState(initialFilters);
    const [interestSearch, setInterestSearch] = useState('');
    const [skillSearch, setSkillSearch] = useState('');
    const [interessesDisponiveis, setInteressesDisponiveis] = useState([]);
    const [habilidadesDisponiveis, setHabilidadesDisponiveis] = useState([]);
    const [areasDisponiveis, setAreasDisponiveis] = useState([]);

    useEffect(() => {
        const buscarTags = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tags'));
                const tagsDoBanco = querySnapshot.docs.map((doc) => doc.data());

                tagsDoBanco.sort((a, b) => a.nome.localeCompare(b.nome));

                setHabilidadesDisponiveis(
                    tagsDoBanco
                        .filter((tag) => tag.tipo === 'habilidade')
                        .map((t) => t.nome)
                );
                setInteressesDisponiveis(
                    tagsDoBanco
                        .filter((tag) => tag.tipo === 'interesse')
                        .map((t) => t.nome)
                );
                setAreasDisponiveis(
                    tagsDoBanco
                        .filter((tag) => tag.tipo === 'area')
                        .map((t) => t.nome)
                );
            } catch (error) {
                console.error('Erro ao buscar tags para filtro:', error);
            }
        };
        buscarTags();
    }, []);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const handleSelectChange = (e) =>
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddTag = (type, tag) => {
        if (!filters[type].includes(tag)) {
            setFilters((prev) => ({
                ...prev,
                [type]: [...prev[type], tag],
            }));
        }
        if (type === 'interesses') setInterestSearch('');
        if (type === 'habilidades') setSkillSearch('');
    };

    const handleRemoveTag = (type, tagToRemove) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type].filter((t) => t !== tagToRemove),
        }));
    };

    const handleClearFilters = () => {
        const clearedFilters = { area: '', interesses: [], habilidades: [] };
        setFilters(clearedFilters);
        onApplyFilters(clearedFilters);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onApplyFilters(filters);
        onClose();
    };

    const interestSuggestions = interestSearch
        ? interessesDisponiveis.filter(
              (i) =>
                  i.toLowerCase().includes(interestSearch.toLowerCase()) &&
                  !filters.interesses.includes(i)
          )
        : [];
    const skillSuggestions = skillSearch
        ? habilidadesDisponiveis.filter(
              (h) =>
                  h.toLowerCase().includes(skillSearch.toLowerCase()) &&
                  !filters.habilidades.includes(h)
          )
        : [];

    return (
        <ModalContent>
            <ModalHeader>
                <ModalTitle>Filtrar Projetos</ModalTitle>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="area">Área</Label>
                    <Select
                        id="area"
                        name="area"
                        value={filters.area}
                        onChange={handleSelectChange}
                    >
                        <option value="">Todas as Áreas</option>
                        {areasDisponiveis.map((area) => (
                            <option key={area} value={area}>
                                {area}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Interesses</Label>
                    <MultiSelectContainer>
                        {filters.interesses.map((tag) => (
                            <SelectedTag key={tag}>
                                {tag}{' '}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveTag('interesses', tag)
                                    }
                                >
                                    <FiX />
                                </button>
                            </SelectedTag>
                        ))}
                        <MultiSelectInput
                            type="text"
                            placeholder="Adicionar interesse..."
                            value={interestSearch}
                            onChange={(e) => setInterestSearch(e.target.value)}
                        />
                    </MultiSelectContainer>
                    {interestSuggestions.length > 0 && (
                        <SuggestionsContainer>
                            {interestSuggestions.map((s) => (
                                <SuggestionItem
                                    key={s}
                                    onClick={() =>
                                        handleAddTag('interesses', s)
                                    }
                                >
                                    {s}
                                </SuggestionItem>
                            ))}
                        </SuggestionsContainer>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Habilidades</Label>
                    <MultiSelectContainer>
                        {filters.habilidades.map((tag) => (
                            <SelectedTag key={tag}>
                                {tag}{' '}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveTag('habilidades', tag)
                                    }
                                >
                                    <FiX />
                                </button>
                            </SelectedTag>
                        ))}
                        <MultiSelectInput
                            type="text"
                            placeholder="Adicionar habilidade..."
                            value={skillSearch}
                            onChange={(e) => setSkillSearch(e.target.value)}
                        />
                    </MultiSelectContainer>
                    {skillSuggestions.length > 0 && (
                        <SuggestionsContainer>
                            {skillSuggestions.map((s) => (
                                <SuggestionItem
                                    key={s}
                                    onClick={() =>
                                        handleAddTag('habilidades', s)
                                    }
                                >
                                    {s}
                                </SuggestionItem>
                            ))}
                        </SuggestionsContainer>
                    )}
                </FormGroup>

                <ButtonGroup>
                    <Botao
                        variant="cancelar-excluir"
                        type="button"
                        onClick={handleClearFilters}
                    >
                        Limpar Filtros
                    </Botao>
                    <Botao variant="Modal" type="submit">
                        Aplicar Filtros
                    </Botao>
                </ButtonGroup>
            </Form>
        </ModalContent>
    );
}

export default ModalFiltroBuscarProjeto;
