import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface RepuestoSalida {
  IdRepuesto: number;
  Cantidad: number;
  IdUnidadMedida: number;
  IdEstado: number;
  Observacion: string;
}

interface DataSalidaRepuestos {
  FechaSalida: string;
  DocumentoResponsable: string;
  Observaciones: string;
  NoSalidaRepuestos: number | null;
  Repuestos: RepuestoSalida[];
  UsuarioCreacion: string | null | undefined;
  IdTipoMovimiento?: number;
}

export const GuardarSalidaRepuestos = async (body: DataSalidaRepuestos) => {
  try {
    const { data } = await axiosInstance.post(apiRoutes.inventario.repuestos.guardar_salida_repuestos, body);
    return data;
  } catch (error: any) {
    console.log('Error al guardar la salida de los repuestos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};