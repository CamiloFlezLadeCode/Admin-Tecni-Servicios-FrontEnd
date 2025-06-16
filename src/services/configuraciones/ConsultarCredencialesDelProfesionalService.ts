import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarCredencialesDelProfesional = async (DocumentoProfesional: string) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.configuraciones.consultar_credenciales_del_profesional(DocumentoProfesional));
        return data;
    } catch (error) {
        console.log("Error al consultar las credenciales del profesional");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};