'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavDevoluciones = [
    {
        label: 'Ver proyectos',
        path: paths.dashboard.gestionycontrolproyectosver,
        icon: Eye
    },
    {
        label: 'Crear proyecto',
        path: paths.dashboard.gestionycontrolproyectoscrear,
        icon: Plus
    }
];

export function NavBarProyectos(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavDevoluciones} altoAutomatico />;
}
