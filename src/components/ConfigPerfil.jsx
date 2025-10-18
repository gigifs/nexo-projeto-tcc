import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Botao from './Botao';
import Modal from './Modal';
import EditarInteressesModal from './EditarInteressesModal';
import { FiEdit, FiGithub, FiLinkedin } from 'react-icons/fi';

// Container principal (Layout original)
const FormContainer = styled.div`
    display: flex;
    background-color: #f5fafc;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
`;

// A coluna da esquerda com a cor de fundo cinza
const ColunaEsquerda = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    background-color: #e6ebf0;
    padding: 30px;
    flex-shrink: 0;
`;

const Avatar = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 60px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color: 0.3s ease;
`;

const BotaoTrocarCor = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    text-align: center;

    &:hover {
        text-decoration: underline;
        color: #000;
    }
`;

// Container para o restante do formulário (a parte branca da direita)
const FormContent = styled.form`
    flex-grow: 1;
    padding: 30px 40px;
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    gap: 35px;
`;

const ColunaInputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ColunaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const BotoesFooter = styled.div`
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
`;

// --- DEMAIS ESTILOS ---
const InputRow = styled.div`
    display: flex;
    gap: 20px;
`;
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    position: relative;
`;
const Label = styled.label`
    font-size: 18px;
    font-weight: 500;
    color: ${(props) => props.color || '#7c2256'};

    span {
        font-weight: 400;
        opacity: 0.7;
        font-size: 0.9em;
        margin-left: 8px;
    }
`;
const Input = styled.input`
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 12px 15px;
    font-size: 16px;
    font-weight: 400;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;
const Textarea = styled.textarea`
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 12px 15px;
    font-size: 16px;
    font-weight: 400;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 10px;
    outline: none;
    resize: vertical;
    min-height: 160px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
        border-color: #7c2256;
        box-shadow: 0 0 0 3px rgba(124, 34, 86, 0.2);
    }
`;
const IconInput = styled(Input)`
    padding-left: 40px;
`;
const InputIcon = styled.div`
    position: absolute;
    top: 42px;
    left: 12px;
    color: #555;
`;
const Section = styled.div`
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    background-color: #fff;
`;
const SectionHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
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
    gap: 8px;
`;
const Tag = styled.span`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    background-color: ${(props) =>
        props.$tipo === 'habilidade' ? '#4AACF266' : '#ff8eda66'};
    color: ${(props) => (props.$tipo === 'habilidade' ? '#234DD7' : '#FE3F85')};
`;
const ColorPickerContent = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;
const StyledColorInput = styled.input`
    width: 100px;
    height: 100px;
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

const getInitials = (nome, sobrenome) => {
    if (!nome) return '';
    return `${nome[0]}${sobrenome ? sobrenome[0] : ''}`.toUpperCase();
};

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
            alert(
                'A cor escolhida é muito clara e pode não ser visível. Por favor, escolha uma cor mais escura.'
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
            alert('Não foi possível salvar a nova cor. Tente novamente.');
        }
    };

    const handleCancelColor = () => {
        setIsColorModalOpen(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, formData, { merge: true });
            await refreshUserData();
            alert('Informações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar as informações:', error);
            alert('Ocorreu um erro ao salvar. Tente novamente.');
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
                        Troque sua cor aqui!
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
                                placeholder="Ex: http://github.com/seu-git"
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
                                placeholder="Ex: http://linkedin.com/in/seu-linkedin"
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
                    <div style={{ display: 'flex', gap: '15px' }}>
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