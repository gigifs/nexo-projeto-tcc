import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext'; // Hook para acessar o contexto
import Toast from './Toast'; // Componente que exibe um toast individual

const ContainerWrapper = styled.div`
    position: fixed; /* Fica fixo mesmo com scroll */
    bottom: 25px; /* Distância da borda inferior */
    right: 25px; /* Distância da borda direita */
    z-index: 9999; /* Garante que fique acima de outros elementos */
    display: flex;
    flex-direction: column; /* Empilha os toasts verticalmente */
    align-items: flex-end; /* Alinha os toasts à direita dentro do container */
`;

const ToastContainer = () => {
    // Pega a lista de 'toasts' e a função 'removeToast' do contexto
    const { toasts, removeToast } = useToast();

    return (
        <ContainerWrapper>
            {/* Mapeia (percorre) o array de toasts */}
            {toasts.map((toast) => (
                // Para cada objeto 'toast' no array, renderiza um componente <Toast />
                <Toast
                    key={toast.id} // Chave única obrigatória para listas no React
                    message={toast.message} // Passa a mensagem
                    type={toast.type} // Passa o tipo (success, error, info)
                    duration={toast.duration} // Passa a duração
                    // Passa a função que será chamada quando o toast fechar
                    // removeToast(toast.id) vai remover ESTE toast específico do contexto
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ContainerWrapper>
    );
};

export default ToastContainer;
