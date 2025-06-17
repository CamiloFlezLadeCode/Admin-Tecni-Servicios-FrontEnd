import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarProyectos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.proyectos.ver_todos_los_proyectos);
        return data;
    } catch (error) {
        console.log("Error al consultar los proyectos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};