import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerTodasLasEntradasDeEquipos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.ver_todas_las_entradas_equipos);
        return data;
    } catch (error: any) {
        console.log(`Error al ver todas las entradas de los equipos`);
        throw new Error(`${error.response.data.error}`);
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const VerTodasLasEntradasDeEquiposPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.inventario.equipos.ver_todas_las_entradas_equipos, parametros);
