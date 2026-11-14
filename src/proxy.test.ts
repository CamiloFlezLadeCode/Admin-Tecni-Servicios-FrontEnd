import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { config, proxy } from '@/proxy';

function peticion(ruta: string, rol?: string) {
  const req = new NextRequest(new URL(ruta, 'http://localhost:3001'));
  if (rol) req.cookies.set('custom-auth-rol', rol);
  return req;
}

describe('proxy (guardia de /dashboard/configuraciones)', () => {
  it('solo se ejecuta sobre configuraciones', () => {
    expect(config.matcher).toEqual(['/dashboard/configuraciones/:path*']);
  });

  it('redirige a /errors/unauthorized si el rol no es Administrador', () => {
    for (const rol of [undefined, 'Operativo']) {
      const respuesta = proxy(peticion('/dashboard/configuraciones', rol));
      expect(respuesta.status).toBe(307);
      expect(respuesta.headers.get('location')).toBe('http://localhost:3001/errors/unauthorized');
    }
  });

  it('deja pasar al Administrador', () => {
    const respuesta = proxy(peticion('/dashboard/configuraciones/usuarios', 'Administrador'));
    expect(respuesta.headers.get('location')).toBeNull();
    expect(respuesta.headers.get('x-middleware-next')).toBe('1');
  });

  it('no intercepta otras rutas', () => {
    const respuesta = proxy(peticion('/dashboard/comercial', 'Operativo'));
    expect(respuesta.headers.get('x-middleware-next')).toBe('1');
  });
});
