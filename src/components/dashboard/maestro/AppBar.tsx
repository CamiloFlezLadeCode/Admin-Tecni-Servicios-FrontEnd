'use client';

import * as React from 'react';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { Wrench } from '@phosphor-icons/react/dist/ssr/Wrench';
import { CraneTower } from '@phosphor-icons/react/dist/ssr/CraneTower';
import { paths } from '@/paths';
import { NavBarLayout } from '@/components/dashboard/componentes_generales/layout/NavBar';

const navItems = [
  {
    label: 'Equipos',
    path: paths.dashboard.maestroequipos,
    icon: CraneTower,
  },
  {
    label: 'Clientes',
    path: paths.dashboard.maestroclientes,
    icon: Users,
  },
  {
    label: 'Mecánicos',
    path: paths.dashboard.maestromecanicos,
    icon: Wrench,
  },
];

export function MainNav(): React.JSX.Element {
  return (
    <NavBarLayout
      ItemsLayout={navItems}
      altoAutomatico
      sxEncabezado={{ zIndex: 'var(--mui-zIndex-appBar)' }}
      sxBarra={{ minHeight: '64px' }}
    />
  );
}
