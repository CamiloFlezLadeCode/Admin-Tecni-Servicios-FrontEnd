import type { Components } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import type { Theme } from '../types';

/**
 * Cabecera de tabla.
 *
 * Se apoya en `background-level1` (un escalón por encima de la tarjeta) para
 * separarse del cuerpo sin recurrir a un color fijo.
 *
 * El texto va en `text-primary` y peso 700, NO en `text-secondary` ni en
 * versalitas. Es deliberado: el patrón habitual de "etiqueta atenuada en
 * mayúsculas" baja el contraste justo donde más se necesita, y en español
 * las mayúsculas perjudican la lectura de encabezados largos y con tilde
 * ("Fecha Última Actualización"). Aquí la jerarquía la marcan el fondo y el
 * peso, no el desvanecido.
 *
 * `zIndex: 2` mantiene la cabecera por encima de las filas cuando la tabla
 * está dentro de un contenedor con scroll y se usa `stickyHeader`.
 */
export const MuiTableHead = {
  styleOverrides: {
    root: {
      [`& .${tableCellClasses.root}`]: {
        backgroundColor: 'var(--mui-palette-background-level1)',
        color: 'var(--mui-palette-text-primary)',
        borderBottom: '1px solid var(--mui-palette-divider)',
        fontSize: '0.8125rem',
        fontWeight: 700,
        letterSpacing: '0.2px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      },
      [`& .${tableCellClasses.stickyHeader}`]: {
        backgroundColor: 'var(--mui-palette-background-level1)',
        zIndex: 2,
      },
    },
  },
} satisfies Components<Theme>['MuiTableHead'];
