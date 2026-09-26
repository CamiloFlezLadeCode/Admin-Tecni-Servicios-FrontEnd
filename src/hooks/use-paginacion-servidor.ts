'use client';

import * as React from 'react';

import type { ParametrosPaginacion, RespuestaPaginada } from '@/types/paginacion';

/** Espera tras la última tecla antes de consultar: evita una petición por cada letra. */
const ESPERA_BUSQUEDA_MS = 350;

export interface OpcionesPaginacionServidor<T, R extends RespuestaPaginada<T>> {
  /** Llama al servicio paginado con la página (base 1), el límite y la búsqueda. */
  consultar: (parametros: ParametrosPaginacion) => Promise<R>;
  /**
   * Filtros externos (selects, chips…). Si cambian, se vuelve a la primera página
   * y se consulta de nuevo. Deben ser valores primitivos o serializables.
   */
  filtros?: unknown[];
  /** `false` mientras falte un dato obligatorio (p. ej. elegir un cliente). */
  habilitado?: boolean;
  limiteInicial?: number;
  /** Texto del error que verá la persona. */
  mensajeError?: (error: unknown) => string;
}

/** Lo que necesita `DataTable` para paginar contra el servidor. */
export interface PaginacionTablaServidor {
  total: number;
  /** Página actual, base 0 (como `TablePagination`). */
  pagina: number;
  limite: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarLimite: (limite: number) => void;
  /** Hay datos en pantalla y se están trayendo otros (cambio de página, recarga…). */
  actualizando: boolean;
}

/**
 * Estado y consultas de una tabla paginada en el servidor.
 *
 * - Primera carga (o `refrescar`) → `cargando` (la tabla muestra esqueletos).
 * - Cambios de página, búsqueda, filtros o recargas por WebSocket → `actualizando`:
 *   se conservan las filas actuales hasta que llegan las nuevas.
 * - Si una respuesta vieja llega después de una más reciente, se descarta.
 * - Si al borrar un registro la página se queda vacía, retrocede a la última con datos.
 */
export function usePaginacionServidor<T, R extends RespuestaPaginada<T> = RespuestaPaginada<T>>({
  consultar,
  filtros = [],
  habilitado = true,
  limiteInicial = 10,
  mensajeError = (error) => `Error al cargar los datos: ${error instanceof Error ? error.message : String(error)}`,
}: OpcionesPaginacionServidor<T, R>) {
  const [pagina, setPagina] = React.useState(0);
  const [limite, setLimite] = React.useState(limiteInicial);
  const [busqueda, setBusquedaInmediata] = React.useState('');
  const [busquedaAplicada, setBusquedaAplicada] = React.useState('');
  const [version, setVersion] = React.useState(0);

  const [respuesta, setRespuesta] = React.useState<R | null>(null);
  const [cargando, setCargando] = React.useState(habilitado);
  const [actualizando, setActualizando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const idPeticion = React.useRef(0);
  const forzarCarga = React.useRef(true);
  const hayDatos = React.useRef(false);
  // Refs para no reiniciar el efecto de consulta si el padre pasa funciones nuevas en cada render
  const consultarRef = React.useRef(consultar);
  const mensajeErrorRef = React.useRef(mensajeError);
  consultarRef.current = consultar;
  mensajeErrorRef.current = mensajeError;

  const claveFiltros = JSON.stringify(filtros);
  const claveFiltrosAnterior = React.useRef(claveFiltros);

  // Búsqueda con espera: al aplicarse vuelve a la primera página en el mismo render
  React.useEffect(() => {
    if (busqueda === busquedaAplicada) return undefined;
    const temporizador = setTimeout(() => {
      setBusquedaAplicada(busqueda);
      setPagina(0);
    }, ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [busqueda, busquedaAplicada]);

  React.useEffect(() => {
    if (!habilitado) {
      idPeticion.current += 1;
      setRespuesta(null);
      hayDatos.current = false;
      setCargando(false);
      setActualizando(false);
      setError(null);
      return;
    }

    // Filtros nuevos → primera página. Si no estábamos en ella, este cambio de
    // página vuelve a disparar el efecto y la consulta sale una sola vez.
    if (claveFiltros !== claveFiltrosAnterior.current) {
      claveFiltrosAnterior.current = claveFiltros;
      if (pagina !== 0) {
        idPeticion.current += 1; // descarta la respuesta en curso, que traería los filtros viejos
        setPagina(0);
        return;
      }
    }

    const id = ++idPeticion.current;
    const conEsqueleto = forzarCarga.current || !hayDatos.current;
    forzarCarga.current = false;
    if (conEsqueleto) setCargando(true);
    else setActualizando(true);

    consultarRef
      .current({ pagina: pagina + 1, limite, busqueda: busquedaAplicada || undefined })
      .then((resultado) => {
        if (id !== idPeticion.current) return;
        // Página vacía por encima de la última (p. ej. se eliminó su único registro)
        if (resultado.Datos.length === 0 && pagina > 0 && resultado.Total > 0) {
          setPagina(Math.max(0, Math.ceil(resultado.Total / limite) - 1));
          return;
        }
        setRespuesta(resultado);
        hayDatos.current = true;
        setError(null);
      })
      .catch((err: unknown) => {
        if (id !== idPeticion.current) return;
        setError(mensajeErrorRef.current(err));
      })
      .finally(() => {
        if (id !== idPeticion.current) return;
        setCargando(false);
        setActualizando(false);
      });
  }, [habilitado, pagina, limite, busquedaAplicada, version, claveFiltros]);

  /** Vuelve a consultar la página actual sin vaciar la tabla (eventos de WebSocket, etc.). */
  const recargar = React.useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  /** Botón "Actualizar": limpia la búsqueda, vuelve a la primera página y muestra la carga. */
  const refrescar = React.useCallback(() => {
    forzarCarga.current = true;
    setBusquedaInmediata('');
    setBusquedaAplicada('');
    setPagina(0);
    setVersion((v) => v + 1);
  }, []);

  const setBusqueda = React.useCallback((texto: string) => {
    setBusquedaInmediata(texto);
  }, []);

  const paginacionTabla: PaginacionTablaServidor = {
    total: respuesta?.Total ?? 0,
    pagina,
    limite,
    onCambiarPagina: setPagina,
    onCambiarLimite: (nuevo) => {
      setLimite(nuevo);
      setPagina(0);
    },
    actualizando,
  };

  return {
    datos: (respuesta?.Datos ?? []) as T[],
    respuesta,
    total: respuesta?.Total ?? 0,
    cargando,
    actualizando,
    error,
    busqueda,
    setBusqueda,
    pagina,
    limite,
    recargar,
    refrescar,
    paginacionTabla,
  };
}
