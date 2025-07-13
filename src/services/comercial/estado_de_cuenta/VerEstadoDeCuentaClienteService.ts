import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerEstadoDeCuentaCliente = async (DocumentoCliente: string) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.estado_de_cuenta.ver_estado_de_cuenta_cliente, {
            params: {
                DocumentoCliente
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Erro al consultar el estado de cuenta del cliente`);
        throw new Error(`${error.response.data.error}`);
    }
};