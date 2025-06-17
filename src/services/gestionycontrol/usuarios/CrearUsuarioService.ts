import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearUsuario = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.usuarios.crear_usuario, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el usuario");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};