import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import Botao from '../components/Botao';
import { FiCheck, FiGithub, FiLinkedin, FiArrowRight, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import logoQuadrada from '../assets/logoQuadrada.svg';
import { useToast } from '../contexts/ToastContext';

const PageContainer = styled.div`
    min-height: 100vh;
    background-color: #e6ebf0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
`;

const WizardBox = styled.div`
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 50rem;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    min-height: 31.25rem;

    @media (max-width: 768px) {
        padding: 1.25rem;
        min-height: auto;
    }
`;

const ProgressBar = styled.div`
    display: flex;
    gap: 0.625rem;
    margin-bottom: 1.875rem;
`;

const StepDot = styled.div`
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background-color: ${props => props.$active ? '#7c2256' : '#ccc'};
    transition: background-color 0.3s ease;
`;

const ContentArea = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    animation: fadeIn 0.5s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const Titulo = styled.h2`
    font-size: 2.5rem;
    color: #030214;
    margin: 0;
    font-weight: 700;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const Subtitulo = styled.p`
    font-size: 1.25rem;
    color: #555;
    max-width: 37.5rem;
    line-height: 1.5;
    margin: 0;
`;

const InputGroup = styled.div`
    width: 100%;
    max-width: 31.25rem;
    text-align: left;
    position: relative;
    margin-bottom: 0.94rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #7c2256;
    font-size: 1.1rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem 0.94rem;
    border-radius: 0.625rem;
    border: 1px solid #ccc;
    font-size: 1rem;
    background-color: #fff;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 0.75rem 0.94rem;
    border-radius: 0.625rem;
    border: 1px solid #ccc;
    font-size: 1rem;
    background-color: #fff;
    box-sizing: border-box;
    resize: vertical;
    min-height: 6.25rem;
    font-family: inherit;

    &:focus {
        outline: none;
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 1.25rem;
    margin-top: 1.875rem;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* Botões podem quebrar linha se necessário */

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.625rem;
        
        button {
            width: 100%; /* Botões ocupam toda a largura */
        }

        /* Esconde o espaçador flexível no mobile */
        .spacer {
            display: none;
        }
        
        .botoes-direita {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.625rem;
        }
    }
`;

const TagsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    margin-top: 0.625rem;
    justify-content: center;
    max-width: 37.5rem;
`;

const Tag = styled.span`
    padding: 0.5rem 1rem;
    border-radius: 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    ${props => props.$tipo === 'habilidade' && css`
        background-color: #4AACF266;
        color: #234DD7;
    `}

    ${props => props.$tipo === 'interesse' && css`
        background-color: #ff8eda66;
        color: #FE3F85;
    `}
`;

const SugestoesList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ddd;
    border-radius: 0 0 0.625rem 0.625rem;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 9.375rem;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const SugestaoItem = styled.li`
    padding: 0.625rem;
    cursor: pointer;
    &:hover { background-color: #f0f0f0; }
`;

const IconInputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    
    svg {
        position: absolute;
        left: 0.75rem;
        color: #555;
        font-size: 1.2rem;
    }

    input {
        padding-left: 2.5rem;
    }
`;


function OnboardingPage() {
    const navigate = useNavigate();
    const { currentUser, refreshUserData } = useAuth();
    const [step, setStep] = useState(1);
    const { addToast } = useToast();
    
    // Dados do formulário
    const [habilidades, setHabilidades] = useState([]);
    const [interesses, setInteresses] = useState([]);
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [curso, setCurso] = useState('');
    const [bio, setBio] = useState('');

    // Estados de busca/sugestão
    const [buscaHab, setBuscaHab] = useState('');
    const [buscaInt, setBuscaInt] = useState('');
    const [todasTags, setTodasTags] = useState({ habilidades: [], interesses: [] });
    const [loading, setLoading] = useState(false);

    // Carregar tags do Firestore ao iniciar
    useEffect(() => {
        const carregarTags = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tags'));
                const tagsData = querySnapshot.docs.map(doc => doc.data());
                
                setTodasTags({
                    habilidades: tagsData.filter(t => t.tipo === 'habilidade'),
                    interesses: tagsData.filter(t => t.tipo === 'interesse')
                });
            } catch (error) {
                console.error("Erro ao carregar tags:", error);
            }
        };
        carregarTags();
    }, []);

    // Lógica dos steps/passos
    const handleNext = () => {
        // Passo 2 (Curso/Bio) é opcional para o usuário então sem validação
        
        // Validação Passo 3 (Habilidades)
        if (step === 3 && habilidades.length === 0) {
            addToast('Adicione pelo menos uma habilidade.', 'error');
            return;
        }
        // Validação Passo 4 (Interesses)
        if (step === 4 && interesses.length === 0) {
            addToast('Adicione pelo menos um interesse!', 'error');
            return;
        }
        setStep(prev => prev + 1);
    };

    const handlePrev = () => setStep(prev => prev - 1);

    // Função auxiliar para validar se é uma URL
    const isValidURL = (string) => {
        if (!string) return true; // Permite vazio (já que é opcional)
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleFinish = async () => {
    if (!currentUser) return;

    // VALIDAÇÃO DOS LINKS
    // Valida GitHub
    if (github && (!isValidURL(github) || !github.toLowerCase().includes('github.com'))) {
        addToast('Por favor, insira um link válido do GitHub.', 'info');
        return;
    }

    // Valida LinkedIn
    if (linkedin && (!isValidURL(linkedin) || !linkedin.toLowerCase().includes('linkedin.com'))) {
        addToast('Por favor, insira um link válido do LinkedIn.', 'info');
        return;
    }
        setLoading(true);
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            
            await setDoc(userRef, {
                curso,
                bio,
                habilidades,
                interesses,
                github,
                linkedin,
                onboardingCompleted: true 
            }, { merge: true });

            await refreshUserData(); // Atualiza contexto
            navigate('/dashboard'); // Redireciona para o Feed
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            addToast('Erro ao salvar seus dados. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Lógica das tags, sugestão, busca, ...
    const filtrarTags = (tipo, busca) => {
        if (!busca) return [];
        const lista = tipo === 'habilidade' ? todasTags.habilidades : todasTags.interesses;
        const jaSelecionados = tipo === 'habilidade' ? habilidades : interesses;
        
        return lista.filter(tag => 
            tag.nome.toLowerCase().includes(busca.toLowerCase()) && 
            !jaSelecionados.includes(tag.nome)
        ).slice(0, 5);
    };

    const addTag = (tipo, nome) => {
        if (tipo === 'habilidade') {
            if (!habilidades.includes(nome)) { // Previne duplicatas
                setHabilidades([...habilidades, nome]);
            }
            setBuscaHab('');
        } else {
            if (!interesses.includes(nome)) { // Previne duplicatas
                setInteresses([...interesses, nome]);
            }
            setBuscaInt('');
        }
    };

    const removeTag = (tipo, nome) => {
        if (tipo === 'habilidade') {
            setHabilidades(habilidades.filter(h => h !== nome));
        } else {
            setInteresses(interesses.filter(i => i !== nome));
        }
    };

    // Renderização dos steps/passos

    const renderStep1 = () => (
        <ContentArea>
            <img src={logoQuadrada} alt="Logo Nexo" style={{ width: '6.25rem', marginBottom: '1.25rem' }} />
            <Titulo>Bem-vindo ao NEXO!</Titulo>
            <Subtitulo>
                Estamos muito felizes em ter você aqui. Antes de começar a explorar projetos incríveis, 
                vamos configurar seu perfil para que você encontre as melhores oportunidades.
            </Subtitulo>
            <Actions>
                <Botao variant="Modal" onClick={handleNext}>Continuar <FiArrowRight style={{marginLeft: 8}} /></Botao>
            </Actions>
        </ContentArea>
    );

    const renderStep2 = () => (
        <ContentArea>
            <Titulo>Sobre Você</Titulo>
            <Subtitulo>Conte-nos o que você estuda e um pouco sobre sua jornada (Opcional).</Subtitulo>
            
            <InputGroup>
                <Label>Qual o seu curso?</Label>
                <Input 
                    placeholder="Ex: Engenharia de Software, Direito..." 
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                />
            </InputGroup>

            <InputGroup>
                <Label>Bio (Resumo)</Label>
                <Textarea 
                    placeholder="Fale brevemente sobre seus objetivos e experiências..." 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </InputGroup>

            <Actions>
                <Botao variant="Cancelar" onClick={handlePrev}><FiArrowLeft /> Voltar</Botao>
                
                <div className="spacer" style={{ flex: 1 }}></div> 
                
                <div className="botoes-direita" style={{ display: 'flex', gap: '1.25rem' }}>
                    <Botao variant="Cancelar" onClick={handleNext}>Pular</Botao>
                    <Botao variant="Modal" onClick={handleNext}>Próximo</Botao>
                </div>
            </Actions>
        </ContentArea>
    );

    const renderStep3 = () => (
        <ContentArea>
             <Titulo>Suas Habilidades</Titulo>
            <Subtitulo>Quais são suas principais competências técnicas?</Subtitulo>
            <InputGroup>
                <Label>Adicionar Habilidade</Label>
                <Input 
                    placeholder="Pesquisar..." 
                    value={buscaHab}
                    onChange={(e) => setBuscaHab(e.target.value)}
                />
                {buscaHab && (
                    <SugestoesList>
                        {filtrarTags('habilidade', buscaHab).map(tag => (
                            <SugestaoItem key={tag.nome} onClick={() => addTag('habilidade', tag.nome)}>
                                {tag.nome}
                            </SugestaoItem>
                        ))}
                    </SugestoesList>
                )}
            </InputGroup>
            <TagsWrapper>
                {habilidades.map(h => <Tag key={h} $tipo="habilidade" onClick={() => removeTag('habilidade', h)}>{h} <FiX /></Tag>)}
            </TagsWrapper>
            <Actions>
                <Botao variant="Cancelar" onClick={handlePrev}><FiArrowLeft /> Voltar</Botao>
                <Botao variant="Modal" onClick={handleNext}>Próximo</Botao>
            </Actions>
        </ContentArea>
    );

    const renderStep4 = () => (
        <ContentArea>
            <Titulo>Seus Interesses</Titulo>
            <Subtitulo>Quais temas te atraem? (Soft Skills e Áreas de Interesse).</Subtitulo>
            <InputGroup>
                <Label>Adicionar Interesse</Label>
                <Input 
                    placeholder="Pesquisar..." 
                    value={buscaInt}
                    onChange={(e) => setBuscaInt(e.target.value)}
                />
                 {buscaInt && (
                    <SugestoesList>
                        {filtrarTags('interesse', buscaInt).map(tag => (
                            <SugestaoItem key={tag.nome} onClick={() => addTag('interesse', tag.nome)}>
                                {tag.nome}
                            </SugestaoItem>
                        ))}
                    </SugestoesList>
                )}
            </InputGroup>
            <TagsWrapper>
                {interesses.map(i => <Tag key={i} $tipo="interesse" onClick={() => removeTag('interesse', i)}>{i} <FiX /></Tag>)}
            </TagsWrapper>
            <Actions>
                <Botao variant="Cancelar" onClick={handlePrev}><FiArrowLeft /> Voltar</Botao>
                <Botao variant="Modal" onClick={handleNext}>Próximo</Botao>
            </Actions>
        </ContentArea>
    );

    const renderStep5 = () => (
        <ContentArea>
            <Titulo>Seu Portfólio</Titulo>
            <Subtitulo>Conecte suas redes profissionais. Usuários com links preenchidos têm mais chances de aprovação em projetos.</Subtitulo>
            
            <InputGroup>
                <Label>GitHub (Opcional)</Label>
                <IconInputWrapper>
                    <FiGithub />
                    <Input 
                        placeholder="https://github.com/seu-usuario" 
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                    />
                </IconInputWrapper>
            </InputGroup>

            <InputGroup>
                <Label>LinkedIn (Opcional)</Label>
                <IconInputWrapper>
                    <FiLinkedin color="#0077b5" />
                    <Input 
                        placeholder="https://linkedin.com/in/seu-usuario" 
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                    />
                </IconInputWrapper>
            </InputGroup>

            <Actions>
                <Botao variant="Cancelar" onClick={handlePrev} disabled={loading}><FiArrowLeft /> Voltar</Botao>
                <Botao variant="SalvarPerfil" onClick={handleFinish} disabled={loading}>
                    {loading ? 'Salvando...' : 'Concluir Cadastro'} <FiCheck style={{marginLeft: 8}}/>
                </Botao>
            </Actions>
        </ContentArea>
    );

    return (
        <PageContainer>
            <WizardBox>
                {/* Barra de progresso dos steps/passos */}
                <div style={{display: 'flex', gap: '0.625rem', marginBottom: '1.875rem'}}>
                    {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} style={{
                            width: '0.75rem', height: '0.75rem', borderRadius: '50%',
                            backgroundColor: step >= num ? '#7c2256' : '#ccc',
                            transition: '0.3s'
                        }} />
                    ))}
                </div>
                
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}

            </WizardBox>
        </PageContainer>
    );
}

export default OnboardingPage;