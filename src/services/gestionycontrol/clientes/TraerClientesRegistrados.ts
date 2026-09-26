import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const TraerClientes = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.clientes.consultar_todos_los_clientes);
        return data;
    } catch (error) {
        console.log("Error al consultar los clientes");
        throw error;
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const TraerClientesPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.gestionycontrol.clientes.consultar_todos_los_clientes, parametros);
