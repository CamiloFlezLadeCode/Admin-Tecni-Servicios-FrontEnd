import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerBodegas = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.bodegas.ver_bodegas);
        return data;
    } catch (error: any) {
        console.log(`Error al cargar las bodegas`);
        throw new Error(`${error.response.data.error}`);
    }
};