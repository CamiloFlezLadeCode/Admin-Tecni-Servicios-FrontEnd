import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

/**
 * En modo oscuro MUI aplica por defecto un "overlay" blanco translúcido según
 * la elevación, que vuelve grises y lavadas todas las superficies. Lo anulamos
 * y definimos la elevación con borde + sombra, que es lo que se lee bien sobre
 * un fondo oscuro.
 */
export const MuiPaper = {
  styleOverrides: {
    root: {
      backgroundImage: 'none',
      backgroundColor: 'var(--mui-palette-background-paper)',
      color: 'var(--mui-palette-text-primary)',
    },
    outlined: { borderColor: 'var(--mui-palette-divider)' },
  },
} satisfies Components<Theme>['MuiPaper'];
