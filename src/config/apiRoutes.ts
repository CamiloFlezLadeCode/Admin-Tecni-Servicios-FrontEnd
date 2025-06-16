const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const apiRoutes = {
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
        consultarvehiculoporid: (IdVehiculo: string) => `${API_BASE_URL}/ver-vehiculo/${IdVehiculo}`,
        actualizarvehiculo: `${API_BASE_URL}/actualizar-vehiculo`,
        eliminarvehiculo: (IdVehiculo: number) => `${API_BASE_URL}/eliminar-vehiculo/${IdVehiculo}`
    },
    generales: {
        listarsubarrendatarios: `${API_BASE_URL}/listar-subarrendatarios`,
        listarbodegueros: `${API_BASE_URL}/listar-bodegueros`,
        listardespachadores: `${API_BASE_URL}/listar-despachadores`,
        listartransportadores: `${API_BASE_URL}/listar-transportadores`,
        listarvehiculos: `${API_BASE_URL}/listar-vehiculos`,
        listarestados: `${API_BASE_URL}/listar-estados`
    },
    comercial: {
        remisiones: {
            crearremision: `${API_BASE_URL}/crear-remision`,
            consultarcantidaddisponiblequipo: (IdEquipo: number) => `${API_BASE_URL}/ver-cantidad-disponible-equipo/${IdEquipo}`,
            consultarsiguientenoremision: `${API_BASE_URL}/siguiente-no-remision`
        },
        devoluciones: {
            creardevolucion: `${API_BASE_URL}/crear-devolucion`
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
            actualizarequipo: `${API_BASE_URL}/actualizar-equipo`
        },
        repuestos: {
            crear_repuesto: `${API_BASE_URL}/crear-repuesto`,
            ver_repuestos: `${API_BASE_URL}/ver-repuestos`,
            consultar_repuesto_por_id: (IdRepuesto: number) => `${API_BASE_URL}/ver-repuesto/${IdRepuesto}`,
            actualizar_repuesto: `${API_BASE_URL}/actualizar-repuesto`
        }
    },
    configuraciones: {
        listar_profesionales_pertenecientes: `${API_BASE_URL}/ver-profesionales-pertenecientes`,
        consultar_credenciales_del_profesional: (DocumentoProfesional: string) => `${API_BASE_URL}/consultar-credenciales-del-profesional/${DocumentoProfesional}`,
        crear_credenciales_profesional_por_administrador: `${API_BASE_URL}/crear-credenciales-profesional`,
        actualizar_credenciales_profesional_por_administrador: `${API_BASE_URL}/actualizar-credenciales-profesional`
    }
};