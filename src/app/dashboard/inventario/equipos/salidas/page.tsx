import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarSalidasEquipos } from '@/components/dashboard/inventario/equipos/TablaVisualizarSalidasEquipos';
export const metadata = { title: `Salidas equipos | ${config.site.name}` } satisfies Metadata;

export default function CrearDevolucionPage(): React.JSX.Element {
    return <TablaVisualizarSalidasEquipos />;
}