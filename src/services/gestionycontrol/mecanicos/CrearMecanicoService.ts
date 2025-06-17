import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearMecanico = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.mecanicos.crear_mecanico, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el mecánico");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};