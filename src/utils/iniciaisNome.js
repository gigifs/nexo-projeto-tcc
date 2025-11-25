export const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';

    const nomeLimpo = nome.trim();

    // CENÁRIO 1: Sobrenome foi passado explicitamente (Ex: userData.nome, userData.sobrenome)
    if (sobrenome) {
        const sobrenomeLimpo = sobrenome.trim();
        if (sobrenomeLimpo.length > 0) {
            return `${nomeLimpo[0]}${sobrenomeLimpo[0]}`.toUpperCase();
        }
    }

    // CENÁRIO 2: Apenas o nome foi passado, pode conter espaços (Ex: "Giovanna Freitas")
    const partes = nomeLimpo.split(/\s+/);

    if (partes.length >= 2) {
        // Pega a primeira letra do primeiro nome e a primeira do segundo nome
        return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }

    // CENÁRIO 3: Nome único (Ex: "Giovanna") -> Retorna as 2 primeiras letras
    return nomeLimpo.substring(0, 2).toUpperCase();
};