import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Prop {
    IdTipoBodega: number;
}
export const ListarBodegasPorTipo = async (valores: Prop) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarbodegasporsubarrendatario, {
            params: {
                IdTipoBodega: valores.IdTipoBodega
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Hubo un error al consultar las bodegas del subarrendatario con documento. ${valores.IdTipoBodega}. Detalles: ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};