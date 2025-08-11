import React, { createContext, useState, useEffect, useContext } from 'react'; // importante: useEffect é para interagir com sistemas externos - Firebase
import { onAuthStateChanged } from 'firebase/auth'; // função de autenticação em tempo real
import { auth, db } from '../firebase'; // aqui sao as instancias de autenticação e banco de dados
import { doc, getDoc } from 'firebase/firestore'; // ferramentas que leem dados para o firebase

// a criação do contexto, como um armazém de dados ainda vazio
const AuthContext = createContext();

// aqui é um hook customizado para facilitar o uso
// segundo o gemini é um padrão profissional invés de importar useContext e AuthContext em todo componente
export function useAuth() {
  return useContext(AuthContext);
}

// componente provedor, responsavel por gerenciar a logica e dar os dados para o nosso contexto
export function AuthProvider({ children }) { // children significa qualquer componente ou código sera abraçado
  const [currentUser, setCurrentUser] = useState(null); // guarda uid, email e verificação do email
  const [userData, setUserData] = useState(null); // guarda dados do perfil
  const [loading, setLoading] = useState(true); // estado de carregamento para evitar que a tela pisque conteudo errado

  // é o hook que atualiza a tela em real
  useEffect(() => {
    //instala um "ouvinte" que dispara a função sempre que o estado de login mudar
    const unsubscribe = onAuthStateChanged(auth, async user => { // async significa que vamos buscar dados no banco
      setCurrentUser(user); //atualiza o estado com a informação do banco em user(ou um usuario ou null)

      // logica para buscar dados do perfil
      if (user) { // Se um usuário está logado
        // cria uma referencia ao documento do usuario usando o UID para encontra-lo na coleçao
        const userDocRef = doc(db, "users", user.uid);
        // faz uma copia do documento
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) { // Se o documento existe
          // guarda os dados nesse novo estado
          setUserData(userDocSnap.data());
        } else {
          // se o documento nao foi encontrado, o estado é limpo
          setUserData(null);
        }
      } else {
        // se não há usuário, o estado é limpo
        setUserData(null);
      }

      setLoading(false); // nessa altura ja temos uma resposta definitiva do status do usuario, por isso false
    });

    return unsubscribe; // limpa o ouvinte quando ele for removido da tela, previne vazamento de memoria
  }, []); // [] = garante que o trecho so seja executado uma vez

  // cria um objeto e agrupa todos os dados que vamos compartilhar com o resto da aplicação
  const value = {
    currentUser,
    userData
  };

  // se nao estiver carregando, mostra o resto da aplicação. evita a tela piscar
  // finalmente ele passa o objeto para o nosso contexto
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}