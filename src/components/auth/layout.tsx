'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
        bgcolor: 'var(--mui-palette-background-default)',
        color: 'var(--mui-palette-text-primary)',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            {/* <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} /> */}
            <DynamicLogo colorDark="light" colorLight="dark" height={122} width={252} />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          // Panel decorativo: un halo del color de marca sobre la superficie
          // del modo activo. En claro queda un lavado índigo sobre blanco y en
          // oscuro un resplandor sobre pizarra profunda, sin colores fijos.
          background:
            'radial-gradient(60% 55% at 50% 42%, rgba(var(--mui-palette-primary-mainChannel) / 0.24) 0%, rgba(var(--mui-palette-primary-mainChannel) / 0.04) 55%, transparent 100%),' +
            'linear-gradient(160deg, var(--mui-palette-background-paper) 0%, var(--mui-palette-background-level1) 100%)',
          borderLeft: '1px solid var(--mui-palette-divider)',
          color: 'var(--mui-palette-text-primary)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              Bienvenido a {' '}
              <Box component="span" sx={{ color: 'var(--mui-palette-success-main)' }}>
                TecniServicios
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1" sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              Una empresa con profesionales de alta calidad
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Box
              component="img"
              alt="Widgets"
              // src="/assets/auth-widgets.png"
              src="/assets/LogoCompany.webp"
              sx={{ height: 'auto', width: '100%', maxWidth: '600px' }}
            /> */}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
