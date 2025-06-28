import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const VerRemisionesCliente = async (DocumentoCliente: string, IdProyecto: any) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.ver_remisiones_del_cliente, {
            // params: Datos
            params: {
                Cliente: DocumentoCliente,
                Proyecto: IdProyecto
            }
        });
        return data;
    } catch (error) {
        console.log("Error al listar las remisiones");
        throw error;
    }
};