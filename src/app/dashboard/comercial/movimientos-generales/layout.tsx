'use client';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { paths } from '@/paths';
import { navIcons } from '@/components/dashboard/layout/nav-icons';


interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}


const items: NavItem[] = [
    { label: 'Remisiones', path: paths.dashboard.comercialremisiones, icon: navIcons['icono-remisiones'] },
    { label: 'Devoluciones', path: paths.dashboard.comercialdevoluciones, icon: navIcons['icono-devoluciones'] },
    { label: 'Generales', path: paths.dashboard.inventarioequiposstock, icon: navIcons['icono-remisiones-y-devoluciones'] },
];

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Movimientos generales</Typography>
            <NavBarLayout ItemsLayout={items} />
            {/* <main style={{ padding: '1rem' }}>{children}</main> */}
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}
