import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

/** Diálogos y modales — el proyecto usa muchos para crear/editar registros. */
export const MuiDialog = {
  styleOverrides: {
    paper: {
      backgroundColor: 'var(--mui-palette-background-paper)',
      backgroundImage: 'none',
      borderRadius: '18px',
      border: '1px solid var(--mui-palette-divider)',
    },
  },
} satisfies Components<Theme>['MuiDialog'];

export const MuiDialogTitle = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-primary)',
      fontWeight: 700,
      borderBottom: '1px solid var(--mui-palette-divider)',
    },
  },
} satisfies Components<Theme>['MuiDialogTitle'];

export const MuiDialogActions = {
  styleOverrides: {
    root: { borderTop: '1px solid var(--mui-palette-divider)', padding: '16px 24px' },
  },
} satisfies Components<Theme>['MuiDialogActions'];

/** Menús desplegables, popovers y el flyout del sidebar colapsado. */
export const MuiPopover = {
  styleOverrides: {
    paper: {
      backgroundColor: 'var(--mui-palette-background-paper)',
      backgroundImage: 'none',
      border: '1px solid var(--mui-palette-divider)',
      borderRadius: '12px',
      boxShadow: 'var(--mui-shadows-8)',
    },
  },
} satisfies Components<Theme>['MuiPopover'];

export const MuiMenu = {
  styleOverrides: {
    paper: {
      backgroundColor: 'var(--mui-palette-background-paper)',
      backgroundImage: 'none',
      border: '1px solid var(--mui-palette-divider)',
      borderRadius: '12px',
      boxShadow: 'var(--mui-shadows-8)',
    },
  },
} satisfies Components<Theme>['MuiMenu'];

export const MuiMenuItem = {
  styleOverrides: {
    root: {
      borderRadius: '8px',
      margin: '2px 6px',
      color: 'var(--mui-palette-text-primary)',
      '&:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
      '&.Mui-selected': {
        backgroundColor: 'var(--mui-palette-action-selected)',
        '&:hover': { backgroundColor: 'var(--mui-palette-action-selected)' },
      },
    },
  },
} satisfies Components<Theme>['MuiMenuItem'];

export const MuiDrawer = {
  styleOverrides: {
    paper: { backgroundImage: 'none', borderColor: 'var(--mui-palette-divider)' },
  },
} satisfies Components<Theme>['MuiDrawer'];

export const MuiDivider = {
  styleOverrides: {
    root: { borderColor: 'var(--mui-palette-divider)' },
  },
} satisfies Components<Theme>['MuiDivider'];

export const MuiTooltip = {
  styleOverrides: {
    tooltip: {
      backgroundColor: 'var(--mui-palette-neutral-800)',
      color: 'var(--mui-palette-common-white)',
      fontSize: '0.75rem',
      fontWeight: 500,
      borderRadius: '8px',
      padding: '6px 10px',
      boxShadow: 'var(--mui-shadows-4)',
    },
    arrow: { color: 'var(--mui-palette-neutral-800)' },
  },
} satisfies Components<Theme>['MuiTooltip'];

/**
 * El backdrop por defecto es negro al 50%, que sobre una interfaz ya oscura
 * apenas se distingue. Se usa el canal del fondo de página para que el velo
 * sea coherente con el modo activo.
 */
export const MuiBackdrop = {
  styleOverrides: {
    root: {
      backgroundColor: 'rgba(var(--mui-palette-background-defaultChannel) / 0.72)',
      backdropFilter: 'blur(4px)',
      '&.MuiBackdrop-invisible': { backgroundColor: 'transparent', backdropFilter: 'none' },
    },
  },
} satisfies Components<Theme>['MuiBackdrop'];

/**
 * Se deriva del canal del texto (no de `action.hover`, que al 6-8% se pierde
 * sobre las filas cebra en `level1`). Al usar el color de texto, el esqueleto
 * contrasta con la superficie en ambos modos: gris oscuro sobre claro, gris
 * claro sobre oscuro.
 */
export const MuiSkeleton = {
  styleOverrides: {
    root: { backgroundColor: 'rgba(var(--mui-palette-text-primaryChannel) / 0.11)' },
  },
} satisfies Components<Theme>['MuiSkeleton'];
