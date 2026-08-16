'use client';

import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => null });

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
  // Se apunta a las dos clases de tema de Apex para ganarle en especificidad
  // a su hoja de estilos sin recurrir a `!important`.
  '& .apexcharts-tooltip.apexcharts-theme-light, & .apexcharts-tooltip.apexcharts-theme-dark': {
    backgroundColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
    color: 'var(--grafica-tooltip-texto, var(--mui-palette-text-primary))',
    border: '1px solid var(--mui-palette-divider)',
    borderRadius: '10px',
    boxShadow: 'var(--mui-shadows-8)',
    fontFamily: 'inherit',
    fontSize: '0.75rem',
  },
  '& .apexcharts-tooltip-title': {
    backgroundColor: 'transparent',
    borderBottom: '1px solid var(--mui-palette-divider)',
    color: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 700,
    marginBottom: '4px',
    padding: '6px 10px',
  },
  '& .apexcharts-tooltip-series-group': { padding: '2px 10px 6px' },
  '& .apexcharts-tooltip-text-y-label, & .apexcharts-tooltip-text-y-value': { color: 'inherit' },
  '& .apexcharts-tooltip-marker': {
    // Anillo del color de la superficie: separa el punto de color del fondo
    // del tooltip aunque ambos sean oscuros.
    boxShadow: '0 0 0 1.5px var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },

  // ── Tooltips de eje (la etiqueta que sigue al cursor) ───────────────────
  '& .apexcharts-xaxistooltip, & .apexcharts-yaxistooltip': {
    backgroundColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
    color: 'var(--grafica-tooltip-texto, var(--mui-palette-text-primary))',
    border: '1px solid var(--mui-palette-divider)',
    borderRadius: '6px',
    fontFamily: 'inherit',
  },
  // Apex dibuja la flechita con dos pseudoelementos: `::before` es el borde y
  // `::after` el relleno. Si no se tematizan los dos, queda un pico blanco.
  '& .apexcharts-xaxistooltip-bottom::before': { borderBottomColor: 'var(--mui-palette-divider)' },
  '& .apexcharts-xaxistooltip-bottom::after': {
    borderBottomColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },
  '& .apexcharts-xaxistooltip-top::before': { borderTopColor: 'var(--mui-palette-divider)' },
  '& .apexcharts-xaxistooltip-top::after': {
    borderTopColor: 'var(--grafica-tooltip-fondo, var(--mui-palette-background-level3))',
  },

  // ── Leyenda ─────────────────────────────────────────────────────────────
  // El color del texto lo escribe Apex en línea desde `legend.labels.colors`
  // (se lo pasa el hook); aquí sólo se corrige la tipografía y el ancho de
  // toque, que no son configurables desde las opciones.
  // (No se toca el layout de `.apexcharts-legend-series`: Apex lo calcula por
  // JS según la posición de la leyenda y sobrescribirlo la descuadra.)
  '& .apexcharts-legend-text': { fontFamily: 'inherit !important', fontSize: '0.75rem !important' },

  // ── Menú del toolbar (descargar SVG/PNG/CSV) ────────────────────────────
  '& .apexcharts-menu': {
    backgroundColor: 'var(--mui-palette-background-level3)',
    border: '1px solid var(--mui-palette-divider)',
    borderRadius: '8px',
    boxShadow: 'var(--mui-shadows-8)',
  },
  '& .apexcharts-menu-item': { color: 'var(--mui-palette-text-primary)', borderRadius: '4px' },
  '& .apexcharts-menu-item:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
  '& .apexcharts-toolbar svg': { fill: 'var(--mui-palette-text-secondary)' },

  // Mensaje de "sin datos": por defecto es negro, ilegible en modo oscuro.
  '& .apexcharts-text.apexcharts-noData-text, & .apexcharts-noData text': {
    fill: 'var(--mui-palette-text-secondary)',
  },
});
