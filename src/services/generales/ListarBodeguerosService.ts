import axiosInstance from "@/lib/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarBodegueros = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarbodegueros);
        return data;
    } catch (error) {
        console.log("Error al listar los bodegueros");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};