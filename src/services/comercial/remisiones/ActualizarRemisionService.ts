import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";
import { AxiosResponse } from "axios";

export const ActualizarRemision = async (
    datos: any
): Promise<AxiosResponse> => {
    try {
        return await axiosInstance.put(
            apiRoutes.comercial.remisiones.actualizar_remision,
            datos
        );
    } catch (error) {
        console.log("Error al actualizar la remisión");
        throw error;
    }
};