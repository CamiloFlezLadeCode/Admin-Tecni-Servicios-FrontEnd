import { NavBarUsuariosGenerales } from '@/components/dashboard/gestion-y-control/usuarios-generales/NavBarUsuariosGenerales';
import Typography from '@mui/material/Typography';
import * as React from 'react';


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Usuarios generales</Typography>
            <NavBarUsuariosGenerales />
            {/* <main style={{ padding: '1rem' }}>{children}</main> */}
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}