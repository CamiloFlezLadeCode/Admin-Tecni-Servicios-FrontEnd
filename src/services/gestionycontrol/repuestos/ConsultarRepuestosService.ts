import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const ConsultarRepuestos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.repuestos.ver_repuestos);
        return data;
    } catch (error) {
        console.log("Error al consultar los repuestos");
        throw error; // Lanza el error para manejarlo en el controlador
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const ConsultarRepuestosPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.gestionycontrol.repuestos.ver_repuestos, parametros);
