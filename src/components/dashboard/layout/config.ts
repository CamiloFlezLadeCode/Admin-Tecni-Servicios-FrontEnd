import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'home', title: 'Inicio', href: paths.dashboard.home, icon: 'home' },
  { key: 'home', title: 'Panel', href: paths.dashboard.home, icon: 'icono-crecimiento' },
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
    icon: 'file-text',
    // href: paths.dashboard.comercial,
    items: [
      {
        key: 'comercial_remisiones',
        title: 'Remisiones',
        // href: paths.dashboard.comercialremisiones,
        href: paths.dashboard.comercialremisionesver,
        icon: 'arrow-circle-right',
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.comercialremisiones,
          href: paths.dashboard.comercialremisionesver,
        }
      },
      {
        key: 'comercial_devoluciones',
        title: 'Devoluciones',
        // href: paths.dashboard.comercialdevoluciones,
        href: paths.dashboard.comercialdevolucionesver,
        icon: 'arrow-circle-left',
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.comercialdevoluciones,
          href: paths.dashboard.comercialdevolucionesver,
        }
      },
      {
        key: 'comercial_ordenes_de_servicio',
        title: 'Ordenes de servicio',
        // href: paths.dashboard.comercialordenesdeservicio,
        href: paths.dashboard.comercialordenesdeserviciover,
        icon: 'icono-ordenes-de-servicio',
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.comercialordenesdeservicio,
          href: paths.dashboard.comercialordenesdeserviciover,
        }
      },
      {
        key: 'comercial_estado_de_cuenta',
        title: 'Estado de cuenta',
        href: paths.dashboard.comercialestadodecuenta,
        icon: 'icono-estado-de-cuenta-cliente',
        matcher: {
          type: 'startsWith',
          href: paths.dashboard.comercialestadodecuenta
        }
      },
      {
        key: 'comercial_movimientos_generales',
        title: 'Movimientos generales',
        // href: paths.dashboard.comercialmovimientogenerales,
        href: paths.dashboard.comercialmovimientogeneralesver,
        icon: 'icono-movimientos-generales',
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.comercialmovimientogenerales,
          href: paths.dashboard.comercialmovimientogeneralesver,
        }
      },
    ]
  },

  // Configuración para modulo de gestión y control
  {
    key: 'gestionycontrol',
    title: 'Gestión y control',
    icon: 'clipboard',
    items: [
      {
        key: 'bodegas',
        title: 'Bodegas',
        icon: 'icono-bodegas',
        // href: paths.dashboard.gestionycontrolbodegas,
        href: paths.dashboard.gestionycontrolbodegasver,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.gestionycontrolbodegas,
          href: paths.dashboard.gestionycontrolbodegasver,
        }
      },
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
        // href: paths.dashboard.gestionycontrolequipos,
        href: paths.dashboard.gestionycontrolequiposver,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.gestionycontrolequipos,
          href: paths.dashboard.gestionycontrolequiposver,
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
        // href: paths.dashboard.gestionycontrolproyectos,
        href: paths.dashboard.gestionycontrolproyectosver,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.gestionycontrolproyectos,
          href: paths.dashboard.gestionycontrolproyectosver,
        }
      },
      {
        key: 'repuestos',
        title: 'Repuestos',
        icon: 'icono-repuestos',
        // href: paths.dashboard.gestionycontrolrepuestos,
        href: paths.dashboard.gestionycontrolrepuestosver,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.gestionycontrolrepuestos,
          href: paths.dashboard.gestionycontrolrepuestosver,
        }
      },
      {
        key: 'usuariosgenerales',
        title: 'Usuarios generales',
        icon: 'usuarios-generales',
        // href: paths.dashboard.gestionycontrolusuariosgenerales,
        href: paths.dashboard.gestionycontrolusuariosgeneralesver,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.gestionycontrolusuariosgenerales,
          href: paths.dashboard.gestionycontrolusuariosgeneralesver,
        }
      },
      {
        key: 'vehiculos',
        title: 'Vehículos',
        icon: 'icono-vehiculos',
        // href: paths.dashboard.gestionycontrolvehiculos,
        href: paths.dashboard.gestionycontrolvehiculosver,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.gestionycontrolvehiculos,
          href: paths.dashboard.gestionycontrolvehiculosver,
        }
      }
    ]
  },

  // Configuración para el módulo de inventario (equipos y repuestos)
  {
    key: 'inventario',
    title: 'Inventario',
    icon: 'package',
    items: [
      {
        key: 'inventario_equipos',
        title: 'Equipos',
        icon: 'icono-bodegas',
        // href: paths.dashboard.inventarioequipos,
        href: paths.dashboard.inventarioequiposstock,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.inventarioequipos,
          href: paths.dashboard.inventarioequiposstock,
        }
      },
      {
        key: 'inventario_repuestos',
        title: 'Repuestos',
        icon: 'icono-bodegas',
        // href: paths.dashboard.inventariorepuestos,
        href: paths.dashboard.inventariorepuestosstock,
        matcher: {
          type: 'startsWith',
          // href: paths.dashboard.inventariorepuestos,
          href: paths.dashboard.inventariorepuestosstock,
        }
      },
    ]
  },
  { key: 'facturacion', title: 'Facturación', href: paths.dashboard.facturacion, icon: 'icono-facturacion' },
  // {
  //   key: 'facturacion',
  //   title: 'Facturación',
  //   icon: 'icono-facturacion',
  //   items: [
  //     // {
  //     //   key: 'facturacion_remisiones',
  //     //   title: 'Remisiones',
  //     //   icon: 'icono-remisiones',
  //     //   href: paths.dashboard.facturacion,
  //     //   matcher: {
  //     //     type: 'startsWith',
  //     //     href: paths.dashboard.facturacion,
  //     //   }
  //     // },
  //     // {
  //     //   key: 'facturacion_devoluciones',
  //     //   title: 'Devoluciones',
  //     //   icon: 'icono-devoluciones',
  //     //   href: paths.dashboard.facturaciondevoluciones,
  //     //   matcher: {
  //     //     type: 'startsWith',
  //     //     href: paths.dashboard.facturaciondevoluciones,
  //     //   }
  //     // },
  //   ]
  // },

  // {
  //   key: 'hojadevidaequipos',
  //   title: 'Hoja de vida equipos',
  //   href: paths.dashboard.hojadevidaequipos,
  //   icon: 'read-cv-logo',
  //   matcher: {
  //     type: 'startsWith',
  //     href: paths.dashboard.hojadevidaequipos
  //   }
  // },
  // {
  //   key: 'Tarifas',
  //   title: 'Tarifas',
  //   items: [
  //     {
  //       key: 'Precio1',
  //       title: 'Precio1',
  //       icon: 'icono-precio1',
  //       href: ''
  //     },
  //     {
  //       key: 'Precio2',
  //       title: 'Precio2',
  //       icon: 'icono-precio2',
  //       href: ''
  //     },
  //     {
  //       key: 'Precio3',
  //       title: 'Precio3',
  //       icon: 'icono-precio3',
  //       href: ''
  //     }
  //   ]
  // },
  { key: 'account', title: 'Cuenta', href: paths.dashboard.account, icon: 'user' },
  { key: 'settings', title: 'Ajustes', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'configuraciones', title: 'Configuraciones', href: paths.dashboard.configuraciones, icon: 'icono-configuraciones-alto-nivel', roles: ['Administrador'] },
  { key: 'about', title: 'Acerca', href: paths.dashboard.acerca, icon: 'about' }
] satisfies NavItemConfig[];
