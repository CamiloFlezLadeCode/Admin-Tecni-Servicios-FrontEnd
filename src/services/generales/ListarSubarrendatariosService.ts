import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarSubarrendatarios = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarsubarrendatarios);
        return data;
    } catch (error) {
        console.log("Error al listar los subarrendatarios");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};