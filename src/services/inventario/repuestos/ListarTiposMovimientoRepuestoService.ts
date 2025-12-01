import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarTiposMovimientoRepuesto = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.repuestos.listar_tipos_movimiento_repuesto);
    return (Array.isArray(data) ? data : [])
      .filter((t: any) => String(t.Direccion).toUpperCase() === 'SALIDA')
      .map((t: any) => ({ value: Number(t.IdTipoMovimiento), label: String(t.Nombre) }));
  } catch (error: any) {
    console.log('Error al listar tipos de movimiento de repuesto');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};