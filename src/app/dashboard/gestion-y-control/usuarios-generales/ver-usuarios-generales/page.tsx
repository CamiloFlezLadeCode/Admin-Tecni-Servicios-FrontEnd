import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';


export const metadata = { title: `Ver usuarios generales | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <div>
      <Typography variant="h4">Bienvenido a la vista de usuarios generales</Typography>
    </div>
  );
};