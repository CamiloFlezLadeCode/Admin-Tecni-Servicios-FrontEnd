import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearDevolucion = async (Datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.comercial.devoluciones.creardevolucion, Datos);
        return data;
    } catch (error: any) {
        console.log(`Error al crear la devolución...`);
        throw new Error(`${error.response.data.error}`);
    }
};