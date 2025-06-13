// PARA EJEMPLO PRUEBA Y PODER CREAR EL PNPM RUN BUILD

import * as React from 'react';
import { MainNav } from '@/components/dashboard/maestro/AppBar';
import Typography from '@mui/material/Typography';
import { NavDevoluciones } from '@/components/dashboard/devoluciones/NavDevoluciones';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
        <Typography variant="h5" style={{fontWeight: 'bold'}}>Devoluciones</Typography>
        <NavDevoluciones />
      {/* <main style={{ padding: '1rem' }}>{children}</main> */}
      <main style={{marginTop: '0.5rem'}}>{children}</main>
    </div>
  );
}