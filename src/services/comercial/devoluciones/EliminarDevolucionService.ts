import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const EliminarDevolucion = async (IdDevolucion: number) => {
    try {
        const { data } = await axiosInstance.delete(apiRoutes.comercial.devoluciones.eliminar_devolucion, {
            params: {
                IdDevolucion: IdDevolucion
            }
        });
        return data;
    } catch (error: any) {
        console.log(`variable`);
        throw new Error(`${error.response.data.error}`);
    }
};