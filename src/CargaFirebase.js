import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './src/firebase.js';


const SEU_UID = 'Z6JIDewqGbaGQwsYSCHpUoEleCx2';
const OUTRO_UID = 'no1UUcqVDyaLZbsSERRJ9p55IFx2';


const usersData = {
    [SEU_UID]: {
        nome: 'Anthony',
        sobrenome: 'Teatro',
        curso: 'Ciência da Computação',
        email: 'anthony@cs.unicid.edu.br',
        habilidades: ['JavaScript', 'Python'],
        interesses: ['Iniciação Científica', 'Monitoria'],
    },
    [OUTRO_UID]: {
        nome: 'Giovanna',
        sobrenome: 'Freitas',
        curso: 'Ciência da Computação',
        email: 'giovanna@cs.unicid.edu.br',
        habilidades: ['COBOL', 'Java'],
        interesses: ['Pesquisa', 'Monitoria'],
    },
};

const tagsData = [
    { nome: 'JavaScript', tipo: 'habilidade' },
    { nome: 'Python', tipo: 'habilidade' },
    { nome: 'COBOL', tipo: 'habilidade' },
    { nome: 'Java', tipo: 'habilidade' },
    { nome: 'Iniciação Científica', tipo: 'interesse' },
    { nome: 'Monitoria', tipo: 'interesse' },
    { nome: 'Pesquisa', tipo: 'interesse' },
];

const projectsData = [
    {
        id: 'projeto01',
        nome: 'Título Projeto (Seu)',
        descricao: 'Breve descrição do projeto; Breve descrição do projeto; Breve descrição do projeto;',
        donoId: Z6JIDewqGbaGQwsYSCHpUoEleCx2,
        dono: 'Anthony',
        curso: 'Ciência da Computação',
        status: 'Aberto para Candidaturas',
        habilidades: ['JavaScript', 'Python'],
        interesses: [],
        participantIds: [Z6JIDewqGbaGQwsYSCHpUoEleCx2],
    },

    {
        id: 'projeto02',
        nome: 'Grupo Atlética',
        descricao: 'Breve descrição do projeto; Breve descrição do projeto; Breve descrição do projeto;',
        donoId: OUTRO_UID,
        dono: 'Giovanna',
        curso: 'Ciência da Computação',
        status: 'Aberto para Candidaturas',
        habilidades: ['COBOL'],
        interesses: ['Pesquisa'],
        participantIds: [no1UUcqVDyaLZbsSERRJ9p55IFx2, Z6JIDewqGbaGQwsYSCHpUoEleCx2],
    },

    {
        id: 'projeto03',
        nome: 'Título Projeto (Recomendado)',
        descricao: 'Breve descrição do projeto; Breve descrição do projeto; Breve descrição do projeto;',
        donoId: no1UUcqVDyaLZbsSERRJ9p55IFx2,
        dono: 'Giovanna',
        curso: 'Ciência da Computação',
        status: 'Aberto para Candidaturas',
        habilidades: ['Java'],
        interesses: ['Monitoria'],
        participantIds: [no1UUcqVDyaLZbsSERRJ9p55IFx2],
    },
];

async function carregarDados() {
    if (SEU_UID.includes('COLOQUE-O-UID') || OUTRO_UID.includes('COLOQUE-O-UID')) {
        console.error('ERRO: Por favor, substitua os UIDs de exemplo no arquivo CargaFirebase.js antes de rodar.');
        return;
    }

    console.log('Iniciando carga de dados no Firebase...');
    const batch = writeBatch(db);

    console.log('Adicionando usuários...');
    Object.keys(usersData).forEach((uid) => {
        const userRef = doc(db, 'users', uid);
        batch.set(userRef, usersData[uid]);
    });


    console.log('Adicionando tags...');
    tagsData.forEach((tag) => {
        const tagRef = doc(db, 'tags', tag.nome);
        batch.set(tagRef, tag);
    });

    console.log('Adicionando projetos...');
    projectsData.forEach((project) => {
        const projectRef = doc(db, 'projetos', project.id);
        batch.set(projectRef, project);
    });

    try {
        await batch.commit();
        console.log('✅ Carga de dados concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao realizar a carga de dados:', error);
    }
}

carregarDados();