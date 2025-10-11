import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
    readonly IdTipoBodega: number;
    readonly IdRepuesto: number;
}
export const VerDisponibilidadDeRepuesto = async ({ IdTipoBodega, IdRepuesto }: Props) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.ordenes_de_servicio.ver_disponibilidad_de_repuesto, {
            params: {
                IdTipoBodega,
                IdRepuesto
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Error al ver la disponibilidad del repuesto. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};