import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },

  { key: 'overview', title: 'Panel', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Clientes', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integraciones', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
  { key: 'error', title: 'Remisiones', href: paths.dashboard.remisiones, icon: 'arrow-circle-right' },
  { key: 'error', title: 'Devoluciones', href: paths.dashboard.devoluciones, icon: 'arrow-circle-left' },
  { key: 'account', title: 'Cuenta', href: paths.dashboard.account, icon: 'user' },
  { key: 'admin', title: 'Maestro', href: paths.dashboard.maestro, icon: 'detective' },
  { key: 'settings', title: 'Ajustes', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
