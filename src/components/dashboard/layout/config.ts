import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Panel', href: paths.dashboard.overview, icon: 'chart-pie' },
  // { key: 'customers', title: 'Clientes', href: paths.dashboard.customers, icon: 'users' },


  // { key: 'integrations', title: 'Integraciones', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
  // { key: 'remisiones', title: 'Remisiones', href: paths.dashboard.remisiones, icon: 'arrow-circle-right' },
  // {
  //   key: 'remisiones',
  //   title: 'Remisiones',
  //   href: paths.dashboard.remisiones,
  //   icon: 'arrow-circle-right',
  //   matcher: {
  //     type: 'startsWith',
  //     href: paths.dashboard.remisiones,
  //   }
  // },
  // { key: 'devoluciones', title: 'Devoluciones', href: paths.dashboard.devoluciones, icon: 'arrow-circle-left' },
  // {
  //   key: 'devoluciones',
  //   title: 'Devoluciones',
  //   icon: 'arrow-circle-left',
  //   href: paths.dashboard.devoluciones,
  //   matcher: {
  //     type: 'startsWith',
  //     href: paths.dashboard.devoluciones,
  //   }
  // },
  // { key: 'maestro', title: 'Maestro', href: paths.dashboard.maestro, icon: 'detective' },

  // {
  //   key: 'maestro',
  //   title: 'Maestro',
  //   icon: 'detective',
  //   href: paths.dashboard.maestro,
  //   matcher: { // Esto es para que cuando se navegue por maestro/clientes - maestro/mecanicos - maestro/equipos, la opción maestro del navbar, no se demarque
  //     type: 'startsWith',
  //     href: paths.dashboard.maestro,
  //   }
  // },


  // { key: 'precios', title: 'Precios', href: paths.dashboard.precios, icon: 'currency-dollar' },


  // Configuración para modulo comercial
  {
    key: 'comercial',
    title: 'Comercial',
    // href: paths.dashboard.comercial,
    icon: '',
    items: [
      {
        key: 'comercial_remisiones',
        title: 'Remisiones',
        href: paths.dashboard.comercialremisiones,
        icon: 'arrow-circle-right',
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.comercialremisiones
        }
      },
      {
        key: 'comercial_devoluciones',
        title: 'Devoluciones',
        href: paths.dashboard.comercialdevoluciones,
        icon: 'arrow-circle-left',
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.comercialdevoluciones
        }
      },
      {
        key: 'comercial_ordenes_de_servicio',
        title: 'Órdenes de servicio',
        href: paths.dashboard.comercialordenesdeservicio,
        icon: 'icono-ordenes-de-servicio',
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.comercialordenesdeservicio
        }
      }
    ]
  },

  // Configuración para modulo de gestión y control
  {
    key: 'gestionycontrol',
    title: 'Gestión y control',
    items: [
      // {
      //   key: 'bodegas',
      //   title: 'Bodegas',
      //   icon: 'icono-bodegas',
      //   href: paths.dashboard.gestionycontrolbodegas,
      //   matcher: {
      //     type: 'startsWith',
      //     href: paths.dashboard.gestionycontrolbodegas,
      //   }
      // },
      // {
      //   key: 'clientes',
      //   title: 'Clientes',
      //   icon: 'icono-clientes',
      //   href: paths.dashboard.gestionycontrolclientes,
      //   matcher: {
      //     type: 'startsWith',
      //     href: paths.dashboard.gestionycontrolclientes
      //   }
      // },
      {
        key: 'equipos',
        title: 'Equipos',
        icon: 'icono-equipos',
        href: paths.dashboard.gestionycontrolequipos,
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.gestionycontrolequipos
        }
      },
      // {
      //   key: 'mecanicos',
      //   title: 'Mecánicos',
      //   icon: 'icono-mecanicos',
      //   href: paths.dashboard.gestionycontrolmecanicos,
      //   matcher: {
      //     type: 'startsWith',
      //     href: paths.dashboard.gestionycontrolmecanicos
      //   }
      // },
      {
        key: 'proyectos',
        title: 'Proyectos',
        icon: 'icono-proyectos',
        href: paths.dashboard.gestionycontrolproyectos,
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.gestionycontrolproyectos
        }
      },
      {
        key: 'repuestos',
        title: 'Repuestos',
        icon: 'icono-repuestos',
        href: paths.dashboard.gestionycontrolrepuestos,
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.gestionycontrolrepuestos
        }
      },
      {
        key: 'usuariosgenerales',
        title: 'Usuarios generales',
        icon: 'usuarios-generales',
        href: paths.dashboard.gestionycontrolusuariosgenerales,
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.gestionycontrolusuariosgenerales,
        }
      },
      {
        key: 'vehiculos',
        title: 'Vehículos',
        icon: 'icono-vehiculos',
        href: paths.dashboard.gestionycontrolvehiculos,
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.gestionycontrolvehiculos,
        }
      }
    ]
  },
  {
    key: 'hojadevidaequipos',
    title: 'Hoja de vida equipos',
    href: paths.dashboard.hojadevidaequipos,
    icon: 'read-cv-logo',
    matcher: {
      type: 'startsWith',
      href: paths.dashboard.hojadevidaequipos
    }
  },
  {
    key: 'Tarifas',
    title: 'Tarifas',
    items: [
      {
        key: 'Precio1',
        title: 'Precio1',
        icon: 'icono-precio1',
        href: ''
      },
      {
        key: 'Precio2',
        title: 'Precio2',
        icon: 'icono-precio2',
        href: ''
      },
      {
        key: 'Precio3',
        title: 'Precio3',
        icon: 'icono-precio3',
        href: ''
      }
    ]
  },
  { key: 'account', title: 'Cuenta', href: paths.dashboard.account, icon: 'user' },
  { key: 'settings', title: 'Ajustes/Configuraciones', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
