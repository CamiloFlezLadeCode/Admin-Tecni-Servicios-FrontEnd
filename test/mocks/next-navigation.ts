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

export function reiniciarNavegacion(): void {
  for (const espia of Object.values(routerMock)) espia.mockReset();
  navegacion.pathname = '/dashboard';
  navegacion.searchParams = new URLSearchParams();
}

export const nextNavigationMock = {
  useRouter: () => routerMock,
  usePathname: () => navegacion.pathname,
  useSearchParams: () => navegacion.searchParams,
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
};
