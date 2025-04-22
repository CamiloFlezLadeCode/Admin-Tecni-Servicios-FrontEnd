import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearProyecto } from '@/components/dashboard/gestion-y-control/proyectos/crear/FormularioCrearProyecto';

export const metadata = { title: `Crear proyecto | ${config.site.name}` } satisfies Metadata;

export default function CrearMecanicoPage(): React.JSX.Element {
    return <FormularioCrearProyecto />;
}