import { apiRoutes } from "@/config/apiRoutes";
import axiosInstance from "@/config/axiosConfig";

export const ConsultarDevolucionPorId = async (IdDevolucion: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.ver_devolucion_por_id, {
            params: {
                IdDevolucion
            }
        });
        return data;
    } catch (error) {
        console.log("Error al consultar la información de la devolución");
        throw error;
    }
};

