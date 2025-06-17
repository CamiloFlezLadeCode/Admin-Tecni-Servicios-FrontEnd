import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

const ListarEquipos = async (datos: any) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarequipos, {
            params: datos
        });
        return data;
    } catch (error) {
        console.log("Error al listar los equipos");
        throw error;
    }
};
export default ListarEquipos;