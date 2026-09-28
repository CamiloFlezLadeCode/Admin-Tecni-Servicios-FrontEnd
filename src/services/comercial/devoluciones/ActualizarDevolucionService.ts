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
    } catch (error: any) {
        console.log("Error al actualizar la devolución");
        // El backend explica el motivo en `error` (p. ej. fecha anterior a la remisión)
        throw new Error(error?.response?.data?.error ?? error?.message ?? 'Error desconocido');
    }
};

