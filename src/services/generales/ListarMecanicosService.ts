import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const listarmecanicos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarmecanicos);
        return data;
    } catch (error: any) {
        console.log(`Error al listar los mecánicos`);
        throw new Error(`${error.response.data.error}`);
    }
};