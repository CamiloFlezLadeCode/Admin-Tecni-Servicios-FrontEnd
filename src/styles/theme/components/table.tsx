import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTableContainer = {
  styleOverrides: {
    root: {
      backgroundColor: 'transparent',
      // Barra de scroll horizontal tematizada: las tablas de este proyecto son
      // anchas y la barra nativa clara sobre fondo oscuro canta muchísimo.
      scrollbarColor: 'var(--mui-palette-neutral-400) transparent',
      '&::-webkit-scrollbar': { height: 10, width: 10 },
      '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--mui-palette-neutral-400)',
        borderRadius: 8,
        border: '2px solid var(--mui-palette-background-paper)',
      },
      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: 'var(--mui-palette-neutral-500)' },
    },
  },
} satisfies Components<Theme>['MuiTableContainer'];

export const MuiTableRow = {
  styleOverrides: {
    root: {
      transition: 'background-color 120ms ease',
      '&.MuiTableRow-hover:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
      '&.Mui-selected': {
        backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.12)',
        '&:hover': { backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.16)' },
      },
    },
  },
} satisfies Components<Theme>['MuiTableRow'];

export const MuiTablePagination = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-secondary)',
      borderTop: '1px solid var(--mui-palette-divider)',
    },
    selectIcon: { color: 'var(--mui-palette-text-secondary)' },
  },
} satisfies Components<Theme>['MuiTablePagination'];

export const MuiTableSortLabel = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-secondary)',
      '&:hover': { color: 'var(--mui-palette-text-primary)' },
      '&.Mui-active': {
        color: 'var(--mui-palette-text-primary)',
        '& .MuiTableSortLabel-icon': { color: 'var(--mui-palette-primary-main)' },
      },
    },
  },
} satisfies Components<Theme>['MuiTableSortLabel'];
