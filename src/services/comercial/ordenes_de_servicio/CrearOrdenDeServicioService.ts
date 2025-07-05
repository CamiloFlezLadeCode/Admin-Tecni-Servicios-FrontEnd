import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearOrdenDeServicio = async (DatosOrdenDeServicio: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.comercial.ordenes_de_servicio.crear_orden_de_servicio, DatosOrdenDeServicio);
        return data;
    } catch (error: any) {
        console.log(`Error al crear la orden de servicio`);
        throw new Error(`${error.response.data.error}`);
    }
};