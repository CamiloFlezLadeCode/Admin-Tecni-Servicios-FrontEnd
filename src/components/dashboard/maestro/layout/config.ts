import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Panel', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Clientes', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integraciones', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
  { key: 'remisiones', title: 'Remisiones', href: paths.dashboard.remisiones, icon: 'arrow-circle-right' },
  { key: 'devoluciones', title: 'Devoluciones', href: paths.dashboard.devoluciones, icon: 'arrow-circle-left' },
  { key: 'maestro', title: 'Maestro', href: paths.dashboard.maestro, icon: 'detective' },
  { key: 'account', title: 'Cuenta', href: paths.dashboard.account, icon: 'user' },
  { key: 'settings', title: 'Ajustes', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
