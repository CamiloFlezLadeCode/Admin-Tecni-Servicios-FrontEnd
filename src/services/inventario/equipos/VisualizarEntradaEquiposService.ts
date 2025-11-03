import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
    NoEntradaEquipos: number;
}
export const VisualizarEntradaEquipos = async (NoEntradaEquipos: Props) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.visualizar_entrada_equipos, {
            params: NoEntradaEquipos
        });
        return data;
    } catch (error: any) {
        console.log(`variable`);
        throw new Error(`${error.response.data.error}`);
    }
};