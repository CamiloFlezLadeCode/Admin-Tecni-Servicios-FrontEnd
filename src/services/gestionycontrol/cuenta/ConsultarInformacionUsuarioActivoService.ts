import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarInformacionUsuarioActivo = async (DocumentoUsuarioActivo: string) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.cuenta.ver_informacion_usuario_activo(DocumentoUsuarioActivo));
        return data;
    } catch (error) {
        console.log("Error al consultar la información del usuario activo");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};