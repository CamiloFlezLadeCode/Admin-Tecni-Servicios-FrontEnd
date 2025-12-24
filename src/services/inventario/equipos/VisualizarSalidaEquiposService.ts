import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
  readonly NoSalidaEquipos: number;
}

export const VisualizarSalidaEquipos = async (NoSalidaEquipos: Props) => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.visualizar_salida_equipos, {
      params: NoSalidaEquipos
    });
    return data;
  } catch (error: any) {
    console.log('Error al visualizar la salida de equipos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};
