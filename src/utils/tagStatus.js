export const getStatusStyle = (status) => {
    switch (status) {
        case 'Novo':
            return { $color: '#FFE0B2', $textColor: '#E65100' };
        case 'Em Andamento':
            return { $color: '#786de080', $textColor: '#372b9cff' };
        case 'Concluído':
            return { $color: '#c3ebb7ff', $textColor: '#1c9a0cff' };
        default:
            return { $color: '#e0e0e0', $textColor: '#000' };
    }
};