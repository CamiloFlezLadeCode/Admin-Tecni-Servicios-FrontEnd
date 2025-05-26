import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarVehiculo = async (datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.vehiculos.actualizarvehiculo, datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar el vehículo");
        throw error;
    }
};