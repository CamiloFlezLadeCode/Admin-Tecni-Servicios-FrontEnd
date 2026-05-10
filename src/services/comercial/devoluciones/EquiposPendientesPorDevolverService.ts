import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Parametros {
    IdProyecto?: number | null;
    DocumentoSubarrendatario: string;
    DocumentoCliente?: string;
}
export const equipos_pendientes_por_devolver = async ({ IdProyecto, DocumentoSubarrendatario, DocumentoCliente }: Parametros) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.equipos_pendientes_por_devolver, {
            params: {
                IdProyecto,
                DocumentoSubarrendatario,
                DocumentoCliente
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al consultar los equipos pendientes por devolver. Error: ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};
