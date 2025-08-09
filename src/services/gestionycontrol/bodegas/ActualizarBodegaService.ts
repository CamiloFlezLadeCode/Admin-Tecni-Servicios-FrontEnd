import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ActualizarBodega = async (NuevosDatosBodega: any) => {
    try {
        const { data } = await axiosInstance.put(apiRoutes.gestionycontrol.bodegas.actualizar_bodega, NuevosDatosBodega);
        return data;
    } catch (error: any) {
        console.log(`ERROR AL ACTUALIZAR LA BODEGA`);
        throw new Error(`${error.response.data.error}`);
    }
};