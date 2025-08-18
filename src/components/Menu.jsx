import { useState } from 'react';
import styled from 'styled-components';
import {
    FaHome,
    FaSearch,
    FaBriefcase,
    FaComment,
    FaCog,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const MenuEstilizado = styled.aside`
    width: 360px;
    height: 450px;
    background-color: #f5fafc;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    font-family: 'Roboto', sans-serif;
`;

const PerfilEstilizado = styled.div`
    width: 290px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 27px 0 24px 27px;
`;

const Avatar = styled.div`
    width: 60px;
    height: 60px;
    background-color: #1976d2;
    color: white;
    font-weight: bold;
    font-size: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PerfilInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const Nome = styled.span`
    font-weight: 600;
    font-size: 20px;
    color: #000;
`;

const Curso = styled.span`
    font-size: 16px;
    color: #777;
`;

const MenuLista = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const MenuItem = styled.li`
    display: flex;
    align-items: center;
    gap: 12px;
    height: 50px;
    border-radius: 20px;
    background-color: ${({ $ativo }) => ($ativo ? '#E6F0FA' : 'transparent')};
    color: ${({ $ativo }) => ($ativo ? '#1976D2' : '#000')};
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.2s;
    padding-left: 27px;

    &:hover {
        background-color: #e6f0fa;
        color: #1976d2;
    }
`;

function Menu() {
    const { userData } = useAuth();
    const [itemAtivo, setItemAtivo] = useState('Home');

    // 1. A função 'getInitials' foi corrigida
    const getInitials = (nome, sobrenome) => {
        if (!nome || !sobrenome) return '?';
        return `${nome[0]}${sobrenome[0]}`.toUpperCase();
    };

    return (
        <MenuEstilizado>
            <PerfilEstilizado>
                {/* 2. A chamada da função foi ajustada para passar nome E sobrenome */}
                <Avatar>{userData ? getInitials(userData.nome, userData.sobrenome) : 'US'}</Avatar>
                <PerfilInfo>
                    <Nome>{userData?.nome || 'Nome'}</Nome>
                    <Curso>{userData?.curso || 'Curso não informado'}</Curso>
                </PerfilInfo>
            </PerfilEstilizado>

            <MenuLista>
                <MenuItem
                    $ativo={itemAtivo === 'Home'}
                    onClick={() => setItemAtivo('Home')}
                >
                    <FaHome size={24} /> Home
                </MenuItem>
                <MenuItem
                    $ativo={itemAtivo === 'Buscar Projetos'}
                    onClick={() => setItemAtivo('Buscar Projetos')}
                >
                    <FaSearch size={24} /> Buscar Projetos
                </MenuItem>
                <MenuItem
                    $ativo={itemAtivo === 'Meus Projetos'}
                    onClick={() => setItemAtivo('Meus Projetos')}
                >
                    <FaBriefcase size={24} /> Meus Projetos
                </MenuItem>
                <MenuItem
                    $ativo={itemAtivo === 'Mensagens'}
                    onClick={() => setItemAtivo('Mensagens')}
                >
                    <FaComment size={24} /> Mensagens
                </MenuItem>
                <MenuItem
                    $ativo={itemAtivo === 'Configurações'}
                    onClick={() => setItemAtivo('Configurações')}
                >
                    <FaCog size={24} /> Configurações
                </MenuItem>
            </MenuLista>
        </MenuEstilizado>
    );
}

export default Menu;