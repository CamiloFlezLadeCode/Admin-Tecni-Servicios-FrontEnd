import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const TraerEquipos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.equipos.ver_todos_los_equipo);
        return data;
    } catch (error) {
        console.log("Error al consultar los equipos");
        throw error;
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const TraerEquiposPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.gestionycontrol.equipos.ver_todos_los_equipo, parametros);
