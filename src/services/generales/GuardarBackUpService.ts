import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

const GuardarBackUp = async () => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.guardar_backup);
        return data;
    } catch (error) {
        console.log("Error al guardar BackUp");
        throw error;
    }
};
export default GuardarBackUp;