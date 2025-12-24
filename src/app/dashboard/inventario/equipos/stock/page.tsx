import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
export const metadata = { title: `Stock equipos | ${config.site.name}` } satisfies Metadata;
import { TablaVisualizarStockEquipos } from '@/components/dashboard/inventario/equipos/TablaVisualizarStockEquipos';

export default function CrearDevolucionPage(): React.JSX.Element {
    return <TablaVisualizarStockEquipos />;
}