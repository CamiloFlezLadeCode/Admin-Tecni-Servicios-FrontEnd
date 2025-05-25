import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarUsuariosGenerales = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.usuariosgenerales.listar);
        return data;
    } catch (error) {
        console.log("Error al consultar los mecánicos");
        throw error;
    }
};