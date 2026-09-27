import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import type {
    ActividadRecienteMovimientosResponse,
    CantidadRemisionesDevolucionesUltimos6Meses,
    TotalesMovimientosMesActual,
} from '@/services/comercial/remisiones/ConsultarRemisionesService';

/**
 * Todo lo que pinta el panel principal, ya agregado en el servidor.
 * Sustituye a las 7 peticiones de listados completos (clientes, proyectos,
 * remisiones, devoluciones, órdenes, stock de equipos y de repuestos) que el
 * panel descargaba sólo para contar filas: el tamaño de la respuesta es fijo
 * y no crece con el historial.
 */
export type ResumenDashboard = {
    TotalClientes: number;
    Proyectos: { Total: number; Activos: number };
    /** Equipos + repuestos por cantidad disponible: Agotado <= 0, Bajo 1..5, OK > 5. */
    Inventario: { OK: number; Bajo: number; Agotado: number };
    TopClientes: Array<{
        DocumentoCliente: string;
        Cliente: string;
        CantidadRemisiones: number;
        CantidadDevoluciones: number;
        Total: number;
    }>;
    SerieUltimos6Meses: CantidadRemisionesDevolucionesUltimos6Meses;
    TotalesMesActual: TotalesMovimientosMesActual;
    ActividadReciente: ActividadRecienteMovimientosResponse;
};

export const VerResumenDashboard = async (): Promise<ResumenDashboard> => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.dashboard.resumen_dashboard);
        return data;
    } catch (error: any) {
        console.log('Error al consultar el resumen del panel');
        throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
    }
};
