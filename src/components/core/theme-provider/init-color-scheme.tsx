'use client';

import * as React from 'react';
import { getInitColorSchemeScript } from '@mui/material/styles';

import { COLOR_MODE_STORAGE_KEY, COLOR_SCHEME_STORAGE_KEY, DEFAULT_COLOR_MODE } from './color-mode-config';

/**
 * Script de arranque que aplica el tema guardado ANTES del primer pintado.
 * Sin él la página se pinta en claro y salta a oscuro al hidratar (FOUC), que
 * es el defecto más visible de un modo oscuro mal montado.
 *
 * Va envuelto en un componente cliente por obligación, no por gusto: el módulo
 * de MUI que exporta `getInitColorSchemeScript` está marcado `'use client'`, así
 * que INVOCAR la función desde el layout raíz (que es un Server Component)
 * rompe el build con "Attempted to call getInitColorSchemeScript() from the
 * server". Renderizarla dentro de un componente cliente sí es válido, y como
 * este se renderiza también en SSR, la etiqueta `<script>` sigue llegando en el
 * HTML inicial y ejecutándose antes de la hidratación, que es justo lo que
 * necesitamos.
 *
 * No añade JavaScript de cliente apreciable: el componente no tiene estado ni
 * efectos, sólo emite el script.
 */
export function InitColorScheme(): React.JSX.Element {
  return (
    <React.Fragment>
      {getInitColorSchemeScript({
        defaultMode: DEFAULT_COLOR_MODE,
        modeStorageKey: COLOR_MODE_STORAGE_KEY,
        colorSchemeStorageKey: COLOR_SCHEME_STORAGE_KEY,
      })}
    </React.Fragment>
  );
}
