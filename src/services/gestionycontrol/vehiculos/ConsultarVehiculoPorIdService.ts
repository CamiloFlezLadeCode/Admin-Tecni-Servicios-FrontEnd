import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarVehiculoPorId = async (IdVehiculo: string) => {
    if (!IdVehiculo) {
        throw new Error("El id del vehículo no puede estar vacío.");
    }
    try {
        const { data } = await axiosInstance.get(apiRoutes.vehiculos.consultarvehiculoporid(IdVehiculo));
        return data;
    } catch (error) {
        console.log("Error al consultar el vehículo con id: ", IdVehiculo, error);
        throw error;
    }
};