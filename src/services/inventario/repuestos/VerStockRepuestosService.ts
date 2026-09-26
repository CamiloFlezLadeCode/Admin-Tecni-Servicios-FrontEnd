import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerStockRepuestos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.ver_stock_repuestos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar el stock de repuestos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};

/**
 * Versión paginada en el servidor (ver `usePaginacionServidor`).
 * `SoloBajoStock` replica el chip "Solo bajo stock" (cantidad ≤ 5).
 */
export const VerStockRepuestosPaginado = (parametros: ParametrosPaginacion, filtros: { SoloBajoStock?: boolean } = {}) =>
  consultarPaginado<any>(apiRoutes.inventario.repuestos.ver_stock_repuestos, parametros, { SoloBajoStock: filtros.SoloBajoStock || undefined });
