import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerTodasLasDevoluciones = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.ver_todas_las_devoluciones);
        return data;
    } catch (error: any) {
        console.log(`Error al cargar todas las devoluciones`);
        throw new Error(`${error.response.data.error}`);
    }
};