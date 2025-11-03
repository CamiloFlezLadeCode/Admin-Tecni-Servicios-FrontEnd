import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const SiguienteNoEntradaEquipos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.siguiente_numero_entrada_equipos);
        return data;
    } catch (error: any) {
        console.log(`Error al listar al consultar el siguiente no de entrada de equipos`);
        throw new Error(`${error.response.data.error}`);
    }
};