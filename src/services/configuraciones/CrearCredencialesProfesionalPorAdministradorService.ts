import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const CrearCredencialesProfesionalPorAdministrador = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.configuraciones.crear_credenciales_profesional_por_administrador, datos);
        return data;
    } catch (error) {
        console.log("Error al crear las credenciales del profesional");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};