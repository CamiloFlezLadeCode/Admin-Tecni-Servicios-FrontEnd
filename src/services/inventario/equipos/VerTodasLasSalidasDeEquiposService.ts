import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerTodasLasSalidasDeEquipos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.ver_todas_las_salidas_equipos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar las salidas de equipos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const VerTodasLasSalidasDeEquiposPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.inventario.equipos.ver_todas_las_salidas_equipos, parametros);
