import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TablaVisualizarCientes } from '@/components/dashboard/gestion-y-control/clientes/ver/TablaVisualizarClientes';


export const metadata = { title: `Visualizar clientes | ${config.site.name}` } satisfies Metadata;

//Sin carga original
export default function Page(): React.JSX.Element {
    return <TablaVisualizarCientes />;
}

// //Con carga
// export default async function Page() {
//     await new Promise((resolve) => setTimeout(resolve, 12000));
//     return <TablaVisualizarCientes />;
// }