import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarSiguienteNoEntradaRepuestos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.siguiente_numero_entrada_repuestos);
        return data;
    } catch (error: any) {
        console.log(`Error al consultar el siguiente no de entrada de repuestos`);
        throw new Error(`${error.response.data.error}`);
    }
};