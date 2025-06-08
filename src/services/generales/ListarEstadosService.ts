import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ListarEstados = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarestados);
        return data;
    } catch (error) {
        throw new Error(`Error al listar los estados: ${error}`);
    }
};