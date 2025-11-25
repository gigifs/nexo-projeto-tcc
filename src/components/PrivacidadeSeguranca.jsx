import { useState } from 'react';
import styled from 'styled-components';
import Botao from './Botao';
import Modal from './Modal';
import FormularioExcluirConta from './FormularioExcluirConta';
import { useAuth } from '../contexts/AuthContext';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    deleteUser,
} from 'firebase/auth';
import { db } from '../firebase';
import {
    doc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { useToast } from '../contexts/ToastContext';
import { FiMail, FiLock } from 'react-icons/fi';

const LayoutContainer = styled.div`
    background-color: #f5fafc;
    border-radius: 1.25rem;
    padding: 2.5rem 10rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 11.25rem;

    @media (max-width: 1600px) {
        padding: 2.5rem 5rem;
        gap: 3.75rem;
    }

    @media (max-width: 1400px) {
        padding: 0.95rem 1.875rem;
        gap: 1.875rem;
    }

    @media (max-width: 1024px) {
        padding: 1.875rem;
        gap: 2.5rem;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 1.56rem;
        gap: 1.875rem;
    }
`;

const Coluna = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Secao = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const TituloSecao = styled.h3`
    font-size: 1.25rem;
    font-weight: 500;
    color: #7c2256;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-weight: 500;
    font-size: 1.125rem;
    color: #0a528a;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
`;

const Input = styled.input`
    background-color: #f5fafc;
    padding: 0.75rem 0.95rem;
    font-size: 1rem;
    font-weight: 400;
    color: #333333;
    border: 1px solid #00000060;
    border-radius: 0.6rem;
    outline: none;
    margin: 0;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;

    &::placeholder {
        color: #999999;
        opacity: 1;
    }

    &:focus {
        border-color: #5b82e9;
        box-shadow: 0 0 0 3px #5b82e948;
    }
`;

const InfoBox = styled.div`
    background-color: #e0575a33;
    color: #000000ff;
    border: 1px solid #00000066;
    padding: 1.25rem;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    line-height: 1.2;
    font-weight: 400;

    b {
        font-weight: 500;
    }
`;

const Mensagem = styled.p`
    font-size: 0.875rem;
    text-align: left;
    min-height: 1.25rem;
    color: ${(props) => (props.$sucesso ? 'green' : 'red')};
    margin: 0.5rem 0 0 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        padding: 0.6rem;
    }
`;

function PrivacidadeSeguranca() {
    const { currentUser, logout } = useAuth();

    // ESTADOS PARA O FORMULÁRIO DE ALTERAR SENHA
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loadingSenha, setLoadingSenha] = useState(false);
    const [mensagemSenha, setMensagemSenha] = useState('');
    const [sucessoSenha, setSucessoSenha] = useState(false);

    // ESTADOS PARA O MODAL DE EXCLUSÃO
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { addToast } = useToast();

    const limparMensagem = () => {
        setTimeout(() => {
            setMensagemSenha('');
        }, 5000);
    };

    const handleAlterarSenha = async (evento) => {
        evento.preventDefault();
        setMensagemSenha('');

        if (novaSenha !== confirmarSenha) {
            setSucessoSenha(false);
            setMensagemSenha('A nova senha e a confirmação não coincidem.');
            return;
        }
        if (novaSenha.length < 6) {
            setSucessoSenha(false);
            setMensagemSenha('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoadingSenha(true);

        try {
            const credencial = EmailAuthProvider.credential(
                currentUser.email,
                senhaAtual
            );
            await reauthenticateWithCredential(currentUser, credencial);
            await updatePassword(currentUser, novaSenha);

            setSucessoSenha(true);
            setMensagemSenha('Senha atualizada com sucesso!');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            setSucessoSenha(false);
            if (error.code === 'auth/wrong-password') {
                setMensagemSenha('A senha atual está incorreta.');
            } else {
                setMensagemSenha('Ocorreu um erro. Tente novamente.');
            }
        } finally {
            setLoadingSenha(false);
            limparMensagem();
        }
    };

    const handleConfirmarExclusao = async (senhaParaExcluir) => {
        setDeleteError('');
        if (!senhaParaExcluir) {
            setDeleteError('Você precisa digitar sua senha para confirmar.');
            return;
        }

        setDeleteLoading(true);

        try {
            const credencial = EmailAuthProvider.credential(
                currentUser.email,
                senhaParaExcluir
            );
            await reauthenticateWithCredential(currentUser, credencial);

            const uid = currentUser.uid;
            const projetosRef = collection(db, 'projetos');
            const conversasRef = collection(db, 'conversas');

            const qDono = query(projetosRef, where('donoId', '==', uid));
            const snapshotDono = await getDocs(qDono);

            for (const projetoDoc of snapshotDono.docs) {
                const qChatProjeto = query(
                    conversasRef,
                    where('projetoId', '==', projetoDoc.id)
                );
                const snapChat = await getDocs(qChatProjeto);
                const deleteChatsPromises = snapChat.docs.map((c) =>
                    deleteDoc(c.ref)
                );
                await Promise.all(deleteChatsPromises);

                const candidaturasRef = collection(
                    db,
                    'projetos',
                    projetoDoc.id,
                    'candidaturas'
                );
                const snapCand = await getDocs(candidaturasRef);
                const deleteCandPromises = snapCand.docs.map((c) =>
                    deleteDoc(c.ref)
                );
                await Promise.all(deleteCandPromises);

                await deleteDoc(projetoDoc.ref);
            }

            const qParticipante = query(
                projetosRef,
                where('participantIds', 'array-contains', uid)
            );
            const snapshotParticipante = await getDocs(qParticipante);

            for (const projetoDoc of snapshotParticipante.docs) {
                const dados = projetoDoc.data();

                const novosParticipantes = (dados.participantes || []).filter(
                    (p) => p.uid !== uid
                );
                const novosParticipantIds = (dados.participantIds || []).filter(
                    (id) => id !== uid
                );

                await updateDoc(projetoDoc.ref, {
                    participantes: novosParticipantes,
                    participantIds: novosParticipantIds,
                });

                const qChat = query(
                    conversasRef,
                    where('projetoId', '==', projetoDoc.id)
                );
                const snapChat = await getDocs(qChat);

                if (!snapChat.empty) {
                    const chatDoc = snapChat.docs[0];
                    const chatData = chatDoc.data();

                    const novosPartChat = (chatData.participantes || []).filter(
                        (id) => id !== uid
                    );
                    const novosPartInfoChat = (
                        chatData.participantesInfo || []
                    ).filter((p) => p.uid !== uid);

                    const newUnread = { ...chatData.unreadCounts };
                    delete newUnread[uid];

                    await updateDoc(chatDoc.ref, {
                        participantes: novosPartChat,
                        participantesInfo: novosPartInfoChat,
                        unreadCounts: newUnread,
                    });
                }
            }

            const qPrivadas = query(
                conversasRef,
                where('isGrupo', '==', false),
                where('participantes', 'array-contains', uid)
            );
            const snapshotPrivadas = await getDocs(qPrivadas);

            const deletePrivadasPromises = snapshotPrivadas.docs.map((doc) =>
                deleteDoc(doc.ref)
            );
            await Promise.all(deletePrivadasPromises);

            const minhasCandidaturasRef = collection(
                db,
                'users',
                uid,
                'minhasCandidaturas'
            );
            const snapMinhasCand = await getDocs(minhasCandidaturasRef);
            const deleteMinhasCandPromises = snapMinhasCand.docs.map((c) =>
                deleteDoc(c.ref)
            );
            await Promise.all(deleteMinhasCandPromises);

            const userDocRef = doc(db, 'users', uid);
            await deleteDoc(userDocRef);

            await deleteUser(currentUser);

            addToast('Sua conta e todos os dados foram excluídos.', 'success');
            setShowDeleteModal(false);
            await logout();
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
            if (
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/invalid-credential' ||
                error.code === 'auth/invalid-login-credentials'
            ) {
                setDeleteError('A senha está incorreta.');
            } else {
                setDeleteError(
                    'Erro ao limpar dados. Verifique permissões ou tente novamente.'
                );
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <LayoutContainer>
            <Coluna>
                <Secao>
                    <TituloSecao>
                        <FiMail size={20} /> E-mail
                    </TituloSecao>
                    <Input value={currentUser?.email || ''} disabled />
                </Secao>

                <form onSubmit={handleAlterarSenha}>
                    <Secao>
                        <TituloSecao>
                            <FiLock size={20} /> Alterar Senha
                        </TituloSecao>
                        <InputGroup>
                            <Label>Senha Atual</Label>
                            <Input
                                type="password"
                                placeholder="Digite aqui a senha atual"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Nova Senha</Label>
                            <Input
                                type="password"
                                placeholder="Digite aqui sua nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Confirme sua nova senha</Label>
                            <Input
                                type="password"
                                placeholder="Confirme aqui sua nova senha"
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(e.target.value)
                                }
                                required
                            />
                        </InputGroup>

                        <div style={{ marginTop: '0.75rem' }}>
                            <Botao
                                variant="hab-int"
                                type="submit"
                                disabled={loadingSenha}
                            >
                                {loadingSenha ? 'A atualizar...' : 'Atualizar'}
                            </Botao>
                        </div>
                        <Mensagem $sucesso={sucessoSenha}>
                            {mensagemSenha}
                        </Mensagem>
                    </Secao>
                </form>
            </Coluna>

            <Coluna>
                <Secao>
                    <TituloSecao>Transparência</TituloSecao>
                    <InfoBox>
                        Seja bem-vindo(a) ao seu <b>Centro de Privacidade</b>.
                        Aqui, você pode controlar facilmente suas configurações
                        de privacidade. No NEXO, sua privacidade é levada a
                        sério. O NEXO está empenhado em proteger seus dados
                        pessoais em nosso site. Visite nossa{' '}
                        <b>Política de Privacidade</b> para saber mais sobre o
                        processamento dos seus dados. Enquanto usuário, você
                        pode exercer seus direitos em relação aos seus dados
                        pessoais a qualquer momento (acesso, exclusão,
                        retificação, oposição, restrição). Visite nossa{' '}
                        <b>Página de Ajuda</b> para saber mais.
                    </InfoBox>
                </Secao>
                <Secao>
                    <TituloSecao>Gerenciamento de Conta</TituloSecao>
                    <ButtonContainer>
                        <Botao
                            variant="excluir"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Excluir Conta
                        </Botao>
                    </ButtonContainer>
                </Secao>
            </Coluna>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                size="excluir"
            >
                <FormularioExcluirConta
                    onConfirmDelete={handleConfirmarExclusao}
                    onClose={() => setShowDeleteModal(false)}
                    error={deleteError}
                    loading={deleteLoading}
                />
            </Modal>
        </LayoutContainer>
    );
}

export default PrivacidadeSeguranca;
