'use client';

import * as React from 'react';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const ItemsNavMovimientos = [
    {
        label: 'Ver movimientos generales',
        path: paths.dashboard.comercialmovimientogeneralesver,
        icon: Eye
    }
];

export function NavMovimientosGenerales(): React.JSX.Element {
    return <NavBarLayout ItemsLayout={ItemsNavMovimientos} rutaExacta />;
}
