import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface EquipoSalida {
  IdEquipo: number;
  Cantidad: number;
  IdUnidadMedida: number;
  IdEstado: number;
  Observacion: string;
}

interface DataSalidaEquipos {
  FechaSalida: string;
  DocumentoResponsable: string;
  Observaciones: string;
  NoSalidaEquipos: number | null;
  Equipos: EquipoSalida[];
  UsuarioCreacion: string | null | undefined;
  IdTipoMovimiento?: number;
}

export const GuardarSalidaEquipos = async (body: DataSalidaEquipos) => {
  try {
    const { data } = await axiosInstance.post(apiRoutes.inventario.equipos.guardar_salida_equipos, body);
    return data;
  } catch (error: any) {
    console.log('Error al guardar la salida de los equipos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};
