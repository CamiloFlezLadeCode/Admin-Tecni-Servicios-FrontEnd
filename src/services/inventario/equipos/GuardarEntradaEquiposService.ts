import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface DataEntradaEquipos {
    FechaEntrada: string;
    DocumentoResponsable: string;
    Observaciones: string;
    NoEntradaEquipos: number | null;
    Equipos: Equipo[]
}

interface Equipo {
    IdEquipo: number;
    Cantidad: number;
    IdUnidadMedida: number;
    IdEstado: number;
    Observacion: string;
}
export const GuardarEntradaEquipos = async (body: DataEntradaEquipos) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.inventario.equipos.guardar_entrada_equipos, body);
        return data;
    } catch (error: any) {
        console.log(`Error al guardar la entrada de los equipos`);
        throw new Error(`${error.response.data.error}`);
    }
};