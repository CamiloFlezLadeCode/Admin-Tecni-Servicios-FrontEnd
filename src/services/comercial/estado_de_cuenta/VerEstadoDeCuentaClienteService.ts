import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion, RespuestaPaginada } from '@/types/paginacion';

export const VerEstadoDeCuentaCliente = async (DocumentoCliente: string) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.estado_de_cuenta.ver_estado_de_cuenta_cliente, {
            params: {
                DocumentoCliente
            }
        });
        return data;
    } catch (error: any) {
        console.log(`Erro al consultar el estado de cuenta del cliente`);
        throw new Error(`${error.response.data.error}`);
    }
};


/**
 * Totales de las tarjetas: filtros de proyecto/equipo aplicados, sin la búsqueda de texto.
 * Los valores en dinero salen de la misma fórmula de cobro que movimientos generales.
 */
export interface ResumenEstadoDeCuenta {
    totalPrestado: number;
    totalDevuelto: number;
    totalPendiente: number;
    /** Alquiler causado a hoy, sin IVA. */
    alquilerSinIVA: number;
    /** Alquiler causado a hoy, con IVA. */
    alquilerConIVA: number;
    /** Lo que se suma por cada día más con los equipos que siguen en obra, con IVA. */
    causacionDiariaConIVA: number;
    /** Transportes (sin IVA). `null` con el filtro de equipo: el transporte es por documento, no por equipo. */
    transportes: { remisiones: number; devoluciones: number } | null;
    /** Alquiler con IVA + transportes. */
    totalCausado: number;
}

export interface RespuestaEstadoDeCuenta<T> extends RespuestaPaginada<T> {
    Resumen: ResumenEstadoDeCuenta;
    /** Valores distintos de TODO el estado de cuenta del cliente, para los selects de filtro. */
    Opciones: { Proyectos: string[]; Equipos: string[] };
}

/** Versión paginada en el servidor (ver `usePaginacionServidor`). */
export const VerEstadoDeCuentaClientePaginado = <T,>(
    DocumentoCliente: string,
    parametros: ParametrosPaginacion,
    filtros: { Proyecto?: string; Equipo?: string } = {}
) =>
    consultarPaginado<T, RespuestaEstadoDeCuenta<T>>(
        apiRoutes.comercial.estado_de_cuenta.ver_estado_de_cuenta_cliente,
        parametros,
        { DocumentoCliente, ...filtros }
    );
