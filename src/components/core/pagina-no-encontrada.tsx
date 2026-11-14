import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { paths } from '@/paths';
import { RouterLink } from '@/components/core/router-link';

interface PaginaNoEncontradaProps {
  readonly titulo: React.ReactNode;
  readonly descripcion?: React.ReactNode;
  readonly textoBoton: string;
}

/** Imagen 404, mensaje y botón para volver al inicio. */
export function PaginaNoEncontrada({ titulo, descripcion, textoBoton }: PaginaNoEncontradaProps): React.JSX.Element {
  return (
    <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
      <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
        <Box>
          <Box
            component="img"
            alt="Under development"
            src="/assets/error-404.png"
            sx={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
          />
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          {titulo}
        </Typography>
        {descripcion ? (
          <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
            {descripcion}
          </Typography>
        ) : null}
        <Button
          component={RouterLink}
          href={paths.home}
          startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
        >
          {textoBoton}
        </Button>
      </Stack>
    </Box>
  );
}
