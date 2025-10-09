import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react'; // importante: useEffect é para interagir com sistemas externos - Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth'; // função de autenticação em tempo real
import { auth, db } from '../firebase'; // aqui sao as instancias de autenticação e banco de dados
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // ferramentas que leem dados para o firebase

// a criação do contexto, como um armazém de dados ainda vazio
const AuthContext = createContext();

// aqui é um hook customizado para facilitar o uso
// segundo o gemini é um padrão profissional invés de importar useContext e AuthContext em todo componente
export function useAuth() {
    return useContext(AuthContext);
}

// componente provedor, responsavel por gerenciar a logica e dar os dados para o nosso contexto
export function AuthProvider({ children }) {
    // children significa qualquer componente ou código sera abraçado
    const [currentUser, setCurrentUser] = useState(null); // guarda uid, email e verificação do email
    const [userData, setUserData] = useState(null); // guarda dados do perfil
    const [loading, setLoading] = useState(true); // estado de carregamento para evitar que a tela pisque conteudo errado

    // logica de busca extraida para ser reutilizavel
    const fetchUserData = useCallback(async (user) => {
        // logica para buscar dados do perfil
        if (user) {
            // Se um usuário está logado
            // cria uma referencia ao documento do usuario usando o UID para encontra-lo na coleçao
            const userDocRef = doc(db, 'users', user.uid);
            // faz uma copia do documento
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                // Se o documento existe
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
    }, []);

    // é o hook que atualiza a tela em real
    useEffect(() => {
        //instala um "ouvinte" que dispara a função sempre que o estado de login mudar
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // async significa que vamos buscar dados no banco
            setCurrentUser(user); //atualiza o estado com a informação do banco em user(ou um usuario ou null)
            // atualiza o status do usuário para online
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(
                    userDocRef,
                    {
                        status: {
                            online: true,
                            vistoPorUltimo: serverTimestamp(),
                        },
                    },
                    { merge: true }
                );
            }
            await fetchUserData(user); // Chama a função centralizada
            setLoading(false); // nessa altura ja temos uma resposta definitiva do status do usuario, por isso false
        });

        return unsubscribe; // limpa o ouvinte quando ele for removido da tela, previne vazamento de memoria
    }, []); // [] = garante que o trecho so seja executado uma vez

    // função de logout
    const logout = async () => {
        try {
            // atualiza o status do usuario para offline ao deslogar
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                await setDoc(
                    userDocRef,
                    {
                        status: {
                            online: false,
                            vistoPorUltimo: serverTimestamp(),
                        },
                    },
                    { merge: true }
                );
            }
            await signOut(auth); // Desconecta do Firebase
            // Limpa a nossa chave de persistência
            localStorage.removeItem('firebasePersistence');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // cria um objeto e agrupa todos os dados que vamos compartilhar com o resto da aplicação
    const value = {
        currentUser,
        userData,
        logout,
        refreshUserData: () => fetchUserData(currentUser),
    };

    // se nao estiver carregando, mostra o resto da aplicação. evita a tela piscar
    // finalmente ele passa o objeto para o nosso contexto
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
