'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver remisiones',
        path: paths.dashboard.comercialremisionesver,
        icon: Eye
    },
    {
        label: 'Crear remisión',
        path: paths.dashboard.comercialremisionescrear,
        icon: Plus
    }
];

export function NavRemisiones(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} />;
}
