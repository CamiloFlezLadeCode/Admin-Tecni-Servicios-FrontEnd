import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
    readonly NoEntradaRepuestos: number;
}
export const VisualizarEntradaRepuestos = async (NoEntradaRepuestos: Props) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.visualizar_entrada_repuestos, {
            params: NoEntradaRepuestos
        });
        return data;
    } catch (error: any) {
        console.log(`Error al visualizar la entrada de repuestos`);
        throw new Error(`${error.response.data.error}`);
    }
};