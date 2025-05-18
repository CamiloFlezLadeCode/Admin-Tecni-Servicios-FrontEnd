import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';

export const metadata = { title: `Remisiones | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element{
    return (
        <div>
            <Typography variant="h6" style={{fontWeight: 'bold'}}>Inicio</Typography>
        </div>
    );
}