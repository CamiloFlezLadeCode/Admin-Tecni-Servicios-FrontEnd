import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearProyecto = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.proyectos.crear_proyecto, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el proyecto");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};