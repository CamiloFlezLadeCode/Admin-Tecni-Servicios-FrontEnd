import { apiRoutes } from "@/config/apiRoutes";
import axiosInstance from "@/config/axiosConfig";
import { AxiosResponse } from "axios";

export const ActualizarDevolucion = async (
    datos: any
): Promise<AxiosResponse> => {
    try {
        return await axiosInstance.put(
            apiRoutes.comercial.devoluciones.actualizar_devolucion,
            datos
        );
    } catch (error) {
        console.log("Error al actualizar la devolución");
        throw error;
    }
};

