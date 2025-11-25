export const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';

    const nomeLimpo = nome.trim();

    if (sobrenome) {
        const sobrenomeLimpo = sobrenome.trim();
        if (sobrenomeLimpo.length > 0) {
            return `${nomeLimpo[0]}${sobrenomeLimpo[0]}`.toUpperCase();
        }
    }

    const partes = nomeLimpo.split(/\s+/);

    if (partes.length >= 2) {
        // Pega a primeira letra do primeiro nome e a primeira do segundo nome
        return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }

    return nomeLimpo.substring(0, 2).toUpperCase();
};