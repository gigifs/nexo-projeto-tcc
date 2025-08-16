import styled from 'styled-components';
import { FaHome, FaSearch, FaBriefcase, FaComment, FaCog } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const BarraLateralEstilizado = styled.aside`
  width: 360px;
  height: 427px;
  background-color: #fff;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  box-shadow: 0 4px 10px 2px rgba(180, 100, 190, 0.4);
  padding: 16px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 40px;
  top: 110px;
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
  background-color: #1976D2;
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
  background-color: ${({ ativo }) => (ativo ? '#E6F0FA' : 'transparent')};
  color: ${({ ativo }) => (ativo ? '#1976D2' : '#000')};
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  padding-left: 27px;

  &:hover {
    background-color: #E6F0FA;
    color: #1976D2;
  }
`;

function BarraLateral() {
  const { userData } = useAuth();

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <BarraLateralEstilizado>
      <PerfilEstilizado>
        <Avatar>{userData ? getInitials(userData.nome) : 'US'}</Avatar>
        <PerfilInfo>
          <Nome>{userData?.nome || 'Nome'}</Nome>
          <Curso>{userData?.curso || 'Curso não informado'}</Curso>
        </PerfilInfo>
      </PerfilEstilizado>

      <MenuLista>
        <MenuItem><FaHome size={24} /> Home</MenuItem>
        <MenuItem><FaSearch size={24} /> Buscar Projetos</MenuItem>
        <MenuItem><FaBriefcase size={24} /> Meus Projetos</MenuItem>
        <MenuItem><FaComment size={24} /> Mensagens</MenuItem>
        <MenuItem><FaCog size={24} /> Configurações</MenuItem>
      </MenuLista>
    </BarraLateralEstilizado>
  );
}

export default BarraLateral;
