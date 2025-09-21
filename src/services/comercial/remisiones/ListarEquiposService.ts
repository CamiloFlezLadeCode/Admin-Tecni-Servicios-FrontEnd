import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Parametros {
    IdCategoria: number;
}
export const ListarEquipos = async ({ IdCategoria }: Parametros) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.listar_equipos_generales, {
            params: {
                IdCategoria
            }
        });
        return data;
    } catch (error: any) {
        console.log(`variable`);
        throw new Error(`${error.response.data.error}`);
    }
};