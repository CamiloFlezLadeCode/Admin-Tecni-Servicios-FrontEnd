import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const ConsultarMecanicos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.mecanicos.ver_todos_los_mecanicos);
        return data;
    } catch (error) {
        console.log("Error al consultar los mecánicos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const ConsultarMecanicosPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.gestionycontrol.mecanicos.ver_todos_los_mecanicos, parametros);
