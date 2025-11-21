export const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        case 'Em Andamento':
            return { $color: '#786de080', $textColor: '#372b9cff' };
        case 'Concluido':
            return { $color: '', $textColor: '' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};