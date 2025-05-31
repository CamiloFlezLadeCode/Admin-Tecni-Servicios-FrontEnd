import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const CrearRemision = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.comercial.remisiones.crearremision, datos);
        return data;
    } catch (error: any) {
        console.log("Error al crear la remisión");
        throw new Error(`Error => ${error.response.data.error}`);
    }
};