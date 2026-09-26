import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerTodasLasDevoluciones = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.ver_todas_las_devoluciones);
        return data;
    } catch (error: any) {
        console.log(`Error al cargar todas las devoluciones`);
        throw new Error(`${error.response.data.error}`);
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const VerTodasLasDevolucionesPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.comercial.devoluciones.ver_todas_las_devoluciones, parametros);
