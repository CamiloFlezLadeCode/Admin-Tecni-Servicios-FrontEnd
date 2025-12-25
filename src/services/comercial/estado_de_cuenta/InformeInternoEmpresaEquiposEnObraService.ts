import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Params {
    DocumentoCliente: string;
    IdProyecto?: number | string;
}

export const InformeInternoEmpresaEquiposEnObra = async ({ DocumentoCliente, IdProyecto }: Params) => {
    if (!DocumentoCliente) {
        throw new Error('DocumentoCliente es obligatorio');
    }

    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.estado_de_cuenta.informe_interno_empresa_equipos_en_obra, {
            params: {
                DocumentoCliente,
                ...(IdProyecto !== undefined ? { IdProyecto } : {}),
            },
        });

        return data;
    } catch (error: any) {
        console.log('Error al consultar el informe interno (empresa - equipos en obra)');
        throw new Error(`${error.response?.data?.error ?? error.message}`);
    }
};

