import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion, RespuestaPaginada } from '@/types/paginacion';

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


/** Totales por tipo de movimiento, calculados en el servidor sobre TODO el conjunto filtrado. */
export interface ResumenMovimientos {
    remisiones: number;
    devoluciones: number;
    ordenes: number;
    total: number;
}

export interface RespuestaMovimientosGenerales extends RespuestaPaginada<MovimientoGeneral> {
    Resumen: ResumenMovimientos;
}

/** Versión paginada en el servidor (ver `usePaginacionServidor`), con los mismos filtros. */
export const VerMovimientosGeneralesPaginado = (
    parametros: ParametrosPaginacion,
    filtros: { FechaInicio?: string; FechaFin?: string; DocumentoCliente?: string; IdProyecto?: number | string } = {}
) =>
    consultarPaginado<MovimientoGeneral, RespuestaMovimientosGenerales>(
        apiRoutes.comercial.movimientos_generales.ver_movimientos_generales,
        parametros,
        filtros
    );
