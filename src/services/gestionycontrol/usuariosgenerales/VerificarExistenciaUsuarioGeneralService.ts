import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerificarExistenciaUsuario = async (documento: string) => {
    try {
        //Se realiza la consulta en bd
        const { data } = await axiosInstance.get(apiRoutes.usuariosgenerales.verificarexistenciausuario(documento));
        if (!('encontrado' in data)) {
            console.warn('La respuesta no tiene el campo esperado "encontrado".', data);
            return { encontrado: false, cliente: null };
        };
        // Si el campo 'encontrado' es verdadero, devolvemos true
        if (data.encontrado) {
            return true; // El cliente existe
        } else {
            return false; // El cliente no existe
        }
    } catch (error) {
        console.log("Error al verificar la existencia del usuario");
        throw error;
    }
}