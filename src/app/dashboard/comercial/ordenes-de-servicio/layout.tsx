// PARA EJEMPLO PRUEBA Y PODER CREAR EL PNPM RUN BUILD

import * as React from 'react';
import { MainNav } from '@/components/dashboard/maestro/AppBar';
import Typography from '@mui/material/Typography';
import { NavOrdenesDeServicio } from '@/components/dashboard/comercial/ordenes-de-servicio/NavOrdenesDeServicio';
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
      <Typography variant="h6" style={{ fontWeight: 'bold' }}>Ordenes de servicio</Typography>
      <NavOrdenesDeServicio />
      {/* <main style={{ padding: '1rem' }}>{children}</main> */}
      <main style={{ marginTop: '0.5rem' }}>{children}</main>
    </div>
  );
}