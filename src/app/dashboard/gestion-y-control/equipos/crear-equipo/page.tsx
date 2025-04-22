import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearEquipo } from '@/components/dashboard/gestion-y-control/equipos/crear/FormularioCrearEquipo';

export const metadata = { title: `Crear equipo | ${config.site.name}` } satisfies Metadata;

export default function CrearEquipoPage(): React.JSX.Element {
    return <FormularioCrearEquipo />;
}