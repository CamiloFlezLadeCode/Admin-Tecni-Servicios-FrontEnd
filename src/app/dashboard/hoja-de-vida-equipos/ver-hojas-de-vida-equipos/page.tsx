import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarHojasDeVidaEquipos } from '@/components/dashboard/hoja-de-vida-equipos/ver/TablaVisualizarHojasDeVidaEquipos';

export const metadata = { title: `Visualizar hojas de vida | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarHojasDeVidaEquipos />;
}