/**
 * Contrato del paginado del lado del servidor (ver `utils/paginacion.js` en el backend).
 *
 * Los endpoints de listado responden el array completo si NO se envía `pagina`;
 * con `pagina` responden una `RespuestaPaginada`.
 */

/** Parámetros que se envían al endpoint. `pagina` empieza en 1. */
export interface ParametrosPaginacion {
  pagina: number;
  limite: number;
  busqueda?: string;
}

export interface RespuestaPaginada<T> {
  Datos: T[];
  /** Total de registros que cumplen búsqueda y filtros (no sólo los de la página). */
  Total: number;
  Pagina: number;
  Limite: number;
  TotalPaginas: number;
}
