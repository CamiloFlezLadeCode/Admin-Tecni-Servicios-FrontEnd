import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarInformacionUsuarioActivo = async (datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.gestionycontrol.cuenta.actualizar_informacion_usuario_activo, datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar la información del usuario activo");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};