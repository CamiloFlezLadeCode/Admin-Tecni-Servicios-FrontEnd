import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';


export const metadata = { title: `Usuarios generales | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <div>
      {/* <Typography variant="h4">Bienvenido al Panel del Entidades Generales</Typography> */}
    </div>
  );
};