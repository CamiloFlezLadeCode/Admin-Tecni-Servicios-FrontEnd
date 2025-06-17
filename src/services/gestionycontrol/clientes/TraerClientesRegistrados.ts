import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const TraerClientes = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.clientes.consultar_todos_los_clientes);
        return data;
    } catch (error) {
        console.log("Error al consultar los clientes");
        throw error;
    }
};