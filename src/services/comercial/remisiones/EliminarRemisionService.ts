import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const EliminarRemision = async (IdRemision: number) => {
    try {
        const { data } = await axiosInstance.delete(apiRoutes.comercial.remisiones.eliminar_remision, {
            params: {
                IdRemision: IdRemision
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al eliminar la remisión`);
        throw new Error(`${error.response.data.error}`);
    }
};