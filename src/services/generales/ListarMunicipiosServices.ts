import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Params {
    Page: number,
    Limit: number,
    Search: string,
}
export const ListarMunicipios = async (Params: Params) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarmunicipios,
            {
                params: {
                    page: Params.Page,
                    limit: Params.Limit,
                    search: Params.Search,
                }
            }
        );
        return data;
    } catch (error) {
        console.error('Error al listar municipios:', error);
        throw error;
    }
}