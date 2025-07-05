import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarSiguienteNoOrdenDeServicio = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.ordenes_de_servicio.consultar_siguiente_no_orden_de_servicio);
        return data;
    } catch (error: any) {
        console.log(`Error al consultar el siguiente número de orden de servicio.`);
        throw new Error(`${error.response.data.error}`);
    }
};