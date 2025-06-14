import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarRepuesto = async (datos: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.gestionycontrol.repuestos.actualizar_repuesto, datos);
        return data;
    } catch (error) {
        console.log("Error al consultar el repuesto");
        throw error; // Lanza el error para manejarlo en el controlador
    }
}