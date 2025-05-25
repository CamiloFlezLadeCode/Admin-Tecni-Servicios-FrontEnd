import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarUsuariosGenerales } from '@/components/dashboard/gestion-y-control/usuarios-generales/ver/TablaVisualizarUsuariosGenerales';


export const metadata = { title: `Ver usuarios generales | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return <TablaVisualizarUsuariosGenerales />;
};