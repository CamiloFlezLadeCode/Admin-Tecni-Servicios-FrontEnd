import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { ConsultarUbicacionEquipo } from '@/components/dashboard/gestion-y-control/equipos/ubicacion/ConsultarUbicacionEquipo';

export const metadata = { title: `Ubicación de equipos | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return <ConsultarUbicacionEquipo />;
}
