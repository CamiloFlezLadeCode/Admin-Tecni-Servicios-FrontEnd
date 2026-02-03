import { Estado, EstadoColor } from '@/types/estadoColoresType';

export const estadoColores: Record<Estado, EstadoColor> = {
    // ✅ success - Estados positivos/operativos
    'Activo': 'success',
    'Disponible': 'success',
    'Buen estado': 'success',
    'Completo': 'success',
    'Nuevo': 'success',
    'Creado': 'success',

    // ⚠️ warning - Estados que requieren atención
    'Pendiente': 'warning',
    'Enviado': 'warning',
    'Reparación': 'warning',
    'Usado / Segunda': 'warning',

    // ❌ error - Estados problemáticos/inactivos
    'Anulado': 'error',
    'Dañado': 'error',
    'De baja': 'error',
    'Eliminado': 'error',
    'Inactivo': 'error',
    'No disponible': 'error',
    'Perdido': 'error',

    // ℹ️ info - Estados informativos/transicionales
    'Actualizado': 'info',
    'Facturado': 'info',
    'Modificado': 'info',
};