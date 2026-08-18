import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { ConsultarEstadoEquipo } from '@/components/dashboard/gestion-y-control/equipos/estado/ConsultarEstadoEquipo';

export const metadata = { title: `Estado de equipos | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return <ConsultarEstadoEquipo />;
}
