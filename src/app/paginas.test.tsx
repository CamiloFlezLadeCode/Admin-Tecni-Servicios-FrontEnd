import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { simularApi } from '@test/mocks/api';
import { rutasBase } from '@test/mocks/fixtures';
import { navegacion } from '@test/mocks/next-navigation';
import { act, renderConProveedores, screen } from '@test/utils';

/**
 * Prueba de humo de TODAS las rutas del App Router: cada `page.tsx` y `layout.tsx`
 * debe renderizar sin romperse con el backend respondiendo listas vacías.
 * Las reglas de negocio de cada pantalla se prueban en los componentes.
 */

type Modulo = { default: React.ComponentType<{ children?: React.ReactNode }>; metadata?: { title?: string } };

const paginas = import.meta.glob<Modulo>(['./**/page.tsx', '!./page.tsx'], { eager: true });
const layouts = import.meta.glob<Modulo>(['./**/layout.tsx', '!./layout.tsx'], { eager: true });
const raiz = import.meta.glob<Modulo>(['./layout.tsx', './not-found.tsx'], { eager: true });

async function renderizar(Componente: Modulo['default'], ruta: string) {
  navegacion.pathname = ruta;
  const resultado = renderConProveedores(<Componente>contenido-de-la-ruta</Componente>);
  // Deja resolver las cargas iniciales (promesas de servicios y temporizadores cortos).
  await act(async () => {
    await new Promise((r) => setTimeout(r, 30));
  });
  return resultado;
}

const aRuta = (archivo: string) => `/${archivo.replace(/^\.\//, '').replace(/\/?(page|layout)\.tsx$/, '')}`;

describe('páginas', () => {
  it('descubre todas las páginas', () => {
    expect(Object.keys(paginas).length).toBeGreaterThan(60);
  });

  for (const [archivo, modulo] of Object.entries(paginas)) {
    it(`${aRuta(archivo)} renderiza`, async () => {
      const api = simularApi({ ...rutasBase });
      await renderizar(modulo.default, aRuta(archivo));
      expect(console.error).not.toHaveBeenCalledWith(expect.stringMatching(/The above error occurred/), expect.anything());
      expect(api.peticiones.every((p) => p.ruta.startsWith('/'))).toBe(true);
      if (modulo.metadata?.title) expect(modulo.metadata.title).toMatch(/TecniServicios$/);
    });
  }
});

describe('layouts', () => {
  for (const [archivo, modulo] of Object.entries(layouts)) {
    it(`${aRuta(archivo)} envuelve a sus hijos`, async () => {
      simularApi({ ...rutasBase });
      await renderizar(modulo.default, aRuta(archivo));
      expect(await screen.findByText('contenido-de-la-ruta')).toBeInTheDocument();
    });
  }
});

describe('raíz de la aplicación', () => {
  it('not-found ofrece volver al inicio', async () => {
    const { default: NoEncontrada } = raiz['./not-found.tsx'];
    await renderizar(NoEncontrada, '/no-existe');
    expect(screen.getByRole('link')).toHaveAttribute('href', expect.stringMatching(/^\//));
  });

  it('el layout raíz monta proveedores con idioma español', () => {
    const { default: LayoutRaiz } = raiz['./layout.tsx'];
    // El layout raíz pinta <html>/<body>: se renderiza como elemento para inspeccionarlo.
    const arbol = (LayoutRaiz as (props: { children: React.ReactNode }) => React.ReactNode)({ children: 'x' }) as React.ReactElement<{ lang: string }>;
    expect(arbol.props.lang).toBe('es');
  });

  it('la página raíz redirige al panel', async () => {
    const { redirect } = await import('next/navigation');
    const { default: Inicio } = await import('@/app/page');
    try {
      Inicio();
    } catch {
      // redirect lanza en Next; aquí está simulado.
    }
    expect(vi.mocked(redirect)).toHaveBeenCalled();
  });
});
