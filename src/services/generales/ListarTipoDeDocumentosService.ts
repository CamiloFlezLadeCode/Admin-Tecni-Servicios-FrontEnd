import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarTiposDeDocumentos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.generales.listartiposdedocumentos);
        return data;
    } catch (error) {
        console.log("Error al listar los tipos de documentos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};