import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const TraerEquipos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.equipos.ver_todos_los_equipo);
        return data;
    } catch (error) {
        console.log("Error al consultar los equipos");
        throw error;
    }
};