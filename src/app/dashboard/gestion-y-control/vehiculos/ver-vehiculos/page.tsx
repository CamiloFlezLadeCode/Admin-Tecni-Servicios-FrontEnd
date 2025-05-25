import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
// import { TablaVisuali }

export const metadata = { title: `Ver vehículos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <h6>Visualizar vehículos</h6>
};