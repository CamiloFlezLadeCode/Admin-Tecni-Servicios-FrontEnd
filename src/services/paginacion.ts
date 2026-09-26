import axiosInstance from '@/config/axiosConfig';

import type { ParametrosPaginacion, RespuestaPaginada } from '@/types/paginacion';

/**
 * Consulta un endpoint de listado en modo paginado.
 *
 * Es el MISMO endpoint que devuelve el listado completo: al enviar `pagina` el
 * backend responde `{ Datos, Total, … }` en lugar del array. Los `filtros` viajan
 * como parámetros adicionales de la query (se omiten los vacíos).
 */
export async function consultarPaginado<T, R extends RespuestaPaginada<T> = RespuestaPaginada<T>>(
  url: string,
  parametros: ParametrosPaginacion,
  filtros: Record<string, string | number | boolean | null | undefined> = {}
): Promise<R> {
  const params: Record<string, string | number | boolean> = {
    pagina: parametros.pagina,
    limite: parametros.limite,
  };
  if (parametros.busqueda) params.busqueda = parametros.busqueda;
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor !== undefined && valor !== null && valor !== '') params[clave] = valor;
  }

  try {
    const { data } = await axiosInstance.get<R>(url, { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error ?? error?.message ?? 'Error desconocido');
  }
}
