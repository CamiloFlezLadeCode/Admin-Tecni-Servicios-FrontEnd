import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarRemisiones = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.ver_remisiones);
        return data;
    } catch (error: any) {
        console.log("Error al consultar las remisiones");
        throw new Error(`${error.response.data.error}`);
    }
};