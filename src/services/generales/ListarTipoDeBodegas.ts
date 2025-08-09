import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarTiposDeBodegas = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listartiposdebodegas);
        return data;
    } catch (error: any) {
        console.log(`Error al listar los tipos de bodegas. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};