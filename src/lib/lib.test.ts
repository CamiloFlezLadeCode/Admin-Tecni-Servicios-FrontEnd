import { afterEach, describe, expect, it, vi } from 'vitest';

import { EmpresaAnfitriona } from '@/lib/constants/option-default';
import { getSiteURL } from '@/lib/get-site-url';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { createLogger, Logger, LogLevel } from '@/lib/logger';
import { OrdenarSubarrendatarios } from '@/lib/order/orders';
import { paths } from '@/paths';

describe('getSiteURL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('usa localhost por defecto con barra final', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined as unknown as string);
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', undefined as unknown as string);
    expect(getSiteURL()).toBe('http://localhost:3000/');
  });

  it('agrega https:// y la barra final cuando faltan', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'tecni.com');
    expect(getSiteURL()).toBe('https://tecni.com/');
  });

  it('respeta una URL ya completa', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://tecni.com/');
    expect(getSiteURL()).toBe('http://tecni.com/');
  });

  it('usa la URL de Vercel si no hay URL del sitio', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined as unknown as string);
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', 'app.vercel.app');
    expect(getSiteURL()).toBe('https://app.vercel.app/');
  });
});

describe('isNavItemActive', () => {
  it('nunca marca ítems deshabilitados, externos o sin href', () => {
    expect(isNavItemActive({ disabled: true, href: '/a', pathname: '/a' })).toBe(false);
    expect(isNavItemActive({ external: true, href: '/a', pathname: '/a' })).toBe(false);
    expect(isNavItemActive({ pathname: '/a' })).toBe(false);
  });

  it('sin matcher compara la ruta exacta', () => {
    expect(isNavItemActive({ href: '/a', pathname: '/a' })).toBe(true);
    expect(isNavItemActive({ href: '/a', pathname: '/a/b' })).toBe(false);
  });

  it('startsWith compara por segmentos, no por prefijo de texto', () => {
    const matcher = { type: 'startsWith' as const, href: '/dashboard/inventario/equipos' };
    const base = { href: '/x', matcher };
    expect(isNavItemActive({ ...base, pathname: '/dashboard/inventario/equipos' })).toBe(true);
    expect(isNavItemActive({ ...base, pathname: '/dashboard/inventario/equipos/stock' })).toBe(true);
    expect(isNavItemActive({ ...base, pathname: '/dashboard/inventario/equipos-usados' })).toBe(false);
    const conBarra = { href: '/x', matcher: { type: 'startsWith' as const, href: '/dashboard/' } };
    expect(isNavItemActive({ ...conBarra, pathname: '/dashboard/a' })).toBe(true);
  });

  it('equals exige igualdad y un tipo desconocido nunca coincide', () => {
    expect(isNavItemActive({ href: '/x', matcher: { type: 'equals', href: '/a' }, pathname: '/a' })).toBe(true);
    expect(isNavItemActive({ href: '/x', matcher: { type: 'equals', href: '/a' }, pathname: '/a/b' })).toBe(false);
    expect(isNavItemActive({ href: '/x', matcher: { type: 'otro' as never, href: '/a' }, pathname: '/a' })).toBe(false);
  });
});

describe('Logger', () => {
  it('con nivel ALL escribe debug, warn y error con prefijo de nivel', () => {
    const log = vi.spyOn(console, 'log');
    const error = vi.spyOn(console, 'error');
    const logger = createLogger({ prefix: '[App]' });
    logger.debug('d');
    logger.warn('w');
    logger.error('e');
    expect(log).toHaveBeenCalledWith('- DEBUG [App]', 'd');
    expect(log).toHaveBeenCalledWith('- WARN [App]', 'w');
    expect(error).toHaveBeenCalledWith('- ERROR [App]', 'e');
  });

  it('filtra por nivel y puede ocultar el nivel', () => {
    const log = vi.spyOn(console, 'log');
    const error = vi.spyOn(console, 'error');
    const logger = new Logger({ level: LogLevel.ERROR, showLevel: false, prefix: 'p' });
    logger.debug('no');
    logger.warn('no');
    logger.error('si');
    expect(log).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith('p', 'si');
  });

  it('con NONE no escribe nada', () => {
    const error = vi.spyOn(console, 'error');
    new Logger({ level: LogLevel.NONE }).error('x');
    expect(error).not.toHaveBeenCalled();
  });
});

describe('OrdenarSubarrendatarios', () => {
  it('devuelve [] si no hay lista o no es un arreglo', async () => {
    expect(await OrdenarSubarrendatarios({})).toEqual([]);
    expect(await OrdenarSubarrendatarios({ AllSubarrendatarios: 'x' as never })).toEqual([]);
  });

  it('descarta opciones sin label o value', async () => {
    const lista = [
      { label: ' ', value: '1' },
      { label: 'A', value: '' },
    ];
    expect(await OrdenarSubarrendatarios({ AllSubarrendatarios: lista })).toEqual([]);
  });

  it('pone primero a la empresa anfitriona si está en la lista', async () => {
    const lista = [{ label: 'Otro', value: '1' }, { ...EmpresaAnfitriona }];
    expect(await OrdenarSubarrendatarios({ AllSubarrendatarios: lista })).toEqual([
      EmpresaAnfitriona,
      { label: 'Otro', value: '1' },
    ]);
  });

  it('conserva el orden si la anfitriona no está', async () => {
    const lista = [
      { label: 'B', value: '2' },
      { label: 'A', value: '1' },
    ];
    expect(await OrdenarSubarrendatarios({ AllSubarrendatarios: lista })).toEqual(lista);
  });
});

describe('paths', () => {
  it('todas las rutas del panel cuelgan de /dashboard', () => {
    for (const ruta of Object.values(paths.dashboard)) expect(ruta.startsWith('/dashboard')).toBe(true);
    expect(paths.auth.signIn).toBe('/auth/sign-in');
  });
});
