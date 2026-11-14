import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { nextNavigationMock, reiniciarNavegacion } from './mocks/next-navigation';
import { ioMock, reiniciarSockets } from './mocks/socket';

vi.mock('next/navigation', () => nextNavigationMock);
vi.mock('socket.io-client', () => ({ io: ioMock, default: ioMock }));

// --- APIs del navegador que jsdom no implementa ---------------------------------
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

class ResizeObserverFalso {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver ??= ResizeObserverFalso as unknown as typeof ResizeObserver;

window.scrollTo = (() => undefined) as typeof window.scrollTo;
Element.prototype.scrollIntoView ??= () => undefined;

if (!URL.createObjectURL) {
  URL.createObjectURL = () => 'blob:prueba';
  URL.revokeObjectURL = () => undefined;
}

beforeEach(() => {
  reiniciarNavegacion();
  reiniciarSockets();
  // Las pruebas que validen un console.* lo espían explícitamente.
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  vi.spyOn(console, 'debug').mockImplementation(() => undefined);
  vi.spyOn(window, 'open').mockImplementation(() => null);
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  for (const cookie of document.cookie.split(';')) {
    const nombre = cookie.split('=')[0]?.trim();
    if (nombre) document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
  vi.useRealTimers();
});
