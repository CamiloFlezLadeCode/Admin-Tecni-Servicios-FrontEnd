import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
    readonly IdTipoBodega: number;
    readonly DocumentoPropietario: string;
}

export const VerEquiposDelCliente = async ({ IdTipoBodega, DocumentoPropietario }: Props) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.ordenes_de_servicio.ver_equipos_del_cliente, {
            params: {
                IdTipoBodega,
                DocumentoPropietario
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al ver los equipos del cliente. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};