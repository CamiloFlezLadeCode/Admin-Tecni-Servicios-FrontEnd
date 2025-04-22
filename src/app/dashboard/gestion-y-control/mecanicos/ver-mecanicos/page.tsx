import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarMecanicos } from '@/components/dashboard/gestion-y-control/mecanicos/ver/TablaVisualizarMecanicos';

export const metadata = { title: `Visualizar mecánicos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarMecanicos />;
}