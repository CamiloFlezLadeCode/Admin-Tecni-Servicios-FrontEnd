import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarVehiculos } from '@/components/dashboard/gestion-y-control/vehiculos/ver/TablaVisualizarVehiculos';

export const metadata = { title: `Ver vehículos | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
    return <TablaVisualizarVehiculos />;
};