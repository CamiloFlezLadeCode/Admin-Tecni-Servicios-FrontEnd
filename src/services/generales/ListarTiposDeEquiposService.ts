import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarTiposDeEquipos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listartipodeequipos);
        return data;
    } catch (error: any) {
        console.log(`Error al listar los tipos de equipos. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};