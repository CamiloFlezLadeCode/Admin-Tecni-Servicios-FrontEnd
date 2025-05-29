import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarTransportadores = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listartransportadores);
        return data;
    } catch (error) {
        console.log("Error al listar los transportadores");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};