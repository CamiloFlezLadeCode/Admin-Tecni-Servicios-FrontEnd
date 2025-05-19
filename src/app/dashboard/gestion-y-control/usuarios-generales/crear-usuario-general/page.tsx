import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearUsuarioGeneral } from '@/components/dashboard/gestion-y-control/usuarios-generales/crear/FormularioCrearUsuarioGeneral';

export const metadata = { title: `Crear usuario generalas | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return <FormularioCrearUsuarioGeneral />
};