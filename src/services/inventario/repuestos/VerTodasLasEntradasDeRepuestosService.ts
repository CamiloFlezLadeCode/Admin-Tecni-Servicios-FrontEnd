import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerTodasLasEntradasDeRepuestos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.ver_todas_las_entradas_repuestos);
        return data;
    } catch (error: any) {
        console.log(`Error al consultar las entradas de repuestos`);
        throw new Error(`${error.response.data.error}`);
    }
};