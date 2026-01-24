import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export interface MovimientoGeneral {
    IdMovimiento: number;
    TipoMovimiento: 'REMISION' | 'DEVOLUCION' | 'ORDEN_DE_SERVICIO';
    NoMovimiento: string;
    Cliente: string;
    DocumentoCliente: string;
    Proyecto: string;
    IdProyecto: number;
    Fecha: string;
    CreadoPor: string;
    Estado: string;
    Total?: number;
    Subtotal?: number;
    IVA?: number;
    Observaciones?: string;
}

export const VerMovimientosGenerales = async (params?: {
    FechaInicio?: string;
    FechaFin?: string;
    DocumentoCliente?: string;
    IdProyecto?: number | string;
}) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.movimientos_generales.ver_movimientos_generales, {
            params
        });
        return data;
    } catch (error: any) {
        console.error('Error al consultar los movimientos generales:', error);
        throw new Error(error.response?.data?.error || 'Error al consultar los movimientos generales');
    }
};
