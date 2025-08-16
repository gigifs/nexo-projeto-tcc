import { useState } from 'react';
import styled from 'styled-components';
import Botao from './Botao';
import { FaTimes } from 'react-icons/fa';
//Importação das ferramentas do firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
//Hook de Autenticação
import { useAuth } from '../contexts/AuthContext';

const FormContainer = styled.form`
    padding: 20px 40px 30px 40px;
    background-color: #f5fafc;
`;

const Titulo = styled.h2`
    font-size: 28px;
    font-weight: 700;
    text-align: left; /*Alinhado à esquerda como no figma*/
    color: #030214;
    margin-top: 10px;
    margin-bottom: 30px;
`;

const InputGroup = styled.div`
    margin-bottom: 20px;
    position: relative; /*Necessário por conta do autocomplete*/
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 16px;
    color: #000000CC;
`;

const Input = styled.input`
    width: 100%;
    background-color: #F5FAFC;
    padding: 12px 15px;
    font-size: 16px;
    color: #000000CC;
    border: 1px solid #ced4da;
    border-radius: 10px;
    outline: none;
    transition: 
        border-color: 0.2s,
        box-shadow: 0.2s;
    box-sizing: border-box;

    &:focus {
        border-color: #e95be9ff;
        box-shadow: 0 0 0 3px #e95be748;
    }
`;

const Textarea = styled.textarea`
    width: 100%;
    background-color: #f5fafc;
    padding: 12px 15px;
    font-size: 16px;
    font-family: inherit;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
    outline: none;
    resize: vertical;
    min-height: 80px;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
    box-sizing: border-box;

    &:focus {
        border-color: #e95be9ff;
        box-shadow: 0 0 0 3px #e95be748;
    }
`;

const Select = styled.select`
    width: 100%;
    background-color: #f5fafc;
    padding: 12px 15px;
    font-size: 16px;
    font-family: inherit;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 10px;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: #e95be9ff;
        box-shadow: 0 0 0 3px #e95be748;
    }
`;

const HabilidadesContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    min-height: 28px; /* Para não "pular" quando a primeira tag é adicionada */
`;

const Tag = styled.div`
    background-color: #d1e7ff; /* Azul claro */
    color: #0d6efd; /* Azul escuro */
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FooterBotoes = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 40px;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
`;

function FormularioCriarProjeto({ onClose }) {
    //Pega a informação do usuário logado
    const { currentUser } = useAuth();
    //Estados para os campos do formulário
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [area, setArea] = useState('');
    const [habilidadeAtual, setHabilidadeAtual] = useState('');
    const [habilidades, setHabilidades] = useState(['JavaScript', 'Hackaton']);
    // Estado para mensagem de erro
    const [erro, setErro] = useState('');

    const handleAdicionarHabilidade = () => {
        const habilidadeFormatada = habilidadeAtual.trim();
        if (habilidadeFormatada && !habilidades.includes(habilidadeFormatada)) {
            setHabilidades([...habilidades, habilidadeFormatada]);
            setHabilidadeAtual('');
        }
    };

    //Permite adicionar com a tecla 'enter'
    const handleKeyDown = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault(); //impede o envio o formulario
            handleAdicionarHabilidade();
        }
    };

    const handleRemoverHabilidade = (habilidadeParaRemover) => {
        setHabilidades(habilidades.filter((h) => h !== habilidadeParaRemover));
    };

    const handleSubmit = async (evento) => {
        evento.preventDefault();
        setErro(''); //Limpa erros antigos
        //Verifica se o usuário está logado
        if (!currentUser) {
            setErro('Você precisa estar logado para criar um projeto.');
            return;
        }

        try {
            //Aponta para a coleção 'projetos' no Firestore
            const projetosCollectionRef = collection(db, 'projetos');
            //Adiciona um novo projeto na coleção
            await addDoc(projetosCollectionRef, {
                nome: nomeProjeto,
                descricao: descricao,
                area: area,
                habilidades: habilidades,
                donoId: currentUser.uid,
                criadoEm: serverTimestamp(),
            });
            alert('Projeto criado com sucesso!');
            onClose(); //Fecha o modal
        } catch (error) {
            console.error('Erro ao salvar o projeto.', error);
            setErro('Ocorreu um erro ao salvar o projeto. Tente novamente.');
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <Titulo>Criar novo projeto</Titulo>

            <InputGroup>
                <Label htmlFor='nome-projeto'>Nome do Projeto</Label>
                <Input
                    id='nome-projeto'
                    value={nomeProjeto}
                    onChange={(e) => setNomeProjeto(e.target.value)}
                    placeholder='Ex.Plataforma de Match Acadêmico'
                    required
                />
            </InputGroup>

            <InputGroup>
                <Label htmlFor='descricao-projeto'>Descrição</Label>
                <Textarea
                    id='descricao-projeto'
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder='Descreva seu projeto...'
                    required
                />
            </InputGroup>

            <InputGroup>
                <Label htmlFor='area-projeto'>Área relacionada</Label>
                <Select
                    id='area-projeto'
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                >
                    <option value='' disabled>Selecione uma área</option>
                    <option value='desenvolvimento'>Desenvolvimento de Software</option>
                    <option value='pesquisa'>Pesquisa Acadêmica</option>
                    <option value='design'>Design/UX</option>
                    <option value='marketing'>Marketing</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label htmlFor='habilidades-projeto'>Habilidades Necessárias</Label>
                <HabilidadesContainer>
                    <Input
                    id='habilidades-projeto'
                    value={habilidadeAtual}
                    onChange={(e) => setHabilidadeAtual(e.target.value)}
                    onKeyDown={handleKeyDown} //ENTER
                    placeholder='Ex. FrontEnd, Pesquisa...'
                    required
                />
                <Botao type='button' variant='AdicionarHabilidade' onClick={handleAdicionarHabilidade}>
                    +
                </Botao>
                </HabilidadesContainer>
                <TagsContainer>
                    {habilidades.map((habilidade) => (
                        <Tag key={habilidade}>
                            {habilidade} 
                            <FaTimes
                                color='0d6efd'
                                cursor='pointer'
                                onClick={() => handleRemoverHabilidade(habilidade)}
                            />
                        </Tag>
                    ))}
                </TagsContainer>
                
            </InputGroup>
            
            {erro && <p style={{color: 'red', textAlign: 'center'}}>{erro}</p>}

            <FooterBotoes>
                <Botao type='button' variant='Cancelar' onClick={onClose}>
                    Cancelar
                </Botao>
                <Botao type='submit' variant='Modal'>
                    Criar Projeto
                </Botao>
            </FooterBotoes>
        </FormContainer>
    );
}  

export default FormularioCriarProjeto;