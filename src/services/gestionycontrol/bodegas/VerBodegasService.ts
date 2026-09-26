import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const VerBodegas = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.bodegas.ver_bodegas);
        return data;
    } catch (error: any) {
        console.log(`Error al cargar las bodegas`);
        throw new Error(`${error.response.data.error}`);
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const VerBodegasPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.gestionycontrol.bodegas.ver_bodegas, parametros);
