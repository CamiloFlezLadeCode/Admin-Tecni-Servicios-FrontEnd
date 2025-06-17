import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const CrearEquipo = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.gestionycontrol.equipos.crear_equipo, datos);
        return data;
    } catch (error) {
        console.log("Error al crear el equipo");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};