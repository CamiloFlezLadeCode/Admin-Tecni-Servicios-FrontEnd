import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ObtenerPDFOrdenDeServicio = async (IdOrdenDeServicio: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.ordenes_de_servicio.ver_pdf_orden_de_servicio,
            {
                params: {
                    IdOrdenDeServicio
                },
                responseType: 'blob'
            }
        );
        return data;
    } catch (error: any) {
        console.log(`Error al generar el PDF de la orden de servicio...`);
        throw new Error(`${error.response.data.error}`);
    }
};