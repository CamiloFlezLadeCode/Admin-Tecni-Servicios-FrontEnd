import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerTodasLasSalidasDeRepuestos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.ver_todas_las_salidas_repuestos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar las salidas de repuestos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const VerTodasLasSalidasDeRepuestosPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.inventario.repuestos.ver_todas_las_salidas_repuestos, parametros);
