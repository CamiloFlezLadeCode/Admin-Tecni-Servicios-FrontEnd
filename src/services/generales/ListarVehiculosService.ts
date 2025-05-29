import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarVehiculos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarvehiculos);
        return data;
    } catch (error) {
        console.log("Error al listar los vehículos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};