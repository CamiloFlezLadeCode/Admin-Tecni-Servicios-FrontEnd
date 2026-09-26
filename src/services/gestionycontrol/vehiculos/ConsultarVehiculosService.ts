import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";
import { consultarPaginado } from '@/services/paginacion';
import type { ParametrosPaginacion } from '@/types/paginacion';

export const ConsultarVehiculos = async () => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.vehiculos.vervehiculos);
        return data;
    } catch (error) {
        console.log("Error al consultar los vehículos");
        throw error;
    }
};

/** Versión paginada en el servidor (ver `usePaginacionServidor`). Mismo endpoint, con `pagina`. */
export const ConsultarVehiculosPaginado = (parametros: ParametrosPaginacion) =>
  consultarPaginado<any>(apiRoutes.vehiculos.vervehiculos, parametros);
