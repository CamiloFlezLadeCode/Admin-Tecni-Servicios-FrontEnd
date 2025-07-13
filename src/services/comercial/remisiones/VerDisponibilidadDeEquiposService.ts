import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Parametros {
    IdCategoria: number;
    DocumentoSubarrendatario: string;
}
export const VerDisponibilidadDeEquipos = async ({ IdCategoria, DocumentoSubarrendatario }: Parametros) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.ver_disponibilidad_de_equipos, {
            params: {
                IdCategoria,
                DocumentoSubarrendatario
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al ver la disponibilidad de los equipos`);
        throw new Error(`${error.response.data.error}`);
    }
};