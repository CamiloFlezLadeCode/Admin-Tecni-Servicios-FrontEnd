import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { emitirDesdeServidor, ioMock, sockets } from '@test/mocks/socket';

const colorScheme = vi.hoisted(() => ({ mode: 'light' as string | undefined, systemMode: 'light' as string | undefined }));
vi.mock('@mui/material/styles', async (original) => ({
  ...(await original<typeof import('@mui/material/styles')>()),
  useColorScheme: () => colorScheme,
}));

const { useAlertas } = await import('@/hooks/FuncionMostrarAlerta');
const { useSocketIO } = await import('@/hooks/use-WebSocket');
const { AVATAR_POR_DEFECTO_CLARO, AVATAR_POR_DEFECTO_OSCURO, useAvatarPorDefecto } = await import(
  '@/hooks/use-avatar-por-defecto'
);
const { useChartPalette } = await import('@/hooks/use-chart-palette');
const { usePopover } = await import('@/hooks/use-popover');
const { useSelection } = await import('@/hooks/use-selection');
const { useUser } = await import('@/hooks/use-user');

beforeEach(() => {
  colorScheme.mode = 'light';
  colorScheme.systemMode = 'light';
});

describe('useAlertas', () => {
  it('muestra y oculta mensajes con su tipo', () => {
    const { result } = renderHook(() => useAlertas());
    expect(result.current.mostrarAlertas).toBe(false);
    act(() => result.current.mostrarMensaje('Guardado', 'success'));
    expect(result.current).toMatchObject({ mostrarAlertas: true, mensajeAlerta: 'Guardado', tipoAlerta: 'success' });
    act(() => result.current.mostrarMensaje('Falló', 'error'));
    expect(result.current.tipoAlerta).toBe('error');
    act(() => result.current.ocultarAlerta());
    expect(result.current.mostrarAlertas).toBe(false);
  });
});

describe('useSocketIO', () => {
  it('se conecta al servidor de WebSocket configurado con reconexión', () => {
    renderHook(() => useSocketIO());
    expect(ioMock).toHaveBeenCalledWith(
      'http://ws.test',
      expect.objectContaining({ transports: ['websocket', 'polling'], reconnection: true, withCredentials: true })
    );
  });

  it.each([
    'usuario-actualizado',
    'usuario-creado',
    'vehiculo-creado',
    'vehiculo-actualizado',
    'vehiculo-eliminado',
    'equipo-creado',
    'equipo-actualizado',
    'repuesto-creado',
    'repuesto-actualizado',
    'avatar-guardado',
    'informacion-usuario-activo-actualizada',
    'proyecto-creado',
    'proyecto-actualizado',
    'remision-creada',
    'remision-eliminada',
    'orden-de-servicio-creada',
    'orden-de-servicio-eliminada',
    'devolucion-creada',
    'devolucion-eliminada',
    'devolucion-actualizada',
    'bodega-creada',
    'bodega-actualizada',
    'entrada-equipos-creada',
    'salida-equipos-creada',
    'entrada-repuestos-creada',
    'salida-repuestos-creada',
  ])('acumula el evento "%s" en messages', (evento) => {
    const { result } = renderHook(() => useSocketIO());
    act(() => emitirDesdeServidor(evento, { id: 1 }));
    expect(result.current.messages.at(-1)).toEqual({ tipo: evento, data: { id: 1 } });
  });

  it('guarda el id de conexión y el motivo de desconexión en sessionStorage', () => {
    renderHook(() => useSocketIO());
    act(() => emitirDesdeServidor('connect'));
    expect(sessionStorage.getItem('Conectado con Socket.IO, ID:')).toBe('socket-prueba');
    act(() => emitirDesdeServidor('disconnect', 'transport close'));
    expect(sessionStorage.getItem('Socket desconectado:')).toBe('transport close');
  });

  it('no guarda nada si no hay id o motivo', () => {
    renderHook(() => useSocketIO());
    sockets[0].id = '';
    act(() => emitirDesdeServidor('connect'));
    act(() => emitirDesdeServidor('disconnect', ''));
    expect(sessionStorage.length).toBe(0);
  });

  it('registra los errores de conexión', () => {
    renderHook(() => useSocketIO());
    act(() => emitirDesdeServidor('connect_error', new Error('caído')));
    expect(console.error).toHaveBeenCalled();
  });

  it('sendMessage emite por el socket y se desconecta al desmontar', () => {
    const { result, unmount } = renderHook(() => useSocketIO());
    result.current.sendMessage('bodega-creada', { a: 1 });
    expect(sockets[0].emit).toHaveBeenCalledWith('bodega-creada', { a: 1 });
    unmount();
    expect(sockets[0].disconnect).toHaveBeenCalled();
  });
});

describe('useAvatarPorDefecto / useChartPalette', () => {
  it('usan la variante clara en modo claro', async () => {
    const avatar = renderHook(() => useAvatarPorDefecto());
    const paleta = renderHook(() => useChartPalette());
    await waitFor(() => expect(paleta.result.current.montado).toBe(true));
    expect(avatar.result.current).toBe(AVATAR_POR_DEFECTO_CLARO);
    expect(paleta.result.current.modo).toBe('light');
    expect(paleta.result.current.superficie).toBe('#ffffff');
  });

  it('usan la variante oscura en modo oscuro, también si viene del sistema', async () => {
    colorScheme.mode = 'system';
    colorScheme.systemMode = 'dark';
    const avatar = renderHook(() => useAvatarPorDefecto());
    const paleta = renderHook(() => useChartPalette());
    await waitFor(() => expect(avatar.result.current).toBe(AVATAR_POR_DEFECTO_OSCURO));
    expect(paleta.result.current.modo).toBe('dark');
    expect(paleta.result.current.series).toHaveLength(5);
  });
});

describe('usePopover', () => {
  it('abre, cierra y alterna', () => {
    const { result } = renderHook(() => usePopover());
    act(() => result.current.handleOpen());
    expect(result.current.open).toBe(true);
    act(() => result.current.handleToggle());
    expect(result.current.open).toBe(false);
    act(() => result.current.handleToggle());
    act(() => result.current.handleClose());
    expect(result.current.open).toBe(false);
  });
});

describe('useSelection', () => {
  it('selecciona y deselecciona uno o todos', () => {
    const claves = ['a', 'b'];
    const { result } = renderHook(() => useSelection(claves));
    act(() => result.current.selectOne('a'));
    expect(result.current.selectedAny).toBe(true);
    expect(result.current.selectedAll).toBe(false);
    act(() => result.current.selectAll());
    expect(result.current.selectedAll).toBe(true);
    act(() => result.current.deselectOne('a'));
    expect([...result.current.selected]).toEqual(['b']);
    act(() => result.current.deselectAll());
    expect(result.current.selectedAny).toBe(false);
  });

  it('funciona sin claves', () => {
    const { result } = renderHook(() => useSelection());
    expect(result.current.selectedAll).toBe(true);
  });
});

describe('useUser', () => {
  it('exige estar dentro de un UserProvider', () => {
    expect(() => renderHook(() => useUser())).toThrow('useUser must be used within a UserProvider');
  });
});
