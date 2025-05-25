import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ActualizarUsuarioGeneral = async (datos: any) => {
    try {
        // const { data } = await axiosInstance.put(apiRoutes.usuariosgenerales.actualizarusuariogeneral, datos)
        const { data } = await axiosInstance.put(apiRoutes.usuariosgenerales.actualizarusuariogeneral, datos);
        return data;
    } catch (error) {
        console.log("Error al actualizar el usuario general");
        throw error;
    }
};