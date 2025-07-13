import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const EliminarOrdenDeServicio = async (IdOrdenDeServicio: number) => {
    try {
        const { data } = await axiosInstance.delete(apiRoutes.comercial.ordenes_de_servicio.eliminar_orden_de_servicio, {
            params: {
                IdOrdenDeServicio: IdOrdenDeServicio
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al eliminar la orden de servicio`);
        throw new Error(`${error.response.data.error}`);
    }
};