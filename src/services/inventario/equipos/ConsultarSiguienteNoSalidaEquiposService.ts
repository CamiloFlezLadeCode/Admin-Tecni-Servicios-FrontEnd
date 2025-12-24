import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ConsultarSiguienteNoSalidaEquipos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.siguiente_numero_salida_equipos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar el siguiente no de salida de equipos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};
