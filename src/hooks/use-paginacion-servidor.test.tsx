import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import type { ParametrosPaginacion } from '@/types/paginacion';

type Fila = { Id: number };

function respuesta(Datos: Fila[], Total = Datos.length) {
  return { Datos, Total, Pagina: 1, Limite: 10, TotalPaginas: Math.ceil(Total / 10) };
}

function diferida<T>() {
  let resolver!: (valor: T) => void;
  const promesa = new Promise<T>((r) => {
    resolver = r;
  });
  return { promesa, resolver };
}

describe('usePaginacionServidor', () => {
  it('primera carga: muestra esqueleto, pide la página 1 y expone los datos', async () => {
    const consultar = vi.fn().mockResolvedValue(respuesta([{ Id: 1 }], 31));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    expect(result.current.cargando).toBe(true);
    await waitFor(() => expect(result.current.cargando).toBe(false));
    expect(consultar).toHaveBeenCalledWith({ pagina: 1, limite: 10, busqueda: undefined });
    expect(result.current.datos).toEqual([{ Id: 1 }]);
    expect(result.current.total).toBe(31);
    expect(result.current.paginacionTabla).toMatchObject({ total: 31, pagina: 0, limite: 10, actualizando: false });
  });

  it('cambiar de página o de límite consulta sin esqueleto (actualizando)', async () => {
    const consultar = vi.fn().mockResolvedValue(respuesta([{ Id: 1 }], 40));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    await waitFor(() => expect(result.current.cargando).toBe(false));

    act(() => result.current.paginacionTabla.onCambiarPagina(2));
    expect(result.current.actualizando).toBe(true);
    expect(result.current.cargando).toBe(false);
    await waitFor(() => expect(result.current.actualizando).toBe(false));
    expect(consultar).toHaveBeenLastCalledWith({ pagina: 3, limite: 10, busqueda: undefined });

    act(() => result.current.paginacionTabla.onCambiarLimite(25));
    await waitFor(() => expect(consultar).toHaveBeenLastCalledWith({ pagina: 1, limite: 25, busqueda: undefined }));
  });

  it('la búsqueda espera 350 ms, vuelve a la primera página y solo consulta una vez', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const consultar = vi.fn().mockResolvedValue(respuesta([{ Id: 1 }], 40));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    await waitFor(() => expect(result.current.cargando).toBe(false));
    act(() => result.current.paginacionTabla.onCambiarPagina(1));
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(2));

    act(() => result.current.setBusqueda('ab'));
    act(() => result.current.setBusqueda('abc'));
    expect(result.current.busqueda).toBe('abc');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(349);
    });
    expect(consultar).toHaveBeenCalledTimes(2);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(3));
    expect(consultar).toHaveBeenLastCalledWith({ pagina: 1, limite: 10, busqueda: 'abc' });
    expect(result.current.pagina).toBe(0);
  });

  it('al cambiar los filtros vuelve a la primera página con una sola consulta', async () => {
    const consultar = vi.fn().mockResolvedValue(respuesta([{ Id: 1 }], 40));
    const { result, rerender } = renderHook(({ filtros }) => usePaginacionServidor<Fila>({ consultar, filtros }), {
      initialProps: { filtros: ['a'] },
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    act(() => result.current.paginacionTabla.onCambiarPagina(2));
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(2));

    rerender({ filtros: ['b'] });
    await waitFor(() => expect(result.current.pagina).toBe(0));
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(3));
    expect(consultar).toHaveBeenLastCalledWith({ pagina: 1, limite: 10, busqueda: undefined });

    // Filtros nuevos estando ya en la primera página: consulta directa
    rerender({ filtros: ['c'] });
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(4));
  });

  it('descarta respuestas viejas que llegan después de una más reciente', async () => {
    const vieja = diferida<ReturnType<typeof respuesta>>();
    const consultar = vi
      .fn<(p: ParametrosPaginacion) => Promise<ReturnType<typeof respuesta>>>()
      .mockReturnValueOnce(vieja.promesa)
      .mockResolvedValue(respuesta([{ Id: 2 }]));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    act(() => result.current.recargar());
    await waitFor(() => expect(result.current.datos).toEqual([{ Id: 2 }]));
    await act(async () => {
      vieja.resolver(respuesta([{ Id: 1 }]));
      await vieja.promesa;
    });
    expect(result.current.datos).toEqual([{ Id: 2 }]);
  });

  it('descarta también errores viejos', async () => {
    let rechazar!: (e: unknown) => void;
    const consultar = vi
      .fn()
      .mockReturnValueOnce(
        new Promise((_, r) => {
          rechazar = r;
        })
      )
      .mockResolvedValue(respuesta([{ Id: 2 }]));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    act(() => result.current.recargar());
    await waitFor(() => expect(result.current.datos).toEqual([{ Id: 2 }]));
    await act(async () => {
      rechazar(new Error('vieja'));
    });
    expect(result.current.error).toBeNull();
  });

  it('si la página queda vacía (se borró su único registro) retrocede a la última con datos', async () => {
    const consultar = vi
      .fn()
      .mockResolvedValueOnce(respuesta([{ Id: 1 }], 21))
      .mockResolvedValueOnce(respuesta([], 20))
      .mockResolvedValue(respuesta([{ Id: 20 }], 20));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    await waitFor(() => expect(result.current.cargando).toBe(false));
    act(() => result.current.paginacionTabla.onCambiarPagina(2));
    await waitFor(() => expect(result.current.pagina).toBe(1));
    await waitFor(() => expect(result.current.datos).toEqual([{ Id: 20 }]));
  });

  it('muestra el mensaje de error por defecto o el personalizado', async () => {
    const consultar = vi.fn().mockRejectedValue(new Error('caído'));
    const porDefecto = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    await waitFor(() => expect(porDefecto.result.current.error).toBe('Error al cargar los datos: caído'));

    const conTexto = renderHook(() => usePaginacionServidor<Fila>({ consultar: vi.fn().mockRejectedValue('texto') }));
    await waitFor(() => expect(conTexto.result.current.error).toBe('Error al cargar los datos: texto'));

    const personalizado = renderHook(() =>
      usePaginacionServidor<Fila>({ consultar, mensajeError: () => 'Error al actualizar las bodegas' })
    );
    await waitFor(() => expect(personalizado.result.current.error).toBe('Error al actualizar las bodegas'));
  });

  it('refrescar limpia la búsqueda, vuelve a la página 1 y muestra el esqueleto', async () => {
    const consultar = vi.fn().mockResolvedValue(respuesta([{ Id: 1 }], 40));
    const { result } = renderHook(() => usePaginacionServidor<Fila>({ consultar }));
    await waitFor(() => expect(result.current.cargando).toBe(false));
    act(() => {
      result.current.setBusqueda('x');
      result.current.paginacionTabla.onCambiarPagina(3);
    });
    act(() => result.current.refrescar());
    expect(result.current.busqueda).toBe('');
    expect(result.current.cargando).toBe(true);
    await waitFor(() => expect(result.current.cargando).toBe(false));
    expect(consultar).toHaveBeenLastCalledWith({ pagina: 1, limite: 10, busqueda: undefined });
  });

  it('deshabilitado no consulta y limpia los datos', async () => {
    const consultar = vi.fn().mockResolvedValue(respuesta([{ Id: 1 }]));
    const { result, rerender } = renderHook(({ habilitado }) => usePaginacionServidor<Fila>({ consultar, habilitado }), {
      initialProps: { habilitado: false },
    });
    expect(result.current.cargando).toBe(false);
    expect(consultar).not.toHaveBeenCalled();
    rerender({ habilitado: true });
    await waitFor(() => expect(result.current.datos).toHaveLength(1));
    rerender({ habilitado: false });
    expect(result.current.datos).toEqual([]);
    expect(result.current.respuesta).toBeNull();
  });

  it('respeta el límite inicial', async () => {
    const consultar = vi.fn().mockResolvedValue(respuesta([]));
    renderHook(() => usePaginacionServidor<Fila>({ consultar, limiteInicial: 5 }));
    await waitFor(() => expect(consultar).toHaveBeenCalledWith({ pagina: 1, limite: 5, busqueda: undefined }));
  });
});
