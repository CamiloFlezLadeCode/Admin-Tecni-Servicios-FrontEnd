import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

/** Una ubicación = una línea de remisión con unidades todavía sin devolver. */
export interface UbicacionEquipo {
    IdDetalleRemision: number;
    IdRemision: number;
    NoRemision: string;
    DocumentoCliente: string;
    Cliente: string;
    TelefonoCliente: string | null;
    CelularCliente: string | null;
    IdProyecto: number;
    Proyecto: string;
    DireccionProyecto: string;
    FechaRemision: string;
    FechaRemisionTexto: string;
    FechaRemisionCompleta: string;
    DiasEnObra: number;
    CantidadPrestada: number;
    CantidadDevuelta: number;
    CantidadEnObra: number;
    FechaUltimaDevolucion: string | null;
}

export interface FichaEquipo {
    IdEquipo: number;
    NombreEquipo: string;
    Categoria: string;
    TipoDeEquipo: string;
    UnidadDeMedida: string;
    Bodega: string;
    Estado: string;
    Propietario: string;
    CantidadTotal: number;
    CantidadDisponible: number;
    CantidadEnObra: number;
}

export interface UbicacionEquipoRespuesta {
    Equipo: FichaEquipo;
    Ubicaciones: UbicacionEquipo[];
}

export const ConsultarUbicacionEquipos = async (IdEquipo: number): Promise<UbicacionEquipoRespuesta> => {
    try {
        const { data } = await axiosInstance.get<UbicacionEquipoRespuesta>(
            apiRoutes.gestionycontrol.equipos.ver_ubicacion_equipo(IdEquipo)
        );
        return data;
    } catch (error) {
        // Se propaga el AxiosError intacto para que la vista distinga un 404
        // (equipo inexistente) de un fallo de red o de servidor.
        throw error;
    }
};
