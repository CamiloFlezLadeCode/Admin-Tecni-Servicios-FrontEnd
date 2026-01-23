import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import Typography from '@mui/material/Typography';

export const metadata = { title: `Facturación | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6">¡Hola! Este será el Módulo de Facturación</Typography>
            <Typography variant="body1">Está en desarrollo</Typography>
        </div>
    )
}