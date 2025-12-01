'use client';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { paths } from '@/paths';
import { ArrowSquareIn, ArrowSquareOut, Package } from '@phosphor-icons/react';


interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}


const items: NavItem[] = [
    { label: 'Entradas', path: paths.dashboard.inventarioequiposentrdas, icon: ArrowSquareIn },
    { label: 'Salidas', path: paths.dashboard.inventarioequipossalidas, icon: ArrowSquareOut },
    { label: 'Stock', path: paths.dashboard.inventarioequiposstock, icon: Package },
];

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Inventario de equipos</Typography>
            <NavBarLayout ItemsLayout={items} />
            {/* <main style={{ padding: '1rem' }}>{children}</main> */}
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}
