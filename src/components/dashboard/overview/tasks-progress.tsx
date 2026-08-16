'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';

export interface TasksProgressProps {
  sx?: SxProps;
  value: number;
}

export function TasksProgress({ value, sx }: TasksProgressProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Task Progress
              </Typography>
              <Typography variant="h4">{value}%</Typography>
            </Stack>
            {/* Icono con `contrastText`: sin él heredaba `background.default`
                y el contraste sobre el círculo quedaba al azar. */}
            <Avatar
              sx={{
                backgroundColor: 'var(--mui-palette-warning-main)',
                color: 'var(--mui-palette-warning-contrastText)',
                height: '56px',
                width: '56px',
              }}
            >
              <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          <div>
            {/*
              La barra iba en `primary` mientras el avatar iba en `warning`:
              dos colores para un solo dato. Se alinea con el avatar usando el
              mismo token, y la pista se construye con el canal del propio
              color (16% de opacidad) en vez de con un gris fijo, para que
              funcione igual sobre tarjeta clara y oscura.
            */}
            <LinearProgress
              aria-label="Progreso de tareas"
              sx={{
                backgroundColor: 'rgba(var(--mui-palette-warning-mainChannel) / 0.16)',
                borderRadius: 999,
                height: 8,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'var(--mui-palette-warning-main)',
                  borderRadius: 999,
                },
              }}
              value={value}
              variant="determinate"
            />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
