import { paperClasses } from '@mui/material/Paper';
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

/**
 * OJO con `theme.palette.mode` dentro de `styleOverrides`.
 *
 * Con `CssVarsProvider` el tema se resuelve UNA sola vez, en build de estilos,
 * usando el esquema por defecto. Un `theme.palette.mode === 'dark' ? a : b`
 * congela el valor del esquema por defecto y NO cambia al alternar el modo en
 * caliente — que es exactamente el bug que tenía este archivo.
 *
 * La forma correcta es emitir ambas reglas y dejar que las decida el selector
 * de esquema (`theme.getColorSchemeSelector`), que se resuelve en CSS.
 */
export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: '20px',
      backgroundImage: 'none',
      [`&.${paperClasses.elevation1}`]: {
        // Modo claro: sombra suave + hairline oscuro.
        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04), 0 5px 22px rgba(16, 24, 40, 0.05), 0 0 0 1px rgba(16, 24, 40, 0.06)',
        [theme.getColorSchemeSelector('dark')]: {
          // Modo oscuro: la sombra casi no se ve, así que la elevación la
          // comunica un borde claro translúcido en lugar de la sombra.
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.30), 0 8px 24px rgba(0, 0, 0, 0.36), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        },
      },
    }),
  },
} satisfies Components<Theme>['MuiCard'];
