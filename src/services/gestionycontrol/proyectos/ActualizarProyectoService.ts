import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarProyecto = async (Datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.gestionycontrol.proyectos.actualizar_proyecto, Datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar el proyecto");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};