import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

export const ListarTiposMovimientoEquipo = async () => {
  try {
    const { data } = await axiosInstance.get(apiRoutes.inventario.equipos.listar_tipos_movimiento_equipo);
    return (Array.isArray(data) ? data : [])
      .filter((t: any) => String(t.Direccion).toUpperCase() === 'SALIDA')
      .map((t: any) => ({ value: Number(t.IdTipoMovimiento), label: String(t.Nombre) }));
  } catch (error: any) {
    console.log('Error al listar tipos de movimiento de equipo');
    throw new Error(`${error?.response?.data?.error ?? 'Error desconocido'}`);
  }
};
