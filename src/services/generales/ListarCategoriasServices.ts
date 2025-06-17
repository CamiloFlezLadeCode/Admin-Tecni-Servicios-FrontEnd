import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarCategorias = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarcategorias);
        return data;
    } catch (error) {
        console.log("Error al listar las categorias");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};