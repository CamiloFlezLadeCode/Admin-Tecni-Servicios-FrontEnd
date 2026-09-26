import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const ConsultarUsuariosGenerales = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.usuariosgenerales.listar);
        return data;
    } catch (error) {
        console.log("Error al consultar los mecánicos");
        throw error;
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const ConsultarUsuariosGeneralesPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.usuariosgenerales.listar, parametros);
