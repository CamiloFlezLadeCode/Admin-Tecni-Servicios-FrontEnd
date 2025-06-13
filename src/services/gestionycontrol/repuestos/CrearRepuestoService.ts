import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const CrearRepuesto = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.repuestos.crear_repuesto, datos);
        return data;
    } catch (error) {
        throw Error(`Error al crear el repuesto ${error}`);
    }
};