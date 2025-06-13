import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarRepuestos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.repuestos.ver_repuestos);
        return data;
    } catch (error) {
        console.log("Error al consultar los mecánicos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};