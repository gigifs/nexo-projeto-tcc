import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FiSearch } from 'react-icons/fi';

const ColunaEsquerda = styled.div`
    width: 450px;
    border-radius: 20px;
    padding: 30px 50px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const BuscaContainer = styled.div`
    position: relative;
    width: 100%;
`;

const BuscaIcone = styled(FiSearch)`
    position: absolute;
    left: 15px;
    top: 50%;

    transform: translateY(-55%);
    color: #999;
    stroke-width: 3px;
`;

const BuscaInput = styled.input`
    width: 100%;
    padding: 12px 15px 12px 50px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    font-size: 16px;
    font-weight: 400;
    outline: none;
`;

const ContainerAbas = styled.div`
    width: 100%;
    background-color: #f5fafc;
    padding: 0 10px;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    gap: 30px;
`;

const Aba = styled.button`
    position: relative;
    padding: 12px 40px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    color: #000000ff; /* Cor padrão para inativo */
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;

    &:hover {
        color: #7c2256; /* Cor roxa no hover */
        font-weight: 600;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 2px; /* A espessura da linha */
        background-color: #7c2256;

        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    &.active {
        color: #7c2256;
        font-weight: 600;

        &::after {
            transform: scaleX(1); /* A linha expande para 100% da sua largura */
        }
    }
`;

const ListaScroll = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ItemConversa = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    background-color: #e6ebf0;
    border: 2px solid ${({ $ativo }) => ($ativo ? '#00000066' : 'transparent')};
    transition: all 0.2s ease-in-out;
`;

const Avatar = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || '#0a528a'};
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const InfoConversa = styled.div`
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const NomeConversa = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
`;

const UltimaMensagemContainer = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
`;

const RemetenteMensagem = styled.span`
    font-size: 14px;
    color: #333; /* Cor um pouco mais escura para destaque */
    font-weight: 500;
    margin-right: 4px; /* Espaço entre o nome e a mensagem */
    flex-shrink: 0; /* Impede que o nome do remetente seja espremido */
`;

const TextoUltimaMensagem = styled.span`
    font-size: 14px;
    color: #555;
    overflow: hidden; /* Garante que o texto da mensagem use a elipse */
    text-overflow: ellipsis;
`;

const BadgeNaoLido = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #19e337;
    color: white;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const getInitials = (name = '', sobrenome = '') => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

function ConversaLista({
    conversas,
    conversaAtivaId,
    onConversaSelect,
    busca,
    setBusca,
    abaAtiva,
    setAbaAtiva,
    getNomeConversa,
    getAvatarColorConversa,
}) {
    const { currentUser } = useAuth();

    const conversasFiltradas = conversas
        .filter((c) => (abaAtiva === 'grupos' ? c.isGrupo : !c.isGrupo))
        .filter((c) =>
            getNomeConversa(c).toLowerCase().includes(busca.toLowerCase())
        )
        .sort(
            (a, b) =>
                (b.ultimaMensagem?.timestamp?.toDate() || 0) -
                (a.ultimaMensagem?.timestamp?.toDate() || 0)
        );

    return (
        <ColunaEsquerda>
            <BuscaContainer>
                <BuscaIcone size={22} />
                <BuscaInput
                    placeholder="Buscar Conversas..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </BuscaContainer>
            <ContainerAbas>
                <Aba
                    className={abaAtiva === 'grupos' ? 'active' : ''}
                    onClick={() => setAbaAtiva('grupos')}
                >
                    Grupos
                </Aba>
                <Aba
                    className={abaAtiva === 'diretas' ? 'active' : ''}
                    onClick={() => setAbaAtiva('diretas')}
                >
                    Diretas
                </Aba>
            </ContainerAbas>
            <ListaScroll>
                {conversasFiltradas.map((conversa) => {
                    const unreadCount =
                        conversa.unreadCounts?.[currentUser.uid] || 0;
                    const nomeCompleto = getNomeConversa(conversa);
                    const [nome, ...sobrenomeArray] = nomeCompleto.split(' ');
                    const sobrenome = sobrenomeArray.join(' ');

                    return (
                        <ItemConversa
                            key={conversa.id}
                            $ativo={conversa.id === conversaAtivaId}
                            onClick={() => onConversaSelect(conversa.id)}
                        >
                            <Avatar $bgColor={getAvatarColorConversa(conversa)}>
                                {getInitials(nome, sobrenome)}
                            </Avatar>
                            <InfoConversa>
                                <NomeConversa>{nomeCompleto}</NomeConversa>
                                {conversa.ultimaMensagem && (
                                    <UltimaMensagemContainer>
                                        <RemetenteMensagem>
                                            {
                                                conversa.ultimaMensagem.senderNome?.split(
                                                    ' '
                                                )[0]
                                            }
                                            :
                                        </RemetenteMensagem>
                                        <TextoUltimaMensagem>
                                            {conversa.ultimaMensagem.texto}
                                        </TextoUltimaMensagem>
                                    </UltimaMensagemContainer>
                                )}
                            </InfoConversa>
                            {unreadCount > 0 && (
                                <BadgeNaoLido>{unreadCount}</BadgeNaoLido>
                            )}
                        </ItemConversa>
                    );
                })}
            </ListaScroll>
        </ColunaEsquerda>
    );
}

export default ConversaLista;
