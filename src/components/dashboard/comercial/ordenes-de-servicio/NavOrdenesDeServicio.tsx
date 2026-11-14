'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver ordenes de servicio',
        path: paths.dashboard.comercialordenesdeserviciover,
        icon: Eye
    },
    {
        label: 'Crear orden de servicio',
        path: paths.dashboard.comercialordenesdeserviciocrear,
        icon: Plus
    }
];

export function NavOrdenesDeServicio(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} />;
}
