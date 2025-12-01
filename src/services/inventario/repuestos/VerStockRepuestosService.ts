import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const VerStockRepuestos = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.ver_stock_repuestos);
    return data;
  } catch (error: any) {
    console.log('Error al consultar el stock de repuestos');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};