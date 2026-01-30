import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarMovimientosGenerales } from '@/components/dashboard/comercial/movimientos-generales/ver/TablaVisualizarMovimientosGenerales';

export default function VerMovimientosGeneralesPage(): React.JSX.Element {
    return <TablaVisualizarMovimientosGenerales />
}