// Lista de cores
const CORES_PROJETO = [
    '#0A528A', // Azul Institucional 
    '#7C2256', // Vinho/Roxo Institucional
    '#2C8AED', // Azul Vibrante 
    '#6B74DB', // Roxo Azulado 
    '#D757B4', // Rosa Orquídea 
    '#0097A7', // Ciano Escuro
    '#00796B', // Verde Azulado
    '#43A047', // Verde Natureza
    '#FB8C00', // Laranja Suave
    '#E64A19', // Laranja Queimado
    '#5D4037', // Marrom Café
    '#455A64', // Azul Acinzentado
    '#512DA8', // Roxo Profundo
    '#C2185B', // Rosa Escuro
    '#0288D1', // Azul Oceano
];

export const gerarCorAleatoria = () => {
    const indice = Math.floor(Math.random() * CORES_PROJETO.length);
    return CORES_PROJETO[indice];
};

export const gerarCorPorNome = (str) => {
    return '#0a528a'; // Padrão para quem não tem cor definida
};