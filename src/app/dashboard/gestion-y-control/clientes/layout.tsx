import * as React from 'react';
import { NavBarClientes } from '@/components/dashboard/gestion-y-control/clientes/NavBarClientes';
import Typography from '@mui/material/Typography';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div>
      <Typography variant="h6" style={{ fontWeight: 'bold' }}>Clientes</Typography>
      <NavBarClientes />
      {/* <main style={{ padding: '1rem' }}>{children}</main> */}
      <main style={{ marginTop: '0.5rem' }}>{children}</main>
    </div>
  );
}