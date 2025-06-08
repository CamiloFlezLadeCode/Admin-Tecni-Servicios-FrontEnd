import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarEquipo = async (datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.gestionycontrol.equipos.actualizarequipo, datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar el equipo");
        throw error;
    }
};