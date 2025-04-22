import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarCientes } from '@/components/dashboard/gestion-y-control/clientes/ver/TablaVisualizarClientes';


export const metadata = { title: `Visualizar clientes | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
//   return (
//     <div>
//       <Typography variant="h4">Vista de clientes</Typography>
//     </div>
//   );

    return <TablaVisualizarCientes />;
}