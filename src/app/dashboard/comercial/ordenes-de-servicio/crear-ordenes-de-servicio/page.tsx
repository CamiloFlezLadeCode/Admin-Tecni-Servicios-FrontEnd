
import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearOrdenDeServicio } from '@/components/dashboard/comercial/ordenes-de-servicio/crear/FormularioCrearOrdenDeServicio';
export const metadata = { title: `Crear orden de servicio | ${config.site.name}` } satisfies Metadata;

export default function CrearRemisionPage(): React.JSX.Element {
    return <FormularioCrearOrdenDeServicio />;
}