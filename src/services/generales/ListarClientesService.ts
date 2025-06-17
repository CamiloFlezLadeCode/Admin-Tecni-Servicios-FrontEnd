import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarClientes = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarclientes);
        return data;
    } catch (error) {
        console.log("Error al listar los clientes");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};