import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarBodegasPorSubarrendatario = async (DocumentoSubarrendatario: string) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarbodegasporsubarrendatario, {
            params: {
                DocumentoSubarrendatario
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Hubo un error al consultar las bodegas del subarrendatario con documento. ${DocumentoSubarrendatario}. Detalles: ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};