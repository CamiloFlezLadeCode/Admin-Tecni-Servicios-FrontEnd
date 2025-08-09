import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarInfoBodega = async (IdBodega: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.bodegas.ver_info_bodega, {
            params: {
                IdBodega
            }
        });
        return data;
    } catch (error: any) {
        console.log(`variable`);
        throw new Error(`${error.response.data.error}`);
    }
};