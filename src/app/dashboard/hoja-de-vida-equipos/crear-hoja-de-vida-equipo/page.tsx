import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearHojaDeVidaEquipo } from '@/components/dashboard/hoja-de-vida-equipos/crear/FormularioCrearHojaDeVidaEquipo';

export const metadata = { title: `Crear hoja de vida | ${config.site.name}` } satisfies Metadata;

export default function CrearMecanicoPage(): React.JSX.Element {
    return <FormularioCrearHojaDeVidaEquipo />;
}