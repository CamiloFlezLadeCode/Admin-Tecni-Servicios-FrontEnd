import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

interface Props {
  readonly NoSalidaRepuestos: number;
}

export const VisualizarSalidaRepuestos = async (NoSalidaRepuestos: Props) => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.visualizar_salida_repuestos, {
      params: NoSalidaRepuestos
    });
    return data;
  } catch (error: any) {
    console.log('Error al visualizar la salida de repuestos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};