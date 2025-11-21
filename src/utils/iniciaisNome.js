export const getInitials = (nome, sobrenome) => {
    if (!nome) return '?';
    if (sobrenome) {
        return `${nome[0]}${sobrenome[0]}`.toUpperCase();
    }
    const parts = nome.trim().split(/\s+/);
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
};