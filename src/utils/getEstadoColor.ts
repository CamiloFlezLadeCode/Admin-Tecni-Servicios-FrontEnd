import { estadoColores } from '@/lib/constants/estadoColores';
import { isEstado } from '@/utils/isEstado';

export const getEstadoColor = (estado: string) => {
    if (isEstado(estado)) {
        return estadoColores[estado] || 'default';
    }
    return 'default';
}