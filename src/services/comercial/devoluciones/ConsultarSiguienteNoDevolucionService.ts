import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarSiguienteNoDevolucion = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.consultar_siguiente_no_devolucion);
        return data;
    } catch (error: any) {
        console.log("Error al consultar el siguiente No de devolución");
        throw new Error(`${error.response.data.error}`);
    }
};