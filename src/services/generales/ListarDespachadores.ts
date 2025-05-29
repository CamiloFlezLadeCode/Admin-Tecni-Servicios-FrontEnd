import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarDespachadores = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listardespachadores);
        return data;
    } catch (error) {
        console.log("Error al listar los despachadores");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};