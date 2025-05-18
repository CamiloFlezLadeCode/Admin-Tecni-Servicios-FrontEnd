import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NavBarHojaDeVidaEquipos } from '@/components/dashboard/hoja-de-vida-equipos/NavBarHojaDeVidaDeEquipos';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Hoja de vida equipos</Typography>
            <NavBarHojaDeVidaEquipos />
            {/* <main style={{ padding: '1rem' }}>{children}</main> */}
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}