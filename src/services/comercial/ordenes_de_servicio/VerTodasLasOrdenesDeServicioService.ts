import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerTodasLasOrdenesDeServicio = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.ordenes_de_servicio.ver_todas_las_ordenes_de_servicio);
        return data;
    } catch (error: any) {
        console.log(`Error la consultar las ordenes de servicio`);
        throw new Error(`${error.response.data.error}`);
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const VerTodasLasOrdenesDeServicioPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.comercial.ordenes_de_servicio.ver_todas_las_ordenes_de_servicio, parametros);
