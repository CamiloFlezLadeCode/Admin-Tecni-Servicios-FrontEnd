import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearBodega = async (DatosNuevaBodega: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.bodegas.crear_bodega, DatosNuevaBodega);
        return data;
    } catch (error: any) {
        console.log(`Error al crear la bodega ${error}`);
        throw new Error(`${error.response.data.error}`);
    }
};