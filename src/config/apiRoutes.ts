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
        actualizarvehiculo: `${API_BASE_URL}/actualizar-vehiculo`
    },
    generales: {
        listarsubarrendatarios: `${API_BASE_URL}/listar-subarrendatarios`,
        listarbodegueros: `${API_BASE_URL}/listar-bodegueros`,
        listardespachadores: `${API_BASE_URL}/listar-despachadores`,
        listartransportadores: `${API_BASE_URL}/listar-transportadores`,
        listarvehiculos: `${API_BASE_URL}/listar-vehiculos`
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
    }
};