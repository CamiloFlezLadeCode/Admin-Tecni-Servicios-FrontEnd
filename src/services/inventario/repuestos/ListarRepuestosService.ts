import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarRepuestos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.listar_repuestos);
        return data;
    } catch (error: any) {
        console.log(`Error al listar los repuestos`);
        throw new Error(`${error.response.data.error}`);
    }
};