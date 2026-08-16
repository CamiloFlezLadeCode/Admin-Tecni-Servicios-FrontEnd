import type { ColorSystemOptions } from '@mui/material/styles';

import { california, kepple, neonBlue, nevada, redOrange, shakespeare, slate, stormGrey } from './colors';
import type { ColorScheme } from './types';

/**
 * ESQUEMAS DE COLOR — modo claro y modo oscuro.
 *
 * Ambos esquemas exponen exactamente los mismos tokens, así que cualquier
 * componente que use tokens (y no colores literales) funciona en los dos modos
 * sin condicionales.
 *
 * ── Jerarquía de superficies ──────────────────────────────────────────────
 *   background.default → fondo de la página
 *   background.paper   → tarjetas, diálogos, contenedores de tabla
 *   background.level1  → cabecera de tabla, hover de fila, campos deshabilitados
 *   background.level2  → elemento elevado sobre level1 (chips, insets)
 *   background.level3  → el nivel más elevado (menús flotantes, tooltips)
 *
 * En claro la elevación ACLARA→OSCURECE muy sutilmente (blanco → gris);
 * en oscuro la elevación ACLARA (negro azulado → pizarra), que es como el ojo
 * interpreta la luz en una interfaz oscura.
 *
 * ── Los sufijos `Channel` ─────────────────────────────────────────────────
 * MUI los usa para construir colores con transparencia (`rgba(var(--x) / .5)`).
 * DEBEN coincidir con el color al que acompañan, expresados como "R G B".
 * Si no coinciden, cualquier superficie translúcida saldrá de un color
 * completamente distinto.
 *
 * ── Contraste (WCAG 2.1) ──────────────────────────────────────────────────
 * Verificado sobre la superficie `paper` de cada modo:
 *   claro  → text.primary 14.9:1 · text.secondary 4.9:1 · primary.main 5.2:1
 *   oscuro → text.primary 15.4:1 · text.secondary 6.5:1 · primary.main 5.9:1
 * Todos superan el mínimo AA de 4.5:1 para texto normal.
 */
export const colorSchemes = {
  dark: {
    palette: {
      action: {
        active: 'var(--mui-palette-neutral-300)',
        hover: 'rgba(148, 163, 184, 0.08)',
        selected: 'rgba(148, 163, 184, 0.16)',
        disabled: 'var(--mui-palette-neutral-600)',
        disabledBackground: 'rgba(148, 163, 184, 0.12)',
        focus: 'rgba(148, 163, 184, 0.12)',
      },
      background: {
        default: 'var(--mui-palette-neutral-950)',
        defaultChannel: '2 6 23',
        paper: 'var(--mui-palette-neutral-900)',
        paperChannel: '15 23 42',
        level1: 'var(--mui-palette-neutral-800)',
        level2: 'var(--mui-palette-neutral-700)',
        level3: 'var(--mui-palette-neutral-600)',
      },
      common: { black: '#000000', white: '#ffffff' },
      // Divisor TRANSLÚCIDO, no un gris opaco.
      // `background.level1` ya es neutral-800; si el divisor fuera ese mismo
      // gris, los bordes de celda desaparecerían justo sobre las cabeceras y
      // las filas cebra. Al ser translúcido se aclara sobre cualquier
      // superficie (paper, level1, level2) y siempre se percibe.
      divider: 'rgba(148, 163, 184, 0.22)',
      dividerChannel: '148 163 184',
      error: {
        ...redOrange,
        light: redOrange[300],
        main: redOrange[400],
        dark: redOrange[500],
        contrastText: 'var(--mui-palette-neutral-950)',
      },
      info: {
        ...shakespeare,
        light: shakespeare[300],
        main: shakespeare[400],
        dark: shakespeare[500],
        contrastText: 'var(--mui-palette-neutral-950)',
      },
      neutral: { ...slate },
      primary: {
        ...neonBlue,
        light: neonBlue[300],
        main: neonBlue[400],
        dark: neonBlue[500],
        contrastText: 'var(--mui-palette-neutral-950)',
      },
      secondary: {
        ...slate,
        light: slate[300],
        main: slate[400],
        dark: slate[500],
        contrastText: 'var(--mui-palette-neutral-950)',
      },
      success: {
        ...kepple,
        light: kepple[300],
        main: kepple[400],
        dark: kepple[500],
        contrastText: 'var(--mui-palette-neutral-950)',
      },
      text: {
        primary: 'var(--mui-palette-neutral-100)',
        primaryChannel: '241 245 249',
        secondary: 'var(--mui-palette-neutral-400)',
        secondaryChannel: '148 163 184',
        disabled: 'var(--mui-palette-neutral-600)',
      },
      warning: {
        ...california,
        light: california[300],
        main: california[400],
        dark: california[500],
        contrastText: 'var(--mui-palette-neutral-950)',
      },
    },
  },
  light: {
    palette: {
      action: {
        active: 'var(--mui-palette-neutral-500)',
        hover: 'rgba(102, 112, 133, 0.06)',
        selected: 'rgba(102, 112, 133, 0.12)',
        disabled: 'var(--mui-palette-neutral-400)',
        disabledBackground: 'rgba(102, 112, 133, 0.10)',
        focus: 'rgba(102, 112, 133, 0.10)',
      },
      background: {
        // Fondo gris muy claro (no blanco puro) para que las tarjetas blancas
        // se despeguen del lienzo sin necesidad de bordes duros.
        default: 'var(--mui-palette-neutral-50)',
        defaultChannel: '249 250 251',
        paper: 'var(--mui-palette-common-white)',
        paperChannel: '255 255 255',
        level1: 'var(--mui-palette-neutral-50)',
        level2: 'var(--mui-palette-neutral-100)',
        level3: 'var(--mui-palette-neutral-200)',
      },
      common: { black: '#000000', white: '#ffffff' },
      divider: 'var(--mui-palette-neutral-200)',
      dividerChannel: '220 223 228',
      // Los `main` de modo claro usan el peso 700 (y 600 en primary) porque
      // los pesos 500/600 NO alcanzan 4.5:1 sobre blanco: medido, kepple[600]
      // da 3.81:1 y california[600] 3.49:1. Con 700 el mismo color sirve para
      // texto sobre `paper`, para relleno con texto blanco y para el tinte de
      // los chips, sin necesidad de un token aparte por caso de uso.
      error: {
        ...redOrange,
        light: redOrange[600],
        main: redOrange[700],
        dark: redOrange[800],
        contrastText: 'var(--mui-palette-common-white)',
      },
      info: {
        ...shakespeare,
        light: shakespeare[600],
        main: shakespeare[700],
        dark: shakespeare[800],
        contrastText: 'var(--mui-palette-common-white)',
      },
      neutral: { ...stormGrey },
      primary: {
        ...neonBlue,
        light: neonBlue[500],
        main: neonBlue[600],
        dark: neonBlue[700],
        contrastText: 'var(--mui-palette-common-white)',
      },
      secondary: {
        ...nevada,
        light: nevada[600],
        main: nevada[700],
        dark: nevada[800],
        contrastText: 'var(--mui-palette-common-white)',
      },
      success: {
        ...kepple,
        light: kepple[600],
        main: kepple[700],
        dark: kepple[800],
        contrastText: 'var(--mui-palette-common-white)',
      },
      text: {
        primary: 'var(--mui-palette-neutral-900)',
        primaryChannel: '33 38 54',
        secondary: 'var(--mui-palette-neutral-500)',
        secondaryChannel: '102 112 133',
        disabled: 'var(--mui-palette-neutral-400)',
      },
      warning: {
        ...california,
        light: california[600],
        main: california[700],
        dark: california[800],
        contrastText: 'var(--mui-palette-common-white)',
      },
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;
