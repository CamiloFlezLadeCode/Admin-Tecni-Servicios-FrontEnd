'use client';

import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => null });

/**
 * ── Por qué los selectores de aquí abajo son tan largos ────────────────────
 *
 * ApexCharts no trae una hoja de estilos que se importe: la inyecta él mismo
 * con `document.head.appendChild(<style>)` al crear el gráfico, es decir
 * DESPUÉS de que emotion haya insertado las reglas de este `styled`. A igualdad
 * de especificidad, por tanto, gana SIEMPRE Apex. Aquí no basta con empatar:
 * hay que superarlo.
 *
 * Apex marca con `apexcharts-theme-light` / `apexcharts-theme-dark` tanto el
 * contenedor del gráfico (`.apexcharts-canvas`) como el propio tooltip y los
 * tooltips de eje, y cuelga de esas clases todas sus reglas de color. Repetir
 * esas mismas clases en nuestros selectores es lo que nos sube un escalón por
 * encima de él sin recurrir a `!important`.
 *
 * `!important` sólo sobrevive en `.apexcharts-legend-text`, donde Apex escribe
 * los estilos EN LÍNEA y no hay especificidad que sirva.
 */

/**
 * `& <base>.apexcharts-theme-{light,dark}<sufijo>` para cada base.
 *
 * Para elementos que llevan la clase de tema ELLOS MISMOS (el tooltip y los
 * tooltips de eje). Suma una clase respecto al selector equivalente de Apex.
 */
const enAmbosTemas = (bases: string[], sufijo = ''): string =>
  bases
    .flatMap((base) => [`& ${base}.apexcharts-theme-light${sufijo}`, `& ${base}.apexcharts-theme-dark${sufijo}`])
    .join(', ');

/**
 * `& .apexcharts-theme-{light,dark} <descendiente>`.
 *
 * Para lo que cuelga del contenedor (menú y iconos del toolbar): ahí la clase
 * de tema está en `.apexcharts-canvas`, no en el propio elemento.
 */
const bajoAmbosTemas = (descendiente: string): string =>
  `& .apexcharts-theme-light ${descendiente}, & .apexcharts-theme-dark ${descendiente}`;

/**
 * Envoltorio de ApexCharts.
 *
 * El color de un gráfico se reparte en dos mitades que se resuelven distinto:
 *
 *   1. Lo que Apex dibuja en SVG (series, ejes, rejilla) va en atributos que
 *      NO entienden variables CSS. Eso lo aporta `useChartPalette()` con hex
 *      literales, y por eso el gráfico tiene que remontarse al cambiar de modo.
 *
 *   2. Lo que Apex dibuja en HTML (tooltip, leyenda, menú del toolbar) es CSS
 *      normal. Se tematiza AQUÍ con tokens: cambia solo al alternar el modo,
 *      sin JavaScript y sin volver a montar nada.
 *
 * Las variables `--grafica-tooltip-*` las inyecta quien usa el componente
 * (con los hex del hook, para que tooltip y series vayan a juego). Llevan un
 * token de respaldo, así que si no se pasan el tooltip sigue siendo correcto
 * en ambos modos.
 */
export const Chart = styled(ApexChart)({
  // Apex trae su propia tipografía por defecto (Helvetica); que herede la de
  // la aplicación evita que los gráficos se lean como un widget ajeno.
  fontFamily: 'inherit',

  // ── Tooltip principal ───────────────────────────────────────────────────
  // Nuestro tooltip es OSCURO en los dos modos, a propósito (ver
  // `use-chart-palette.ts`). Apex, en cambio, trae un tooltip claro con
  // `background: rgba(255,255,255,.96)`; hay que pisarlo entero.
  [enAmbosTemas(['.apexcharts-tooltip'])]: {
    backgroundColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
    color: 'var(--grafica-tooltip-texto, var(--mui-palette-text-primary))',
    border: '1px solid var(--mui-palette-divider)',
    borderRadius: '10px',
    boxShadow: 'var(--mui-shadows-8)',
    fontFamily: 'inherit',
    fontSize: '0.75rem',
  },

  // Franja del título (mes y año). Apex le pone fondo propio y borde propio
  // desde `.apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title`
  // (#eceff1 sobre #ddd) — tres clases. Un `& .apexcharts-tooltip-title` sólo
  // suma dos y perdía: en modo claro quedaba el gris casi blanco de Apex bajo
  // nuestro texto casi blanco, o sea invisible. Con el ancestro delante son
  // cuatro clases y la franja se funde con el fondo oscuro del tooltip.
  // `fontSize: inherit` también hace falta: Apex fija 15px aquí y se saltaba
  // el 0.75rem del contenedor.
  [enAmbosTemas(['.apexcharts-tooltip'], ' .apexcharts-tooltip-title')]: {
    backgroundColor: 'transparent',
    borderBottom: '1px solid var(--mui-palette-divider)',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 700,
    marginBottom: '4px',
    padding: '6px 10px',
  },

  // Idem con el relleno de cada serie: Apex lo repisa con dos clases en
  // `.apexcharts-tooltip-series-group.apexcharts-active` y en `:last-child`.
  [enAmbosTemas(['.apexcharts-tooltip'], ' .apexcharts-tooltip-series-group')]: { padding: '2px 10px 6px' },

  '& .apexcharts-tooltip-text-y-label, & .apexcharts-tooltip-text-y-value': { color: 'inherit' },
  '& .apexcharts-tooltip-marker': {
    // Anillo del color de la superficie: separa el punto de color del fondo
    // del tooltip aunque ambos sean oscuros.
    boxShadow: '0 0 0 1.5px var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },

  // ── Tooltips de eje (la etiqueta que sigue al cursor) ───────────────────
  // El tema oscuro de Apex también los pinta con dos clases
  // (`.apexcharts-xaxistooltip.apexcharts-theme-dark`), así que van con la
  // clase de tema por delante igual que el tooltip principal.
  [enAmbosTemas(['.apexcharts-xaxistooltip', '.apexcharts-yaxistooltip'])]: {
    backgroundColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
    color: 'var(--grafica-tooltip-texto, var(--mui-palette-text-primary))',
    border: '1px solid var(--mui-palette-divider)',
    borderRadius: '6px',
    fontFamily: 'inherit',
  },

  // Apex dibuja la flechita con dos pseudoelementos: `::before` es el borde y
  // `::after` el relleno. Si no se tematizan los dos, queda un pico blanco.
  // Sus variantes de tema oscuro empatan en especificidad con un
  // `& .apexcharts-xaxistooltip-bottom::after` pelado (dos clases + un
  // pseudoelemento cada una) y, al inyectarse después, ganaban ellas: el pico
  // se quedaba en rgba(0,0,0,.5) en oscuro y en #eceff1/#90a4ae en claro.
  [enAmbosTemas(['.apexcharts-xaxistooltip-bottom'], '::before')]: {
    borderBottomColor: 'var(--mui-palette-divider)',
  },
  [enAmbosTemas(['.apexcharts-xaxistooltip-bottom'], '::after')]: {
    borderBottomColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },
  [enAmbosTemas(['.apexcharts-xaxistooltip-top'], '::before')]: { borderTopColor: 'var(--mui-palette-divider)' },
  [enAmbosTemas(['.apexcharts-xaxistooltip-top'], '::after')]: {
    borderTopColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },
  // El tooltip del eje Y apunta de lado, no arriba/abajo: sus flechas son
  // `-left` / `-right`. Faltaban por completo, así que se quedaban con el
  // #eceff1 y el #90a4ae de Apex contra nuestro fondo oscuro.
  [enAmbosTemas(['.apexcharts-yaxistooltip-left'], '::before')]: { borderLeftColor: 'var(--mui-palette-divider)' },
  [enAmbosTemas(['.apexcharts-yaxistooltip-left'], '::after')]: {
    borderLeftColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },
  [enAmbosTemas(['.apexcharts-yaxistooltip-right'], '::before')]: { borderRightColor: 'var(--mui-palette-divider)' },
  [enAmbosTemas(['.apexcharts-yaxistooltip-right'], '::after')]: {
    borderRightColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },

  // ── Leyenda ─────────────────────────────────────────────────────────────
  // El color del texto lo escribe Apex en línea desde `legend.labels.colors`
  // (se lo pasa el hook); aquí sólo se corrige la tipografía y el ancho de
  // toque, que no son configurables desde las opciones. Al ser estilos EN
  // LÍNEA, éste es el único sitio donde `!important` es inevitable.
  // (No se toca el layout de `.apexcharts-legend-series`: Apex lo calcula por
  // JS según la posición de la leyenda y sobrescribirlo la descuadra.)
  '& .apexcharts-legend-text': { fontFamily: 'inherit !important', fontSize: '0.75rem !important' },

  // ── Menú del toolbar (descargar SVG/PNG/CSV) ────────────────────────────
  // `.apexcharts-theme-dark .apexcharts-menu` de Apex son dos clases y pisaba
  // el fondo del menú en modo oscuro (rgba(0,0,0,.7) en vez de nuestro token).
  [bajoAmbosTemas('.apexcharts-menu')]: {
    backgroundColor: 'var(--mui-palette-background-level3)',
    border: '1px solid var(--mui-palette-divider)',
    borderRadius: '8px',
    boxShadow: 'var(--mui-shadows-8)',
  },
  '& .apexcharts-menu-item': { color: 'var(--mui-palette-text-primary)', borderRadius: '4px' },
  // Apex resuelve el hover con `.apexcharts-theme-light .apexcharts-menu-item:hover`
  // (tres clases, #eee fijo), que empataba con nuestro `:hover` a secas.
  [bajoAmbosTemas('.apexcharts-menu-item:hover')]: { backgroundColor: 'var(--mui-palette-action-hover)' },

  // Los iconos: Apex los pinta con `.apexcharts-theme-dark .apexcharts-menu-icon svg`
  // (#f3f4f5), que empataba con `& .apexcharts-toolbar svg`.
  [bajoAmbosTemas('.apexcharts-toolbar svg')]: { fill: 'var(--mui-palette-text-secondary)' },
  // Icono activo (zoom/selección). Apex lo fija en su azul de marca (#008ffb)
  // desde `.apexcharts-canvas .apexcharts-zoom-icon.apexcharts-selected svg`;
  // se replica la cadena y se añade `.apexcharts-toolbar` para superarla.
  '& .apexcharts-canvas .apexcharts-toolbar .apexcharts-selected svg': { fill: 'var(--mui-palette-primary-main)' },

  // Mensaje de "sin datos": por defecto es negro, ilegible en modo oscuro.
  '& .apexcharts-text.apexcharts-noData-text, & .apexcharts-noData text': {
    fill: 'var(--mui-palette-text-secondary)',
  },
});
