'use client';

import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';

import { california, kepple, neonBlue, redOrange, shakespeare, slate, stormGrey } from '@/styles/theme/colors';

/**
 * PALETA DE GRÁFICAS (ApexCharts)
 *
 * ── Por qué existe este hook (no es obvio) ────────────────────────────────
 * ApexCharts NO pinta con CSS: serializa cada color dentro de atributos SVG
 * (`fill`, `stroke`) y del canvas. Ahí un valor como `var(--mui-palette-...)`
 * no se resuelve — el navegador descarta el atributo y la rejilla, las
 * etiquetas de los ejes o el separador de las porciones salen negros,
 * transparentes o directamente no salen. Apex necesita colores LITERALES.
 *
 * Y con `CssVarsProvider` buena parte de `useTheme().palette` es exactamente
 * eso: strings literales con `var(...)` dentro. Basta mirar `color-schemes.ts`
 * para verlo — `divider`, `text.secondary`, `background.paper` y compañía son
 * referencias a variables CSS, no colores. Pasarle `theme.palette.*` a Apex
 * está roto por construcción; de ahí este hook.
 *
 * ── Y por qué tampoco vale `theme.palette.mode` ───────────────────────────
 * `CssVarsProvider` resuelve el objeto `theme` UNA sola vez, con el esquema
 * por defecto. `palette.mode` queda CONGELADO en ese esquema y no cambia al
 * alternar el tema en caliente. El modo real y reactivo sólo lo conoce
 * `useColorScheme()`, y es el que hay que meter en las dependencias de los
 * `useMemo` que arman las opciones de Apex para que el gráfico se repinte.
 *
 * ── Hidratación ───────────────────────────────────────────────────────────
 * `useColorScheme()` no conoce el modo hasta después de montar: el servidor no
 * sabe ni qué eligió la persona ni qué prefiere su sistema. Por eso se expone
 * `montado` (mismo patrón que `color-scheme-toggle.tsx`): hasta que sea `true`,
 * quien consuma el hook debe pintar un placeholder de la misma altura en lugar
 * del gráfico. Así no hay desajuste de hidratación, ni un fogonazo con la
 * paleta equivocada, ni salto de layout.
 *
 * ── Reparto de responsabilidades ──────────────────────────────────────────
 * Este hook cubre SÓLO lo que Apex dibuja en SVG. El cromo que Apex dibuja en
 * HTML (tooltip, leyenda, menú del toolbar) es CSS normal y se tematiza con
 * tokens en `components/core/chart.tsx`, donde cambia solo. Fuera de las
 * opciones de Apex nunca uses estos hex: usa los tokens `var(--mui-palette-*)`.
 */

export type ModoGrafica = 'light' | 'dark';

/** Superficie de tarjeta del modo claro (= `common.white` / `background.paper`). */
const BLANCO = '#ffffff';

export interface PaletaGraficas {
  /** Modo realmente activo. Vale `'light'` mientras `montado` sea `false`. */
  modo: ModoGrafica;
  /** `false` en el primer render del cliente, cuando el modo aún no es fiable. */
  montado: boolean;

  /**
   * Secuencia categórica, en orden de asignación.
   *
   * Los matices están repartidos por el círculo cromático para que se
   * distingan entre sí y también bajo daltonismo:
   *   0 índigo (neonBlue) · 1 verde azulado (kepple) · 2 ámbar (california)
   *   3 cian (shakespeare) · 4 rojo anaranjado (redOrange)
   *
   * Se asignan SIEMPRE en este orden y nunca se ciclan: si hiciera falta una
   * sexta serie, se agrupa en "Otros" o se parte el gráfico en varios.
   *
   * En claro son los pesos 500/600 (oscuros, para contrastar contra el papel
   * blanco) y en oscuro los 400 (más claros, para brillar sobre la pizarra).
   * Nunca el mismo peso en ambos modos.
   */
  series: readonly string[];

  /**
   * Los mismos colores, nombrados por rol semántico. Coinciden con el hex al
   * que resuelven `primary.main`, `success.main`, etc. en el modo activo, de
   * modo que una serie y el `<Chip>` que la etiqueta se ven idénticos.
   */
  primario: string;
  exito: string;
  advertencia: string;
  info: string;
  error: string;

  /**
   * Trío de estado (correcto / atención / crítico) para gráficas de salud,
   * tipo la dona de inventario.
   *
   * OJO: en modo claro NO son `warning.main` y `error.main` tal cual. Esos dos
   * tokens (ámbar 600 y rojo 500) quedan a ΔE 8.2 en visión normal — se
   * confunden entre sí incluso sin daltonismo, y en una dona van en porciones
   * contiguas. Se reencaja el ámbar un peso más claro y el rojo uno más
   * oscuro: mismo significado, mismas familias, pero ya distinguibles.
   */
  estadoOk: string;
  estadoAdvertencia: string;
  estadoCritico: string;

  /** Etiquetas de los ejes y de la leyenda. Cumple AA sobre la tarjeta. */
  textoEje: string;
  /** Líneas de la rejilla. Deben ser recesivas: acompañan, no compiten. */
  rejilla: string;
  /** Línea base y marcas de los ejes: un escalón más marcada que la rejilla. */
  bordeEje: string;
  /** Color REAL de la tarjeta. Sirve de separador entre porciones y barras. */
  superficie: string;
  /** Fondo del tooltip (se inyecta como variable CSS, ver `chart.tsx`). */
  tooltipFondo: string;
  /** Texto del tooltip. */
  tooltipTexto: string;
}

type PaletaPorModo = Omit<PaletaGraficas, 'modo' | 'montado'>;

/**
 * Ambos juegos salen de las escalas de `styles/theme/colors.ts` — las mismas
 * de las que se construyen los tokens del tema. Aquí no se inventa ningún hex.
 *
 * Verificado con el validador de paletas (OKLab): en los dos modos, todos los
 * pares adyacentes superan el mínimo de separación bajo protanopía,
 * deuteranopía y tritanopía, y todas las series llegan a 3:1 contra su
 * superficie. La única excepción conocida es el ámbar claro (2.35:1), que se
 * compensa con leyenda y etiquetas visibles.
 */
const PALETAS: Record<ModoGrafica, PaletaPorModo> = {
  light: {
    series: [neonBlue[500], kepple[600], california[600], shakespeare[600], redOrange[500]],
    primario: neonBlue[500],
    exito: kepple[600],
    advertencia: california[600],
    info: shakespeare[600],
    error: redOrange[500],
    estadoOk: kepple[600],
    estadoAdvertencia: california[500],
    estadoCritico: redOrange[600],
    // stormGrey es el neutro del modo claro: mismos tonos a los que apuntan
    // `text.secondary` (500) y `divider` (200).
    textoEje: stormGrey[500],
    rejilla: stormGrey[200],
    bordeEje: stormGrey[300],
    superficie: BLANCO,
    tooltipFondo: stormGrey[800],
    tooltipTexto: stormGrey[50],
  },
  dark: {
    series: [neonBlue[400], kepple[400], california[400], shakespeare[400], redOrange[400]],
    primario: neonBlue[400],
    exito: kepple[400],
    advertencia: california[400],
    info: shakespeare[400],
    error: redOrange[400],
    estadoOk: kepple[400],
    estadoAdvertencia: california[400],
    estadoCritico: redOrange[400],
    // slate es el neutro del modo oscuro. La rejilla usa el 700 en lugar del
    // 800 porque el `divider` oscuro ya no es opaco sino translúcido
    // (rgba(148 163 184 / .22)), que sobre la tarjeta cae justo en ese tono —
    // y translúcido no le sirve a Apex.
    textoEje: slate[400],
    rejilla: slate[700],
    bordeEje: slate[600],
    superficie: slate[900],
    tooltipFondo: slate[800],
    tooltipTexto: slate[100],
  },
};

/**
 * Devuelve la paleta de gráficas del modo ACTIVO, en hex literales.
 *
 * @example
 * const paleta = useChartPalette();
 * const opciones = React.useMemo<ApexOptions>(
 *   () => ({ colors: [paleta.primario], theme: { mode: paleta.modo } }),
 *   [paleta] // `paleta` sólo cambia de identidad cuando cambia el modo
 * );
 */
export function useChartPalette(): PaletaGraficas {
  const { mode, systemMode } = useColorScheme();
  const [montado, setMontado] = React.useState(false);

  React.useEffect(() => {
    setMontado(true);
  }, []);

  // Con mode === 'system' el modo efectivo lo dicta el sistema operativo.
  const modoResuelto = mode === 'system' ? systemMode : mode;
  // Antes de montar, `modoResuelto` no es de fiar: se asume claro y se avisa
  // con `montado: false` para que nadie pinte todavía.
  const modo: ModoGrafica = montado && modoResuelto === 'dark' ? 'dark' : 'light';

  // La identidad del objeto sólo cambia cuando cambia el modo, así los
  // `useMemo` que dependen de él no se recalculan en cada render.
  return React.useMemo(() => ({ modo, montado, ...PALETAS[modo] }), [modo, montado]);
}
