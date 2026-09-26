'use client';

/**
 * Piezas visuales "liquid glass" compartidas por la navegación de escritorio
 * (`side-nav.tsx`) y la de móvil (`mobile-nav.tsx`), para que ambas se vean
 * idénticas. La superficie de vidrio y sus tokens por modo viven en
 * `styles/global.css` (`.liquid-glass`, `--glass-*`).
 */

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

import { paths } from '@/paths';

// Curva estilo iOS para transiciones de estado (hover, pulsación, activo)
export const EASE_IOS = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** Variables que consumen los ítems; se declaran en el contenedor de cada navegación */
export const NAV_CSS_VARS = {
  '--NavItem-color': 'var(--mui-palette-text-secondary)',
  '--NavItem-hover-background': 'var(--glass-hover)',
  '--NavItem-active-background': 'var(--mui-palette-primary-main)',
  '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
  '--NavItem-disabled-color': 'var(--mui-palette-text-disabled)',
  '--NavItem-icon-color': 'var(--mui-palette-text-secondary)',
  '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
  '--NavItem-icon-disabled-color': 'var(--mui-palette-text-disabled)',
} as const;

/** Botón cuadrado "hundido" en el vidrio (colapsar, cerrar) */
export const glassIconButtonSx: SxProps<Theme> = {
  width: 34,
  height: 34,
  flex: '0 0 auto',
  borderRadius: '11px',
  color: 'var(--mui-palette-text-secondary)',
  bgcolor: 'var(--glass-inset)',
  border: '1px solid var(--glass-hairline)',
  transition: `background-color 0.2s ${EASE_IOS}, color 0.2s ${EASE_IOS}, transform 0.2s ${EASE_IOS}`,
  '&:hover': {
    bgcolor: 'var(--glass-hover)',
    color: 'var(--mui-palette-text-primary)',
  },
  '&:active': { transform: 'scale(0.92)' },
};

/** Buscador "hundido" en el vidrio; el foco sigue viniendo del tema (MuiOutlinedInput) */
export const glassSearchSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'var(--glass-inset)',
    borderRadius: '12px',
    transition: `background-color 0.2s ${EASE_IOS}`,
    '&:hover': { bgcolor: 'var(--glass-hover)' },
  },
  '& .MuiOutlinedInput-root:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--glass-hairline)',
  },
};

/** Lista de subítems con guía vertical a la altura del icono del grupo */
export const nestedListSx: SxProps<Theme> = {
  listStyle: 'none',
  m: 0,
  p: 0,
  pl: 1,
  ml: '22px',
  mt: 0.5,
  mb: 0.5,
  borderLeft: '1px solid var(--mui-palette-divider)',
};

interface NavItemSxOptions {
  active: boolean;
  nested: boolean;
  disabled?: boolean;
  /** Sidebar de escritorio colapsado: solo icono, centrado */
  collapsed?: boolean;
}

export function navItemSx({ active, nested, disabled, collapsed = false }: NavItemSxOptions): SxProps<Theme> {
  return {
    alignItems: 'center',
    borderRadius: '12px',
    color: 'var(--NavItem-color)',
    cursor: 'pointer',
    display: 'flex',
    flex: '0 0 auto',
    gap: 1.25,
    p: collapsed ? '10px' : nested ? '6px 12px' : '8px 12px',
    position: 'relative',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    justifyContent: collapsed ? 'center' : 'flex-start',
    transition: `background-color 0.2s ${EASE_IOS}, color 0.2s ${EASE_IOS}, box-shadow 0.2s ${EASE_IOS}, transform 0.2s ${EASE_IOS}`,
    // Pulsación táctil estilo iOS
    '&:active': disabled ? {} : { transform: 'scale(0.97)' },
    ...(disabled && {
      bgcolor: 'var(--NavItem-disabled-background)',
      color: 'var(--NavItem-disabled-color)',
      cursor: 'not-allowed',
    }),
    ...(active &&
      (nested
        ? {
            // Subítem activo: tinte de vidrio del primario, sin competir con el grupo
            bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.14)',
            color: 'var(--mui-palette-primary-main)',
            boxShadow: 'inset 0 0 0 1px rgba(var(--mui-palette-primary-mainChannel) / 0.24)',
          }
        : {
            // Píldora con brillo: reflejo claro arriba, sombra de color debajo
            background:
              'linear-gradient(180deg, rgba(255 255 255 / 0.22) 0%, rgba(255 255 255 / 0) 55%), var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
            boxShadow:
              'inset 0 1px 0 rgba(255 255 255 / 0.35), inset 0 -1px 0 rgba(0 0 0 / 0.12), 0 8px 20px -8px rgba(var(--mui-palette-primary-mainChannel) / 0.75)',
          })),
    ...(!active && {
      '&:hover': {
        bgcolor: 'var(--NavItem-hover-background)',
        color: 'var(--mui-palette-text-primary)',
      },
    }),
  };
}

export function navIconFill(active: boolean, nested: boolean): string {
  if (!active) return 'var(--NavItem-icon-color)';
  return nested ? 'var(--mui-palette-primary-main)' : 'var(--NavItem-icon-active-color)';
}

/** Logo + nombre de la empresa, enlaza al panel principal */
export function NavBrand({ onClick }: { onClick?: () => void }): React.JSX.Element {
  return (
    <Box
      component={RouterLink}
      href={paths.dashboard.overview}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        minWidth: 0,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <Box
        component="img"
        src="/assets/LogoCompanyLogoIco.png"
        alt=""
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          objectFit: 'contain',
          flex: '0 0 auto',
          bgcolor: 'common.white',
          // Anillo fino + sombra suave: el logo "flota" sobre el vidrio
          boxShadow: '0 0 0 1px var(--glass-hairline), 0 4px 12px -4px rgba(var(--app-shadow-rgb) / 0.35)',
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          TECNISERVICIOS
        </Typography>
        <Typography
          noWrap
          variant="caption"
          sx={{ display: 'block', color: 'var(--mui-palette-text-secondary)', lineHeight: 1.2 }}
        >
          Panel administrativo
        </Typography>
      </Box>
    </Box>
  );
}

/** Separador que se desvanece en los extremos, más ligero que un divisor sólido */
export function GlassSeparator(): React.JSX.Element {
  return (
    <Box
      aria-hidden
      sx={{
        height: '1px',
        mx: 1.5,
        flex: '0 0 auto',
        background: 'linear-gradient(90deg, transparent, var(--mui-palette-divider), transparent)',
      }}
    />
  );
}
