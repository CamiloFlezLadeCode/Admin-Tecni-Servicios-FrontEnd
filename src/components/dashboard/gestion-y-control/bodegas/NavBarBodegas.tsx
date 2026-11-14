'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavBodegas = [
    {
        label: 'Ver bodegas',
        path: paths.dashboard.gestionycontrolbodegasver,
        icon: Eye
    },
    {
        label: 'Crear bodega',
        path: paths.dashboard.gestionycontrolbodegascrear,
        icon: Plus
    }
];

export function NavBarBodegas(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavBodegas} />;
}
