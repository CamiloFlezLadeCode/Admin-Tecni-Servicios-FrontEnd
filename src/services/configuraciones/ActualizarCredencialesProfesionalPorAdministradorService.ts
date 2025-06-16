import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarCredencialesProfesionalPorAdministrador = async (datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.configuraciones.actualizar_credenciales_profesional_por_administrador, datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar las credenciales del profesional");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};