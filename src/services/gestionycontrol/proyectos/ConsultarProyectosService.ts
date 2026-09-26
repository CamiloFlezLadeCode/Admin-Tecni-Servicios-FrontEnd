import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const ConsultarProyectos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.proyectos.ver_todos_los_proyectos);
        return data;
    } catch (error) {
        console.log("Error al consultar los proyectos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const ConsultarProyectosPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.gestionycontrol.proyectos.ver_todos_los_proyectos, parametros);
