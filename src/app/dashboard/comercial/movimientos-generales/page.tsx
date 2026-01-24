import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarMovimientosGenerales } from '@/components/dashboard/comercial/movimientos-generales/ver/TablaVisualizarMovimientosGenerales';

export const metadata = { title: `Movimientos Generales | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return <TablaVisualizarMovimientosGenerales />;
}
