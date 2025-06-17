import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearUsuarioGeneral = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.usuarios_generales.crear_usuario_general, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el usuario general");
        throw error;
    }
};