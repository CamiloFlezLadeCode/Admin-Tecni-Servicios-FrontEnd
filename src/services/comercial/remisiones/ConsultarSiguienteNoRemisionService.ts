import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarSiguienteNoRemision = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.consultarsiguientenoremision);
        return data;
    } catch (error: any) {
        console.log("Error al consultar el siguiente No de remisión");
        throw new Error(`${error.response.data.error}`);
    }
};