import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarUnidadesDeMedida = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarunidades);
        return data;
    } catch (error: any) {
        console.log(`Error al listar las unidades de medida. ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};