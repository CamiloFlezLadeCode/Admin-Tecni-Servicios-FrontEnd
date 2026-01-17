export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    home: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    remisiones: '/dashboard/remisiones',
    devoluciones: '/dashboard/devoluciones',
    maestro: '/dashboard/maestro',
    // nuevas rutas para modulo maestro
    maestroclientes: '/dashboard/maestro/clientes',
    maestromecanicos: '/dashboard/maestro/mecanicos',
    maestroequipos: '/dashboard/maestro/equipos',

    // Nuevas rutas para modulo devoluciones
    devolucionescrear: '/dashboard/devoluciones/crear-devolucion',
    devolucionesver: '/dashboard/devoluciones/ver-devoluciones',

    // Nuevas rutas para modulo remisiones
    remisionescrear: '/dashboard/remisiones/crear-remision',
    remisionesver: '/dashboard/remisiones/ver-remisiones',

    precios: '/dashboard/precios',

    // Rutas para hojas de vida equipos
    hojadevidaequipos: '/dashboard/hoja-de-vida-equipos',
    hojadevidaequiposcrear: '/dashboard/hoja-de-vida-equipos/crear-hoja-de-vida-equipo',
    hojadevidaequiposver: '/dashboard/hoja-de-vida-equipos/ver-hojas-de-vida-equipos',

    // MUDULO COMERCIAL (REMISIONES, DEVOLUCIONES Y ESTADO_DE_CUENTA)
    comercial: '/dashboard/comercial',

    // Remisiones
    comercialremisiones: '/dashboard/comercial/remisiones',
    comercialremisionescrear: '/dashboard/comercial/remisiones/crear-remision',
    comercialremisionesver: '/dashboard/comercial/remisiones/ver-remisiones',

    // Devoluciones
    comercialdevoluciones: '/dashboard/comercial/devoluciones',
    comercialdevolucionescrear: '/dashboard/comercial/devoluciones/crear-devolucion',
    comercialdevolucionesver: '/dashboard/comercial/devoluciones/ver-devoluciones',

    // Órdenes de servicio
    comercialordenesdeservicio: '/dashboard/comercial/ordenes-de-servicio',
    comercialordenesdeserviciocrear: '/dashboard/comercial/ordenes-de-servicio/crear-ordenes-de-servicio',
    comercialordenesdeserviciover: '/dashboard/comercial/ordenes-de-servicio/ver-ordenes-de-servicio',

    // Estado de cuenta
    comercialestadodecuenta: '/dashboard/comercial/estado-de-cuenta',
    //...

    // MODULO GESTIÓN Y CONTROL (EQUIPOS, CLIENTES, MACANICOS, PROYECTOS, REPUESTOS)
    gestionycontrol: '/dashboard/gestion-y-control',

    // Clientes
    gestionycontrolclientes: '/dashboard/gestion-y-control/clientes',
    gestionycontrolclientescrear: '/dashboard/gestion-y-control/clientes/crear-cliente',
    gestionycontrolclientesver: '/dashboard/gestion-y-control/clientes/ver-clientes',

    // Equipos
    gestionycontrolequipos: '/dashboard/gestion-y-control/equipos',
    gestionycontrolequiposcrear: '/dashboard/gestion-y-control/equipos/crear-equipo',
    gestionycontrolequiposver: '/dashboard/gestion-y-control/equipos/ver-equipos',

    // Mecánicos
    gestionycontrolmecanicos: '/dashboard/gestion-y-control/mecanicos',
    gestionycontrolmecanicoscrear: '/dashboard/gestion-y-control/mecanicos/crear-mecanico',
    gestionycontrolmecanicosver: '/dashboard/gestion-y-control/mecanicos/ver-mecanicos',

    // Proyectos
    gestionycontrolproyectos: '/dashboard/gestion-y-control/proyectos',
    gestionycontrolproyectoscrear: '/dashboard/gestion-y-control/proyectos/crear-proyecto',
    gestionycontrolproyectosver: '/dashboard/gestion-y-control/proyectos/ver-proyectos',

    // Repuestos
    gestionycontrolrepuestos: '/dashboard/gestion-y-control/repuestos',
    gestionycontrolrepuestoscrear: '/dashboard/gestion-y-control/repuestos/crear-repuesto',
    gestionycontrolrepuestosver: '/dashboard/gestion-y-control/repuestos/ver-repuestos',

    // Usuarios Generales
    gestionycontrolusuariosgenerales: '/dashboard/gestion-y-control/usuarios-generales',
    gestionycontrolusuariosgeneralescrear: '/dashboard/gestion-y-control/usuarios-generales/crear-usuario-general',
    gestionycontrolusuariosgeneralesver: '/dashboard/gestion-y-control/usuarios-generales/ver-usuarios-generales',
    gestionycontrolusuariosgeneraleseditar: '/dashboard/gestion-y-control/usuarios-generales/editar-usuario-general',

    // Vehículos
    gestionycontrolvehiculos: '/dashboard/gestion-y-control/vehiculos',
    gestionycontrolvehiculoscrear: '/dashboard/gestion-y-control/vehiculos/crear-vehiculo',
    gestionycontrolvehiculosver: '/dashboard/gestion-y-control/vehiculos/ver-vehiculos',

    // Bodegas
    gestionycontrolbodegas: '/dashboard/gestion-y-control/bodegas',
    gestionycontrolbodegascrear: '/dashboard/gestion-y-control/bodegas/crear-bodega',
    gestionycontrolbodegasver: '/dashboard/gestion-y-control/bodegas/ver-bodegas',
    //...

    // Configuraciones
    configuraciones: '/dashboard/configuraciones',
    // ...

    // Acerca
    acerca: '/dashboard/acerca',
    // ...

    // Inventario
    inventario: '/dashboard/inventario',
    // ...

    // Inventario de equipos
    inventarioequipos: '/dashboard/inventario/equipos',
    inventarioequiposentrdas: '/dashboard/inventario/equipos/entradas',
    inventarioequipossalidas: '/dashboard/inventario/equipos/salidas',
    inventarioequiposstock: '/dashboard/inventario/equipos/stock',
    // ...

    // Inventario de repuestos
    inventariorepuestos: '/dashboard/inventario/repuestos',
    inventariorepuestosentradas: '/dashboard/inventario/repuestos/entradas',
    inventariorepuestossalidas: '/dashboard/inventario/repuestos/salidas',
    inventariorepuestosstock: '/dashboard/inventario/repuestos/stock',
    // ...

    // Facturación 
    facturacion: '/dashboard/facturacion',
    // ...
  },
  errors: { notFound: '/errors/not-found' },
} as const;
