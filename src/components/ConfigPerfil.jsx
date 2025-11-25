import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import Botao from './Botao';
import Modal from './Modal';
import EditarInteressesModal from './EditarInteressesModal';
import { FiEdit, FiGithub, FiLinkedin, FiEdit3 } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import { getInitials } from '../utils/iniciaisNome';
import {
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    writeBatch,
} from 'firebase/firestore';

// Container principal
const FormContainer = styled.div`
    display: flex;
    background-color: #f5fafc;
    border-radius: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// A coluna da esquerda com a cor de fundo cinza
const ColunaEsquerda = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.95rem;
    background-color: #e6ebf0;
    padding: 1.875rem;
    flex-shrink: 0;
`;

const Avatar = styled.div`
    width: 9.375rem;
    height: 9.375rem;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 3.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.3s ease;
`;

const BotaoTrocarCor = styled.button`
    background: none;
    border: none;
    padding: 0.6rem 0.8rem 0.6rem 0.8rem;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #7c2256;
    cursor: pointer;
    text-align: center;
    border-radius: 0.6rem;
    background-color: #f5fafc;

    &:hover {
        box-shadow: 0 4px 12px rgba(92, 19, 73, 0.46);
    }
`;

// Container para o restante do formulário (parte branca da direita)
const FormContent = styled.form`
    flex-grow: 1;
    padding: 1.875rem 2.5rem;
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    gap: 2.188rem;
    /* Garante que o formulário nunca exceda a largura do pai */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.875rem;
        padding: 1.25rem;
    }

    @media (max-width: 480px) {
        padding: 0.94rem 0.6rem 0.94rem 0.6rem;
    }
`;

const ColunaInputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const ColunaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const BotoesFooter = styled.div`
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    gap: 1.25rem;
    margin-top: 1.875rem;
    padding-top: 1.25rem;
    border-top: 1px solid #ddd;
`;

const InputRow = styled.div`
    display: flex;
    gap: 1.25rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    position: relative;

    @media (max-width: 390px) {
        width: 90%;
        min-width: 0;
    }

    @media (max-width: 350px) {
        width: 80%;
        min-width: 0;
    }
`;
const Label = styled.label`
    font-size: 1.125rem;
    font-weight: 500;
    color: ${(props) => props.color || '#7c2256'};

    span {
        font-weight: 400;
        opacity: 0.7;
        font-size: 0.9rem;
        margin-left: 0.5rem;
    }
`;
const Input = styled.input`
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 0.75rem 0.94rem;
    font-size: 1rem;
    font-weight: 400;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 0.6rem;
    outline: none;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
    &:focus {
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;
const Textarea = styled.textarea`
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 0.75rem 0.94rem;
    font-size: 1rem;
    font-weight: 400;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 0.6rem;
    outline: none;
    resize: vertical;
    min-height: 10rem;
    font-family: inherit;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
    &:focus {
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;
const IconInput = styled(Input)`
    padding-left: 2.5rem;
`;
const InputIcon = styled.div`
    position: absolute;
    top: 2.625rem;
    left: 0.75rem;
    color: #555;
`;
const Section = styled.div`
    border: 1px solid #ccc;
    border-radius: 0.6rem;
    padding: 0.94rem;
    background-color: #fff;
`;
const SectionHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 0.6rem;
`;
const EditButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
    display: flex;
    align-items: center;
    &:hover {
        color: #7c2256;
    }
`;
const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;
const Tag = styled.span`
    padding: 0.375rem 0.75rem;
    border-radius: 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
`;
const ColorPickerContent = styled.div`
    padding: 0.94rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
`;
const StyledColorInput = styled.input`
    width: 6.25rem;
    height: 6.25rem;
    border: none;
    background: none;
    cursor: pointer;
    -webkit-appearance: none;
    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    &::-webkit-color-swatch {
        border: 1px solid #ccc;
        border-radius: 50%;
    }
`;

// Função para verificar se a cor é muito clara
const isColorTooLight = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Fórmula para calcular a luminosidade percebida
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.9; // Retorna true se a cor for muito clara (próxima a 1)
};

function ConfigPerfil() {
    const { currentUser, userData, refreshUserData } = useAuth();
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        curso: '',
        bio: '',
        github: '',
        linkedin: '',
        avatarColor: '#0a528a',
    });

    const [tempAvatarColor, setTempAvatarColor] = useState(
        formData.avatarColor
    );
    const [isInteressesModalOpen, setIsInteressesModalOpen] = useState(false);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (userData) {
            const initialColor = userData.avatarColor || '#0a528a';
            setFormData({
                nome: userData.nome || '',
                sobrenome: userData.sobrenome || '',
                curso: userData.curso || '',
                bio: userData.bio || '',
                github: userData.github || '',
                linkedin: userData.linkedin || '',
                avatarColor: initialColor,
            });
            setTempAvatarColor(initialColor);
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleOpenColorModal = () => {
        setTempAvatarColor(formData.avatarColor);
        setIsColorModalOpen(true);
    };

    // FUNÇÃO ALTERADA PARA VALIDAR A COR E SALVAR IMEDIATAMENTE
    const handleConfirmColor = async () => {
        if (isColorTooLight(tempAvatarColor)) {
            addToast(
                'A cor escolhida é muito clara e pode não ser visível. Por favor, escolha uma cor mais escura.',
                'info'
            );
            return;
        }

        if (!currentUser) return;
        try {
            // 1. Salva a nova cor diretamente no banco de dados
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(
                userDocRef,
                { avatarColor: tempAvatarColor },
                { merge: true }
            );

            // 2. Atualiza os dados em toda a aplicação
            await refreshUserData();

            // 3. Fecha o modal
            setIsColorModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar a cor do avatar:', error);
            addToast(
                'Não foi possível salvar a nova cor. Tente novamente.',
                'error'
            );
        }
    };

    const handleCancelColor = () => {
        setIsColorModalOpen(false);
    };

    // Função para validar se a URL HTTP
    const isValidURL = (string) => {
        if (!string) return true; // Vazio (opcional)
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        // --- INÍCIO DA VALIDAÇÃO DE LINKS ---
        const { github, linkedin } = formData;

        // Valida GitHub: A URL deve conter "github.com"
        if (
            github &&
            (!isValidURL(github) ||
                !github.toLowerCase().includes('github.com'))
        ) {
            addToast(
                'Por favor, insira um link válido do GitHub (ex: https://github.com/seu-usuario).',
                'error'
            );
            return; // Para a execução
        }

        // Valida LinkedIn: deve ser URL válida e conter "linkedin.com/in/"
        if (
            linkedin &&
            (!isValidURL(linkedin) ||
                !linkedin.toLowerCase().includes('linkedin.com/in/'))
        ) {
            addToast(
                'Por favor, insira um link válido do LinkedIn (ex: https://linkedin.com/in/seu-usuario).',
                'error'
            );
            return;
        }

        setLoading(true);
        try {
            const batch = writeBatch(db);
            const uid = currentUser.uid;

            const userDocRef = doc(db, 'users', uid);
            batch.set(userDocRef, formData, { merge: true });

            const projetosRef = collection(db, 'projetos');
            const qProjetos = query(
                projetosRef,
                where('participantIds', 'array-contains', uid)
            );
            const projetosSnapshot = await getDocs(qProjetos);

            projetosSnapshot.docs.forEach((docProjeto) => {
                const dadosProjeto = docProjeto.data();
                const updates = {};
                let mudouAlgo = false;

                // Atualiza se for Dono
                if (dadosProjeto.donoId === uid) {
                    updates.donoNome = formData.nome;
                    updates.donoSobrenome = formData.sobrenome;
                    mudouAlgo = true;
                }

                // Atualiza array de participantes visual
                if (dadosProjeto.participantes) {
                    const novosParticipantes = dadosProjeto.participantes.map(
                        (p) => {
                            if (p.uid === uid) {
                                return {
                                    ...p,
                                    nome: formData.nome,
                                    sobrenome: formData.sobrenome,
                                };
                            }
                            return p;
                        }
                    );
                    updates.participantes = novosParticipantes;
                    mudouAlgo = true;
                }

                if (mudouAlgo) {
                    batch.update(docProjeto.ref, updates);
                }
            });

            const conversasRef = collection(db, 'conversas');
            const qConversas = query(
                conversasRef,
                where('participantes', 'array-contains', uid)
            );
            const conversasSnapshot = await getDocs(qConversas);

            conversasSnapshot.docs.forEach((docConversa) => {
                const dadosChat = docConversa.data();
                if (dadosChat.participantesInfo) {
                    const novosInfos = dadosChat.participantesInfo.map((p) => {
                        if (p.uid === uid) {
                            return {
                                ...p,
                                nome: formData.nome,
                                sobrenome: formData.sobrenome,
                            };
                        }
                        return p;
                    });
                    batch.update(docConversa.ref, {
                        participantesInfo: novosInfos,
                    });
                }
            });

            // Executa todas as mudanças de uma vez
            await batch.commit();

            await refreshUserData();
            addToast('Informações salvas com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar as informações:', error);
            addToast('Ocorreu um erro ao salvar. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (userData) {
            setFormData({
                nome: userData.nome || '',
                sobrenome: userData.sobrenome || '',
                curso: userData.curso || '',
                bio: userData.bio || '',
                github: userData.github || '',
                linkedin: userData.linkedin || '',
                avatarColor: userData.avatarColor || '#0a528a',
            });
        }
    };

    const todasAsTags = [
        ...(userData?.habilidades || []).map((h) => ({
            nome: h,
            tipo: 'habilidade',
        })),
        ...(userData?.interesses || []).map((i) => ({
            nome: i,
            tipo: 'interesse',
        })),
    ];

    return (
        <>
            <FormContainer>
                <ColunaEsquerda>
                    <Avatar $bgColor={formData.avatarColor}>
                        {getInitials(formData.nome, formData.sobrenome)}
                    </Avatar>
                    <BotaoTrocarCor
                        type="button"
                        onClick={handleOpenColorModal}
                    >
                        <FiEdit3 /> Cor do Avatar
                    </BotaoTrocarCor>
                </ColunaEsquerda>

                <FormContent onSubmit={handleSave}>
                    <ColunaInputs>
                        <InputRow>
                            <InputGroup>
                                <Label htmlFor="nome">Nome</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label htmlFor="sobrenome">Sobrenome</Label>
                                <Input
                                    id="sobrenome"
                                    name="sobrenome"
                                    value={formData.sobrenome}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </InputRow>
                        <InputGroup>
                            <Label htmlFor="curso">Curso</Label>
                            <Input
                                id="curso"
                                name="curso"
                                value={formData.curso}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="github" color="#000000">
                                GitHub<span>(opcional)</span>
                            </Label>
                            <InputIcon>
                                <FiGithub size={20} />
                            </InputIcon>
                            <IconInput
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/seu-usuario"
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="linkedin" color="#0072B1">
                                LinkedIn<span>(opcional)</span>
                            </Label>
                            <InputIcon>
                                <FiLinkedin size={20} color="#0072B1" />
                            </InputIcon>
                            <IconInput
                                id="linkedin"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/seu-usuario"
                            />
                        </InputGroup>
                    </ColunaInputs>

                    <ColunaInfo>
                        <InputGroup>
                            <Label htmlFor="bio">Sobre mim</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Meus Interesses</Label>
                            <Section>
                                <SectionHeader>
                                    <EditButton
                                        type="button"
                                        onClick={() =>
                                            setIsInteressesModalOpen(true)
                                        }
                                    >
                                        <FiEdit size={20} />
                                    </EditButton>
                                </SectionHeader>
                                <TagsContainer>
                                    {todasAsTags.length > 0 ? (
                                        todasAsTags.map((tag) => (
                                            <Tag
                                                key={tag.nome}
                                                $tipo={tag.tipo}
                                            >
                                                {tag.nome}
                                            </Tag>
                                        ))
                                    ) : (
                                        <p>Adicione seus interesses</p>
                                    )}
                                </TagsContainer>
                            </Section>
                        </InputGroup>
                    </ColunaInfo>

                    <BotoesFooter>
                        <Botao
                            variant="SalvarPerfil"
                            type="submit"
                            disabled={loading}
                        >
                            Salvar
                        </Botao>
                        <Botao
                            variant="CancelarPerfil"
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Botao>
                    </BotoesFooter>
                </FormContent>
            </FormContainer>

            <Modal
                isOpen={isInteressesModalOpen}
                onClose={() => setIsInteressesModalOpen(false)}
                size="hab-int"
            >
                <EditarInteressesModal
                    onSuccess={() => setIsInteressesModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isColorModalOpen}
                onClose={handleCancelColor}
                size="small"
            >
                <ColorPickerContent>
                    <h3>Escolha a cor do seu Avatar</h3>
                    <StyledColorInput
                        type="color"
                        value={tempAvatarColor}
                        onChange={(e) => setTempAvatarColor(e.target.value)}
                    />
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '1.25rem',
                        }}
                    >
                        <Botao variant="Cancelar" onClick={handleCancelColor}>
                            Cancelar
                        </Botao>
                        <Botao variant="Modal" onClick={handleConfirmColor}>
                            Confirmar
                        </Botao>
                    </div>
                </ColorPickerContent>
            </Modal>
        </>
    );
}

export default ConfigPerfil;
