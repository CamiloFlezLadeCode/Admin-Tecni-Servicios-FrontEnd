import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerStockEquipos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.ver_stock_equipos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar el stock de equipos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};
