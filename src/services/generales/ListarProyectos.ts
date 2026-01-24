import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

// export const ListarProyectos = async (datos: any) => {
//     try {
//         const { data } = await axios.get(`${apiUrl}/listar-proyectos`, datos);
//         return data;
//     } catch (error) {
//         console.log("Error al listar los proyectos");
//         throw error; // Lanza el error para manejarlo en el controlador
//     }
// };


export const ListarProyectos = async (datos?: any) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listarproyectos, {
            params: datos, // 👈 esto es clave
        });
        return data;
    } catch (error) {
        console.log("Error al listar los proyectos");
        throw error;
    }
};
