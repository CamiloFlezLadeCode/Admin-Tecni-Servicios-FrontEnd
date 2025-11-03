import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface DataEntradaRepuestos {
    FechaEntrada: string;
    DocumentoResponsable: string;
    Observaciones: string;
    NoEntradaRepuestos: number | null;
    Repuestos: Repuesto[];
};

interface Repuesto {
    IdRepuesto: number;
    Cantidad: number;
    IdUnidadMedida: number;
    IdEstado: number;
    Observacion: string;
}

export const GuardarEntradaRepuestos = async (body: DataEntradaRepuestos) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.inventario.repuestos.guardar_entrada_repuestos, body);
        return data;
    } catch (error: any) {
        console.log(`Error al guardar la entrada de los repuestos`);
        throw new Error(`${error.response.data.error}`);
    }
};