import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerTodasLasSalidasDeEquipos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.ver_todas_las_salidas_equipos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar las salidas de equipos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};
