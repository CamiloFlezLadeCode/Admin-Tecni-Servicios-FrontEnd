import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarNiveles = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarniveles);
        return data;
    } catch (error) {
        console.log("Error al listar los niveles");
        throw error;
    }
};