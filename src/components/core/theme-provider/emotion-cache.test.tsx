import * as React from 'react';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NextAppDirEmotionCacheProvider from '@/components/core/theme-provider/emotion-cache';
import { htmlInsertadoEnServidor } from '@test/mocks/next-navigation';

/** Ejecuta el último callback de `useServerInsertedHTML` como lo haría Next en SSR. */
function estilosInsertados(): HTMLStyleElement[] {
  const html = htmlInsertadoEnServidor.at(-1)!() as React.ReactElement | null;
  if (!html) return [];
  const { container } = render(html);
  return Array.from(container.querySelectorAll('style'));
}

/**
 * En el navegador emotion guarda `true` en `cache.inserted` (ya inyectó el CSS);
 * en el servidor guarda el texto CSS. Se captura la caché para simular lo segundo.
 */
function montar(hijos: React.ReactNode): EmotionCache {
  let cache: EmotionCache | undefined;
  function Proveedor({ value, children }: { value: EmotionCache; children: React.ReactNode }): React.JSX.Element {
    cache = value;
    return <CacheProvider value={value}>{children}</CacheProvider>;
  }
  render(
    <NextAppDirEmotionCacheProvider options={{ key: 'prueba' }} CacheProvider={Proveedor}>
      {hijos}
    </NextAppDirEmotionCacheProvider>
  );
  return cache!;
}

describe('NextAppDirEmotionCacheProvider', () => {
  it('crea la caché con la clave pedida y en modo compatible', () => {
    const cache = montar(<span>contenido</span>);
    expect(cache.key).toBe('prueba');
    expect(cache.compat).toBe(true);
  });

  it('en SSR entrega los estilos globales y de componentes una sola vez', () => {
    const cache = montar(
      <>
        <GlobalStyles styles={{ body: { margin: 0 } }} />
        <Box sx={{ color: 'red' }}>hola</Box>
      </>
    );
    // <Global> de emotion usa su propia hoja: se registra a mano una inserción global (selector vacío).
    cache.insert('', { name: 'global-prueba', styles: 'body{margin:0;}', next: undefined }, cache.sheet, true);
    // Simula el servidor: el CSS se guarda como texto.
    const nombres = Object.keys(cache.inserted);
    for (const nombre of nombres) cache.inserted[nombre] = `/*${nombre}*/`;

    const estilos = estilosInsertados();
    const globales = estilos.filter((e) => e.dataset.emotion?.startsWith('prueba-global'));
    const componentes = estilos.filter((e) => e.dataset.emotion?.startsWith('prueba '));
    expect(globales).toHaveLength(1);
    expect(componentes).toHaveLength(1);
    expect(globales[0].innerHTML + componentes[0].innerHTML).toContain('/*');
    // Lo ya entregado no se repite en el siguiente flush.
    expect(estilosInsertados()).toHaveLength(0);
  });

  it('omite los estilos registrados sin CSS', () => {
    const cache = montar(
      <>
        <GlobalStyles styles={{ body: { padding: 0 } }} />
        <Box sx={{ color: 'purple' }}>hola</Box>
      </>
    );
    cache.insert('', { name: 'global-vacio', styles: 'body{}', next: undefined }, cache.sheet, true);
    for (const nombre of Object.keys(cache.inserted)) cache.inserted[nombre] = undefined as unknown as string;
    expect(estilosInsertados()).toHaveLength(0);
  });

  it('en el navegador no duplica estilos ya inyectados', () => {
    montar(<Box sx={{ color: 'green' }}>hola</Box>);
    const fragmento = htmlInsertadoEnServidor.at(-1)!() as React.ReactElement;
    const { container } = render(fragmento);
    expect(container.querySelectorAll('style')).toHaveLength(0);
  });
});
