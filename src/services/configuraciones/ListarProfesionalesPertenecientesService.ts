import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarProfesionalesPertenecientes = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.configuraciones.listar_profesionales_pertenecientes);
        return data;
    } catch (error) {
        console.log("Error al los profesionales pertenecientes");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};