import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

/**
 * Campos de formulario.
 *
 * Los formularios de este proyecto (`componentes_generales/formulario/*`)
 * fijaban fondos blancos y bordes grises a mano, lo que los volvía ilegibles
 * en modo oscuro. Aquí queda el estilo canónico: el campo se apoya en
 * `background-paper`, el borde usa `divider`, y el estado de foco refuerza con
 * el color primario y un anillo suave.
 */
export const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      backgroundColor: 'var(--mui-palette-background-paper)',
      borderRadius: '10px',
      transition: 'border-color 120ms ease, box-shadow 120ms ease',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--mui-palette-divider)',
        transition: 'border-color 120ms ease',
      },
      '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--mui-palette-neutral-400)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(var(--mui-palette-primary-mainChannel) / 0.16)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--mui-palette-primary-main)',
          borderWidth: '1px',
        },
      },
      '&.Mui-disabled': {
        backgroundColor: 'var(--mui-palette-background-level1)',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-divider)' },
      },
      '&.Mui-error.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(var(--mui-palette-error-mainChannel) / 0.16)',
      },
    },
    input: {
      color: 'var(--mui-palette-text-primary)',
      '&::placeholder': { color: 'var(--mui-palette-text-secondary)', opacity: 1 },
      // Autocompletado de Chrome: pinta un amarillo fijo que ignora el tema.
      // Se neutraliza con una sombra interna del color de la superficie.
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px var(--mui-palette-background-paper) inset',
        WebkitTextFillColor: 'var(--mui-palette-text-primary)',
        caretColor: 'var(--mui-palette-text-primary)',
      },
    },
  },
} satisfies Components<Theme>['MuiOutlinedInput'];

export const MuiInputLabel = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-secondary)',
      '&.Mui-focused': { color: 'var(--mui-palette-primary-main)' },
      '&.Mui-disabled': { color: 'var(--mui-palette-text-disabled)' },
    },
  },
} satisfies Components<Theme>['MuiInputLabel'];

export const MuiFormHelperText = {
  styleOverrides: {
    root: { color: 'var(--mui-palette-text-secondary)', marginLeft: 2 },
  },
} satisfies Components<Theme>['MuiFormHelperText'];

export const MuiFormLabel = {
  styleOverrides: {
    root: { '&.Mui-focused': { color: 'var(--mui-palette-primary-main)' } },
  },
} satisfies Components<Theme>['MuiFormLabel'];

export const MuiSelect = {
  styleOverrides: {
    icon: { color: 'var(--mui-palette-text-secondary)' },
  },
} satisfies Components<Theme>['MuiSelect'];

export const MuiAutocomplete = {
  styleOverrides: {
    paper: {
      backgroundColor: 'var(--mui-palette-background-paper)',
      backgroundImage: 'none',
      border: '1px solid var(--mui-palette-divider)',
      borderRadius: '12px',
      boxShadow: 'var(--mui-shadows-8)',
    },
    option: {
      '&:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
      '&[aria-selected="true"]': { backgroundColor: 'var(--mui-palette-action-selected)' },
    },
    clearIndicator: { color: 'var(--mui-palette-text-secondary)' },
    popupIndicator: { color: 'var(--mui-palette-text-secondary)' },
  },
} satisfies Components<Theme>['MuiAutocomplete'];

export const MuiCheckbox = {
  styleOverrides: {
    root: { color: 'var(--mui-palette-neutral-400)' },
  },
} satisfies Components<Theme>['MuiCheckbox'];

export const MuiRadio = {
  styleOverrides: {
    root: { color: 'var(--mui-palette-neutral-400)' },
  },
} satisfies Components<Theme>['MuiRadio'];
