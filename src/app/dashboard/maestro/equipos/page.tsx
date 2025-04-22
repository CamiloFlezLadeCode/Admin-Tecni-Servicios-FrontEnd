import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearEquipo } from '@/components/dashboard/maestro/equipos/formulario-crear-equipo';

export const metadata = { title: `Maestro | Equipos | ${config.site.name}` } satisfies Metadata;

export default function EquiposPage(): React.JSX.Element {
    return <FormularioCrearEquipo />;
  }