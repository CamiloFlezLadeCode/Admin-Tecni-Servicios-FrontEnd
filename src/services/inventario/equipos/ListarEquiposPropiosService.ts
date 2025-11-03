import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarEquiposPropios = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.listar_equipos_propios);
        return data;
    } catch (error: any) {
        console.log(`Error al listar los equipos propios`);
        throw new Error(`${error.response.data.error}`);
    }
};