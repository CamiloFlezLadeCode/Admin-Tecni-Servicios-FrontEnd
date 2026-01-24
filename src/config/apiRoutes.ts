type Entorno = 'Produccion' | 'Desarrollo';

const ENTORNO = (process.env.NEXT_PUBLIC_ENTORNO as Entorno) ?? 'Desarrollo';

const URLS: Record<Entorno, string | undefined> = {
    Produccion: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
    Desarrollo: process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT,
};

const API_BASE_URL = URLS[ENTORNO] ?? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;

export const apiRoutes = {
    guardar_backup: `${API_BASE_URL}/crear-backup`,
    login: {
        iniciar_sesion: `${API_BASE_URL}/login`,
        perfil: `${API_BASE_URL}/perfil`,
        cerrar_sesion: `${API_BASE_URL}/logout`
    },
    usuariosgenerales: {
        listar: `${API_BASE_URL}/ver-usuarios-generales`,
        crear: `${API_BASE_URL}/crear-usuario`,
        verificarexistenciausuario: (documento: string) => `${API_BASE_URL}/buscarclientepordocumento/${documento}`,
        consultarusuariogeneral: (documentoUsuariogeneral: string) => `${API_BASE_URL}/ver-usuario-general/${documentoUsuariogeneral}`,
        actualizarusuariogeneral: `${API_BASE_URL}/actualizar-usuario-general`,
    },
    proyectos: {
        listar: `${API_BASE_URL}/ver-proyectos`,
        crear: `${API_BASE_URL}/crear-proyecto`,
        // etc.
    },
    mecanicos: {
        listar: `${API_BASE_URL}/ver-mecanicos`,
        // ...
    },
    auth: {
        login: `${API_BASE_URL}/login`,
        logout: `${API_BASE_URL}/logout`,
    },
    vehiculos: {
        crearvehiculo: `${API_BASE_URL}/crear-vehiculo`,
        vervehiculos: `${API_BASE_URL}/ver-vehiculos`,
        consultarvehiculoporid: (IdVehiculo: number) => `${API_BASE_URL}/ver-vehiculo/${IdVehiculo}`,
        actualizarvehiculo: `${API_BASE_URL}/actualizar-vehiculo`,
        eliminarvehiculo: (IdVehiculo: number) => `${API_BASE_URL}/eliminar-vehiculo/${IdVehiculo}`
    },
    generales: {
        listarsubarrendatarios: `${API_BASE_URL}/listar-subarrendatarios`,
        listarbodegueros: `${API_BASE_URL}/listar-bodegueros`,
        listardespachadores: `${API_BASE_URL}/listar-despachadores`,
        listartransportadores: `${API_BASE_URL}/listar-transportadores`,
        listarvehiculos: `${API_BASE_URL}/listar-vehiculos`,
        listarestados: `${API_BASE_URL}/listar-estados`,
        listarcategorias: `${API_BASE_URL}/listar-categorias`,
        listarclientes: `${API_BASE_URL}/listar-clientes`,
        listarequipos: `${API_BASE_URL}/listar-equipos`,
        listarniveles: `${API_BASE_URL}/listar-niveles`,
        listarproyectos: `${API_BASE_URL}/listar-proyectos`,
        listarroles: `${API_BASE_URL}/listar-roles`,
        listartiposdedocumentos: `${API_BASE_URL}/listar-tipo-de-documentos`,
        listarmecanicos: `${API_BASE_URL}/listar-mecanicos`,
        listartiposdebodegas: `${API_BASE_URL}/listar-tipo-de-bodegas`,
        listartipodeequipos: `${API_BASE_URL}/listar-tipo-de-equipos`,
        listarunidades: `${API_BASE_URL}/listar-unidades-de-medida`,
        listarbodegasporsubarrendatario: `${API_BASE_URL}/listar-bodegas-subarrendatario`,
    },
    comercial: {
        remisiones: {
            crearremision: `${API_BASE_URL}/crear-remision`,
            consultarcantidaddisponiblequipo: (IdEquipo: number) => `${API_BASE_URL}/ver-cantidad-disponible-equipo/${IdEquipo}`,
            consultarsiguientenoremision: `${API_BASE_URL}/siguiente-no-remision`,
            ver_remisiones: `${API_BASE_URL}/ver-remisiones`,
            ver_remision_por_id: `${API_BASE_URL}/ver-remision-por-id`,
            cantidad_remisiones_devoluciones_ultimos_6_meses: `${API_BASE_URL}/cantidad-remisiones-devoluciones-ultimos-6-meses`,
            totales_movimientos_mes_actual: `${API_BASE_URL}/totales-movimientos-mes-actual`,
            actividad_reciente_movimientos: `${API_BASE_URL}/actividad-reciente-movimientos`,
            ver_pdf_remision: (IdRemision: number) => `${API_BASE_URL}/obtener-pdf-remision/${IdRemision}`,
            eliminar_remision: `${API_BASE_URL}/eliminar-remision`,
            actualizar_remision: `${API_BASE_URL}/actualizar-remision`,
            ver_disponibilidad_de_equipos: `${API_BASE_URL}/ver-disponibilidad-equipos`,
            listar_equipos_generales: `${API_BASE_URL}/ver-disponibilidad-equipos-generales`
        },
        devoluciones: {
            creardevolucion: `${API_BASE_URL}/crear-devolucion`,
            ver_remisiones_del_cliente: `${API_BASE_URL}/ver-remisiones-cliente`,
            mostrar_items_remision: `${API_BASE_URL}/ver-items-remision`,
            consultar_siguiente_no_devolucion: `${API_BASE_URL}/siguiente-no-devolucion`,
            ver_todas_las_devoluciones: `${API_BASE_URL}/ver-todas-las-devoluciones`,
            ver_pdf_devolucion: `${API_BASE_URL}/obtener-pdf-devolucion`,
            eliminar_devolucion: `${API_BASE_URL}/eliminar-devolucion`,
            ver_subarrendatarios_con_remisiones_asignadas_cliente_proyecto: `${API_BASE_URL}/ver-subarrendatarios-con-remisiones-asignadas-para-cliente-proyecto`,
            equipos_pendientes_por_devolver: `${API_BASE_URL}/equipos-pendientes-por-devolver`
        },
        ordenes_de_servicio: {
            consultar_siguiente_no_orden_de_servicio: `${API_BASE_URL}/siguiente-no-orden-de-servicio`,
            crear_orden_de_servicio: `${API_BASE_URL}/crear-orden-de-servicio`,
            ver_todas_las_ordenes_de_servicio: `${API_BASE_URL}/ver-todas-las-ordenes-de-servicio`,
            ver_pdf_orden_de_servicio: `${API_BASE_URL}/obtener-pdf-orden-de-servicio`,
            eliminar_orden_de_servicio: `${API_BASE_URL}/eliminar-orden-de-servicio`,
            ver_equipos_del_cliente: `${API_BASE_URL}/ver-equipos-del-cliente`,
            ver_repuestos_disponibles: `${API_BASE_URL}/ver-repuestos-disponibles`,
            ver_disponibilidad_de_repuesto: `${API_BASE_URL}/ver-disponibilidad-de-repuesto`
        },
        estado_de_cuenta: {
            ver_estado_de_cuenta_cliente: `${API_BASE_URL}/ver-estado-de-cuenta-cliente`,
            informe_cliente_equipos_en_obra: `${API_BASE_URL}/informe-cliente-equipos-en-obra`,
            informe_interno_empresa_equipos_en_obra: `${API_BASE_URL}/informe-interno-empresa-equipos-en-obra`
        },
        movimientos_generales: {
            ver_movimientos_generales: `${API_BASE_URL}/ver-movimientos-generales`,
        }
    },
    gestionycontrol: {
        ajustes: {
            actualizar_credenciales_usuario_activo: `${API_BASE_URL}/actualizar-credenciales`,
        },
        cuenta: {
            ver_informacion_usuario_activo: (DocumentoUsuarioActivo: string) => `${API_BASE_URL}/ver-informacion-usuario/${DocumentoUsuarioActivo}`,
            subir_guardar_avatar: `${API_BASE_URL}/subir-avatar`,
            mostrar_avatar_usuario_activo: (DocumentoUsuarioActivo: string) => `${API_BASE_URL}/mostrar-avatar/${DocumentoUsuarioActivo}`,
            actualizar_informacion_usuario_activo: `${API_BASE_URL}/actualizar-informacion-usuario`
        },
        equipos: {
            verequipoporid: (IdEquipo: number) => `${API_BASE_URL}/ver-equipo/${IdEquipo}`,
            actualizarequipo: `${API_BASE_URL}/actualizar-equipo`,
            crear_equipo: `${API_BASE_URL}/crear-equipo`,
            ver_todos_los_equipo: `${API_BASE_URL}/ver-equipos`
        },
        repuestos: {
            crear_repuesto: `${API_BASE_URL}/crear-repuesto`,
            ver_repuestos: `${API_BASE_URL}/ver-repuestos`,
            consultar_repuesto_por_id: (IdRepuesto: number) => `${API_BASE_URL}/ver-repuesto/${IdRepuesto}`,
            actualizar_repuesto: `${API_BASE_URL}/actualizar-repuesto`
        },
        clientes: {
            crear_cliente_completo: `${API_BASE_URL}/crearclientecompleto`,
            buscar_existencia_cliente: (identificacion: string) => `${API_BASE_URL}/buscarclientepordocumento/${identificacion}`,
            consultar_todos_los_clientes: `${API_BASE_URL}/ver-clientes`
        },
        mecanicos: {
            ver_todos_los_mecanicos: `${API_BASE_URL}/ver-mecanicos`,
            crear_mecanico: `${API_BASE_URL}/crear-mecanico`
        },
        proyectos: {
            ver_todos_los_proyectos: `${API_BASE_URL}/ver-proyectos`,
            crear_proyecto: `${API_BASE_URL}/crear-proyecto`,
            ver_proyecto_por_id: `${API_BASE_URL}/ver-proyecto-por-id`,
            actualizar_proyecto: `${API_BASE_URL}/actualizar-proyecto`
        },
        usuarios: {
            crear_usuario: `${API_BASE_URL}/crear-usuario`
        },
        usuarios_generales: {
            crear_usuario_general: `${API_BASE_URL}/crear-usuario-general`
        },
        bodegas: {
            crear_bodega: `${API_BASE_URL}/crear-bodega`,
            ver_bodegas: `${API_BASE_URL}/ver-bodegas`,
            ver_info_bodega: `${API_BASE_URL}/ver-bodega`,
            actualizar_bodega: `${API_BASE_URL}/actualizar-bodega`
        }
    },
    configuraciones: {
        listar_profesionales_pertenecientes: `${API_BASE_URL}/ver-profesionales-pertenecientes`,
        consultar_credenciales_del_profesional: (DocumentoProfesional: string) => `${API_BASE_URL}/consultar-credenciales-del-profesional/${DocumentoProfesional}`,
        crear_credenciales_profesional_por_administrador: `${API_BASE_URL}/crear-credenciales-profesional`,
        actualizar_credenciales_profesional_por_administrador: `${API_BASE_URL}/actualizar-credenciales-profesional`
    },
    inventario: {
        equipos: {
            listar_equipos_propios: `${API_BASE_URL}/listar-equipos-propios`,
            siguiente_numero_entrada_equipos: `${API_BASE_URL}/siguiente-no-entrada-equipos`,
            guardar_entrada_equipos: `${API_BASE_URL}/guardar-entrada-equipos`,
            ver_todas_las_entradas_equipos: `${API_BASE_URL}/ver-entradas-de-equipos`,
            visualizar_entrada_equipos: `${API_BASE_URL}/visualizar-entrada-equipos`,
            ver_stock_equipos: `${API_BASE_URL}/ver-stock-equipos`,
            siguiente_numero_salida_equipos: `${API_BASE_URL}/siguiente-no-salida-equipos`,
            guardar_salida_equipos: `${API_BASE_URL}/guardar-salida-equipos`,
            ver_todas_las_salidas_equipos: `${API_BASE_URL}/ver-salidas-de-equipos`,
            visualizar_salida_equipos: `${API_BASE_URL}/visualizar-salida-equipos`,
            listar_tipos_movimiento_equipo: `${API_BASE_URL}/listar-tipos-movimiento-equipo`,
        },
        repuestos: {
            listar_repuestos: `${API_BASE_URL}/listar-repuestos`,
            listar_tipos_movimiento_repuesto: `${API_BASE_URL}/listar-tipos-movimiento-repuesto`,
            siguiente_numero_entrada_repuestos: `${API_BASE_URL}/siguiente-no-entrada-repuestos`,
            guardar_entrada_repuestos: `${API_BASE_URL}/guardar-entrada-repuestos`,
            ver_todas_las_entradas_repuestos: `${API_BASE_URL}/ver-entradas-de-repuestos`,
            visualizar_entrada_repuestos: `${API_BASE_URL}/visualizar-entrada-repuestos`,
            ver_stock_repuestos: `${API_BASE_URL}/ver-stock-repuestos`,
            siguiente_numero_salida_repuestos: `${API_BASE_URL}/siguiente-no-salida-repuestos`,
            guardar_salida_repuestos: `${API_BASE_URL}/guardar-salida-repuestos`,
            ver_todas_las_salidas_repuestos: `${API_BASE_URL}/ver-salidas-de-repuestos`,
            visualizar_salida_repuestos: `${API_BASE_URL}/visualizar-salida-repuestos`
        }
    }
};
