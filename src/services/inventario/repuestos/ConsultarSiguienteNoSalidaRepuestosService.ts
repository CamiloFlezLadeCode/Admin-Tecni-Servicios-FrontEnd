import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarSiguienteNoSalidaRepuestos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.siguiente_numero_salida_repuestos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar el siguiente no de salida de repuestos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};