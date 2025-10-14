import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarEntradasEquipos } from '@/components/dashboard/inventario/equipos/TablaVisualizarEntradasEquipos';
export const metadata = { title: `Entradas equipos | ${config.site.name}` } satisfies Metadata;

export default function CrearDevolucionPage(): React.JSX.Element {
    return <TablaVisualizarEntradasEquipos />;
}