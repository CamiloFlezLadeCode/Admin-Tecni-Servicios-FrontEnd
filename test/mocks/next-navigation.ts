import { vi } from 'vitest';

/** Espías compartidos del router de Next; se reinician antes de cada prueba. */
export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

export const navegacion = {
  pathname: '/dashboard',
  searchParams: new URLSearchParams(),
};

/** Callbacks registrados con `useServerInsertedHTML` (solo se ejecutan en SSR; aquí se invocan a mano). */
export const htmlInsertadoEnServidor: (() => unknown)[] = [];

export function reiniciarNavegacion(): void {
  for (const espia of Object.values(routerMock)) espia.mockReset();
  navegacion.pathname = '/dashboard';
  navegacion.searchParams = new URLSearchParams();
  htmlInsertadoEnServidor.length = 0;
}

export const nextNavigationMock = {
  useRouter: () => routerMock,
  usePathname: () => navegacion.pathname,
  useSearchParams: () => navegacion.searchParams,
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
  useServerInsertedHTML: (callback: () => unknown) => {
    htmlInsertadoEnServidor.push(callback);
  },
};
