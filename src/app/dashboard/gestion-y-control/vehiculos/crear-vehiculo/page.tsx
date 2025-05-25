import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearVehiculo } from '@/components/dashboard/gestion-y-control/vehiculos/crear/FormularioCrearVehiculo';

export const metadata = { title: `Crear vehículo | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return <FormularioCrearVehiculo />
};