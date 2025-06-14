import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarRepuestoPorId = async (IdRepuesto: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.repuestos.consultar_repuesto_por_id(IdRepuesto));
        return data;
    } catch (error) {
        console.log("Error al consultar el repuesto");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};