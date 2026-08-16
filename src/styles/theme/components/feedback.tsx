import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

/**
 * Chips de estado — SIEMPRE OPACOS.
 *
 * Las tablas marcan estados (Activo, Anulado, Pendiente…) con `<Chip>` de
 * color semántico. La variante rellena de MUI usa el color puro como fondo,
 * que en modo oscuro deslumbra. Se usa en su lugar un tono suave del propio
 * color con texto del mismo matiz: mantiene el código de color, baja la
 * intensidad y conserva el contraste AA.
 *
 * Ese tono suave se consigue MEZCLANDO el color contra la superficie con
 * `color-mix`, no aplicándole un alfa. Con alfa el chip deja ver la fila que
 * tiene detrás y, además, cambia de aspecto según caiga en una fila cebra
 * (`level1`), en hover (`level2`) o sobre la tarjeta: el mismo estado se veía
 * de tres colores distintos. Mezclando contra `paper` el resultado es sólido
 * y siempre idéntico.
 *
 * Cada propiedad se declara DOS veces (Emotion admite un array y emite ambas):
 * la primera es el respaldo para navegadores sin `color-mix`, que se quedan
 * con la superficie lisa. El peor caso es opaco, nunca transparente.
 *
 * La mezcla es del 12%, no más: por encima de ese valor el fondo se acerca
 * demasiado al texto y el par deja de cumplir 4.5:1 en modo claro (medido:
 * al 16% success cae a 4.44:1 y warning a 4.31:1).
 *
 * En MUI v5 sólo `primary` y `secondary` tienen slot `filled*`; el resto de
 * colores se combinan como `.MuiChip-filled.MuiChip-colorSuccess`. Por eso
 * todo se declara desde `root` con selectores anidados, en vez de por slot.
 */
const chipTono = (token: 'primary' | 'success' | 'error' | 'warning' | 'info') => ({
  [`&.MuiChip-filled.MuiChip-color${token.charAt(0).toUpperCase()}${token.slice(1)}`]: {
    backgroundColor: [
      'var(--mui-palette-background-paper)',
      `color-mix(in srgb, var(--mui-palette-${token}-main) 12%, var(--mui-palette-background-paper))`,
    ],
    color: `var(--mui-palette-${token}-main)`,
    '& .MuiChip-deleteIcon': { color: `var(--mui-palette-${token}-main)` },
  },
});

export const MuiChip = {
  styleOverrides: {
    root: {
      fontWeight: 600,
      borderRadius: '8px',
      // Chip sin color (`color="default"`, el de estados desconocidos). MUI le
      // pone `action.selected`, que también es translúcido. `level2` es un
      // neutro sólido y elevado, coherente con los chips de color.
      // Los selectores de abajo llevan una clase más, así que ganan por
      // especificidad sin depender del orden.
      '&.MuiChip-filled': {
        backgroundColor: 'var(--mui-palette-background-level2)',
        color: 'var(--mui-palette-text-primary)',
      },
      ...chipTono('primary'),
      ...chipTono('success'),
      ...chipTono('error'),
      ...chipTono('warning'),
      ...chipTono('info'),
    },
  },
} satisfies Components<Theme>['MuiChip'];

/**
 * Alertas — SIEMPRE OPACAS.
 *
 * A diferencia de los chips, las alertas no viven dentro de una superficie:
 * salen en un `Snackbar` flotando sobre la página. Un fondo translúcido dejaba
 * ver la tabla o el formulario de debajo y el mensaje se volvía ilegible.
 *
 * Para conseguir el mismo tono suave pero sin transparencia se mezcla el color
 * semántico CONTRA la superficie con `color-mix`, en vez de aplicarle un alfa.
 * El resultado es idéntico al ojo — misma mezcla que haría el navegador al
 * componer un 12% — pero el color es sólido y nada se transparenta.
 *
 * Cada propiedad se declara DOS veces (Emotion admite un array como valor y
 * emite ambas): la primera es el respaldo para navegadores sin `color-mix`,
 * que se quedan con la superficie lisa. Así el peor caso sigue siendo opaco y
 * legible, nunca transparente.
 */
const alertaTono = (token: 'success' | 'error' | 'warning' | 'info') => ({
  backgroundColor: [
    'var(--mui-palette-background-paper)',
    `color-mix(in srgb, var(--mui-palette-${token}-main) 12%, var(--mui-palette-background-paper))`,
  ],
  borderColor: [
    'var(--mui-palette-divider)',
    `color-mix(in srgb, var(--mui-palette-${token}-main) 34%, var(--mui-palette-background-paper))`,
  ],
  color: `var(--mui-palette-${token}-main)`,
  '& .MuiAlert-icon': { color: `var(--mui-palette-${token}-main)` },
});

export const MuiAlert = {
  styleOverrides: {
    root: {
      borderRadius: '12px',
      border: '1px solid transparent',
      // Sombra: refuerza que la alerta está POR ENCIMA del contenido.
      boxShadow: 'var(--mui-shadows-8)',
      // MuiPaper deja `backgroundImage: none`; se repite aquí para que ningún
      // degradado de elevación de MUI reintroduzca translucidez en oscuro.
      backgroundImage: 'none',
    },
    standardSuccess: alertaTono('success'),
    standardError: alertaTono('error'),
    standardWarning: alertaTono('warning'),
    standardInfo: alertaTono('info'),
    // La variante `outlined` de MUI viene con fondo transparente por defecto:
    // sobre contenido sería ilegible, así que se le da la superficie sólida.
    outlinedSuccess: alertaTono('success'),
    outlinedError: alertaTono('error'),
    outlinedWarning: alertaTono('warning'),
    outlinedInfo: alertaTono('info'),
  },
} satisfies Components<Theme>['MuiAlert'];

export const MuiIconButton = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-secondary)',
      '&:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
    },
  },
} satisfies Components<Theme>['MuiIconButton'];

export const MuiListItemIcon = {
  styleOverrides: {
    root: { color: 'var(--mui-palette-text-secondary)', minWidth: 36 },
  },
} satisfies Components<Theme>['MuiListItemIcon'];
