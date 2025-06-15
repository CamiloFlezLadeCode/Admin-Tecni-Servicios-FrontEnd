import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarCredencialesUsuarioActivo = async (Datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.gestionycontrol.ajustes.actualizar_credenciales_usuario_activo, Datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar las credenciales del usuario activo");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};