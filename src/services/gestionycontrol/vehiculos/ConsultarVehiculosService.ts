import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarVehiculos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.vehiculos.vervehiculos);
        return data;
    } catch (error) {
        console.log("Error al consultar los vehículos");
        throw error;
    }
};