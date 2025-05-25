import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const CrearVehiculo = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.vehiculos.crearvehiculo, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el vehículo");
        throw error;
    }
}