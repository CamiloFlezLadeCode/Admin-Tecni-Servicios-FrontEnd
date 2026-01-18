import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarRemisionPorId = async (IdRemision: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.ver_remision_por_id, {
            params: {
                IdRemision
            }
        });
        return data;
    } catch (error) {
        console.log("Error al consultar la información de la remisión");
        throw error;
    }
};