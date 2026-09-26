'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartLineUp } from '@phosphor-icons/react/dist/ssr/ChartLineUp';
import { Package } from '@phosphor-icons/react/dist/ssr/Package';
import { Receipt } from '@phosphor-icons/react/dist/ssr/Receipt';
import { Truck } from '@phosphor-icons/react/dist/ssr/Truck';

import { ColorSchemeToggle } from '@/components/core/theme-provider/color-scheme-toggle';

export interface LayoutProps {
  children: React.ReactNode;
}

/** Módulos del sistema que se presentan en la bienvenida (solo escritorio). */
const MODULOS = [
  { icono: Truck, titulo: 'Remisiones y devoluciones', texto: 'Cada equipo, en qué obra está y desde cuándo.' },
  { icono: Package, titulo: 'Inventario en tiempo real', texto: 'Stock propio y de subarriendo, sin descuadres.' },
  { icono: Receipt, titulo: 'Estado de cuenta', texto: 'Lo pendiente por cliente y proyecto, al día.' },
  { icono: ChartLineUp, titulo: 'Panel de indicadores', texto: 'La operación del mes de un vistazo.' },
] as const;

/**
 * Marco de las páginas de autenticación (iniciar sesión, registro, recuperar).
 *
 * El fondo es una "aurora" de manchas de color de marca a la deriva
 * (`.auth-aurora` en `styles/global.css`). Además de decorar, le da al vidrio
 * de la tarjeta algo real que difuminar: sin color detrás, `backdrop-filter`
 * no se nota y la tarjeta parecería un rectángulo gris.
 */
export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100%',
        bgcolor: 'var(--mui-palette-background-default)',
        color: 'var(--mui-palette-text-primary)',
        overflow: 'hidden',
      }}
    >
      <Box className="auth-aurora" aria-hidden>
        <Box className="auth-aurora__blob auth-aurora__blob--a" />
        <Box className="auth-aurora__blob auth-aurora__blob--b" />
        <Box className="auth-aurora__blob auth-aurora__blob--c" />
      </Box>

      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 2 }}>
        <ColorSchemeToggle />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
          alignItems: 'center',
          gap: { lg: 6 },
          maxWidth: 1240,
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 6 },
          pt: { xs: 9, lg: 4 },
          pb: { xs: 10, lg: 4 },
        }}
      >
        {/* Bienvenida: solo en escritorio, donde sobra espacio */}
        <Stack className="auth-entrada" spacing={4} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <Stack spacing={1.5}>
            <Typography
              variant="overline"
              sx={{ color: 'var(--mui-palette-primary-main)', fontWeight: 700, letterSpacing: '0.12em' }}
            >
              Panel administrativo
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: '2.75rem' }}>
              Tu operación,{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-success-main))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                bajo control
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--mui-palette-text-secondary)', maxWidth: 460 }}>
              Reparación, alquiler y transporte de equipos para la construcción, gestionados desde un solo lugar.
            </Typography>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, maxWidth: 520 }}>
            {MODULOS.map(({ icono: Icono, titulo, texto }) => (
              <Box
                key={titulo}
                className="liquid-glass"
                sx={{ borderRadius: '18px', p: 2, background: 'var(--glass-bg)' }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.25,
                    color: 'var(--mui-palette-primary-main)',
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.12)',
                  }}
                >
                  <Icono size={20} weight="duotone" />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                  {titulo}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                  {texto}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}
