import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface DatosConsulta {
    DocumentoCliente: string;
    IdProyecto?: number | null;
}
export const ConsultarSubarrendatariosConRemisionesAsignadasClienteProyecto = async ({ DocumentoCliente, IdProyecto }: DatosConsulta) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.ver_subarrendatarios_con_remisiones_asignadas_cliente_proyecto, {
            params: {
                DocumentoCliente,
                IdProyecto
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al consultar los subarrendatarios con remisiones asignadas para cliente/proyecto. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};