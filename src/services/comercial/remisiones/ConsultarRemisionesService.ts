import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";
import { TableInterfacePaginacion } from "@/types/InterfaceTablePagination";

export const ConsultarRemisionesConPaginacion = async (paginacion: TableInterfacePaginacion) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.ver_remisiones, {
            params: paginacion
        });
        return data;
    } catch (error: any) {
        console.log("Error al consultar las remisiones");
        throw new Error(`${error.response.data.error}`);
    }
};

export const ConsultarRemisiones = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.ver_remisiones);
        return data;
    } catch (error: any) {
        console.log("Error al consultar las remisiones");
        throw new Error(`${error.response.data.error}`);
    }
};

export type CantidadRemisionesDevolucionesUltimos6Meses = {
    FechaInicio: string;
    FechaFinExclusiva: string;
    Meses: Array<{
        Mes: string;
        Etiqueta?: string;
        CantidadRemisiones: number;
        CantidadDevoluciones: number;
        CantidadOrdenesDeServicio?: number;
    }>;
    Totales: {
        CantidadRemisiones: number;
        CantidadDevoluciones: number;
        CantidadOrdenesDeServicio?: number;
    };
};

export type TotalesMovimientosMesActual = {
    Mes: string;
    FechaInicio: string;
    FechaFinExclusiva: string;
    Totales: {
        CantidadRemisiones: number;
        CantidadDevoluciones: number;
        CantidadOrdenesDeServicio: number;
    };
    TotalMovimientos: number;
};

export type ActividadRecienteMovimientosResponse = {
    Limite: number;
    Cantidad: number;
    Movimientos: Array<{
        TipoMovimiento: 'REMISION' | 'DEVOLUCION' | 'ORDEN_DE_SERVICIO' | string;
        IdMovimiento: number;
        NoMovimiento: string;
        Cliente: string;
        Proyecto: string;
        CreadoPor: string;
        Estado: string;
        FechaCreacion: string;
    }>;
};

export const VerCantidadRemisionesYDevolucionesUltimos6Meses = async (): Promise<CantidadRemisionesDevolucionesUltimos6Meses> => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.cantidad_remisiones_devoluciones_ultimos_6_meses);
        return data;
    } catch (error: any) {
        console.log("Error al consultar la cantidad de remisiones y devoluciones de los últimos 6 meses");
        throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
    }
};

export const VerTotalesMovimientosMesActual = async (): Promise<TotalesMovimientosMesActual> => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.totales_movimientos_mes_actual);
        return data;
    } catch (error: any) {
        console.log("Error al consultar los totales de movimientos del mes actual");
        throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
    }
};

export const VerActividadRecienteMovimientos = async (Limite: number = 10): Promise<ActividadRecienteMovimientosResponse> => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.actividad_reciente_movimientos, { params: { Limite } });
        return data;
    } catch (error: any) {
        console.log("Error al consultar la actividad reciente de movimientos");
        throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
    }
};
