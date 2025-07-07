import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ObtenerPDFDevolucion = async (IdDevolucion: number): Promise<Blob> => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.ver_pdf_devolucion,
            {
                params: {
                    IdDevolucion: IdDevolucion
                },
                responseType: 'blob'
            }
        );
        return data;
    } catch (error: any) {
        console.log(`Error al generar el pdf de la devolución con ID: ${IdDevolucion}`);
        const mensaje =
            error.response?.data?.error ??
            error.response?.data?.message ??
            error.message ??
            'Error desconocido al generar el PDF de la devolución';
        console.error(`Error al generar el PDF (ID: ${IdDevolucion}):`, mensaje);
        throw new Error(mensaje);
    }
};