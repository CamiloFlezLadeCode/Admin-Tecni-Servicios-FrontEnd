import { vi } from 'vitest';

type Manejador = (...args: unknown[]) => void;

/**
 * Socket.IO falso: registra los manejadores (`on`) y las emisiones (`emit`) para
 * que las pruebas puedan simular eventos del servidor con `emitirDesdeServidor`.
 */
export class SocketFalso {
  id = 'socket-prueba';
  connected = true;
  manejadores = new Map<string, Manejador[]>();
  emit = vi.fn();
  disconnect = vi.fn(() => {
    this.connected = false;
  });
  off = vi.fn((evento: string) => {
    this.manejadores.delete(evento);
  });
  on = vi.fn((evento: string, manejador: Manejador) => {
    const lista = this.manejadores.get(evento) ?? [];
    lista.push(manejador);
    this.manejadores.set(evento, lista);
    return this;
  });

  disparar(evento: string, ...args: unknown[]): void {
    for (const manejador of this.manejadores.get(evento) ?? []) manejador(...args);
  }
}

export const sockets: SocketFalso[] = [];

export const ioMock = vi.fn((..._args: unknown[]) => {
  const socket = new SocketFalso();
  sockets.push(socket);
  return socket;
});

/** Simula un evento emitido por el servidor hacia todos los sockets abiertos. */
export function emitirDesdeServidor(evento: string, ...args: unknown[]): void {
  for (const socket of sockets) socket.disparar(evento, ...args);
}

export function reiniciarSockets(): void {
  sockets.length = 0;
  ioMock.mockClear();
}
