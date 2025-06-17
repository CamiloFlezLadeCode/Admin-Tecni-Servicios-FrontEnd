import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarRoles = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarroles);
        return data;
    } catch (error) {
        console.log("Error al listar los roles");
        throw error;
    }
};