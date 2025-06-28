import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarProyectoPorId = async (IdProyecto: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.proyectos.ver_proyecto_por_id, {
            params: {
                IdProyecto: IdProyecto
            }
        });
        return data;
    } catch (error) {
        console.log("Error al consultar la información del proyecto");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};