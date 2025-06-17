import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarMecanicos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.mecanicos.ver_todos_los_mecanicos);
        return data;
    } catch (error) {
        console.log("Error al consultar los mecánicos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};