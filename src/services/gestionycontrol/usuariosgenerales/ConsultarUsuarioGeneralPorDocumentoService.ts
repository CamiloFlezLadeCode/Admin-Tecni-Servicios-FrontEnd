import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarUsuarioGeneralPorDocumento = async (documentousuariogeneral: string) => {
    if (!documentousuariogeneral) {
        throw new Error("El documento del usuario no puede estar vacío.");
    }
    try {
        const { data } = await axiosInstance.get(apiRoutes.usuariosgenerales.consultarusuariogeneral(documentousuariogeneral));
        return data;
    } catch (error) {
        console.log("Error al consultar el usuario general con documento: ", documentousuariogeneral, error);
        throw error;
    }
};