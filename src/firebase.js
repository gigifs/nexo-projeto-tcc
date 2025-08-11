import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Importa o Firestore

const firebaseConfig = {
    apiKey: "AIzaSyAu2ytgbjm3ZxnL2RsW1wYIT3k8-XAw2Qg",
    authDomain: "teste-tcc-711f8.firebaseapp.com",
    projectId: "teste-tcc-711f8",
    storageBucket: "teste-tcc-711f8.firebasestorage.app",
    messagingSenderId: "602961631765",
    appId: "1:602961631765:web:27fed5fd8708bb926c8c1c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 2. Exporta a instância do banco de dados