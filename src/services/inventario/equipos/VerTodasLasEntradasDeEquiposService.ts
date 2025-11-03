import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerTodasLasEntradasDeEquipos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.ver_todas_las_entradas_equipos);
        return data;
    } catch (error: any) {
        console.log(`Error al ver todas las entradas de los equipos`);
        throw new Error(`${error.response.data.error}`);
    }
};