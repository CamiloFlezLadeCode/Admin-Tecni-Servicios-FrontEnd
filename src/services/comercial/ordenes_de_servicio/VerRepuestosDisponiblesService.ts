import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
    readonly IdTipoBodega: number;
}

export const VerRepuestosDisponibles = async ({ IdTipoBodega }: Props) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.ordenes_de_servicio.ver_repuestos_disponibles, {
            params: {
                IdTipoBodega
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al ver los repuestos disponibles. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};