import { beforeEach, describe, expect, it, vi } from 'vitest';

import axiosInstance from '@/config/axiosConfig';

/**
 * Prueba de contrato de TODA la capa de servicios.
 *
 * Descubre cada función exportada en `src/services/**` y fija en un snapshot:
 *  - la petición exacta que hace (método, URL, cuerpo y config: params, headers…),
 *  - lo que devuelve cuando el backend responde bien,
 *  - qué hace cuando el backend responde con `{ error }` y cuando falla la red.
 *
 * Si un refactor cambia una URL, un parámetro o un mensaje de error, esta prueba
 * falla y obliga a revisar el cambio (`pnpm test -u` solo si el cambio es intencional).
 */

type Funcion = (...args: unknown[]) => unknown;

const modulos = import.meta.glob<Record<string, unknown>>(['./**/*.ts', '!./**/*.test.ts'], { eager: true });

const PAGINACION = { pagina: 2, limite: 25, busqueda: 'texto' };

/** Argumentos de ejemplo para las funciones que reciben objetos; el resto recibe `7`. */
const ARGUMENTOS: Record<string, unknown[]> = {
  consultarPaginado: ['http://api.test/listado', PAGINACION, { Activo: true, Vacio: '', Nulo: null }],
  ListarBodegasPorTipo: [{ IdTipoBodega: 3 }],
  ListarEquipos: [{ IdCategoria: 4, IdTipoBodega: 5 }],
  ListarMunicipios: [{ Page: 1, Limit: 10, Search: 'cali' }],
  ListarProyectos: [{ DocumentoCliente: '900' }],
  equipos_pendientes_por_devolver: [{ IdProyecto: 3, DocumentoSubarrendatario: '800', DocumentoCliente: '900' }],
  ConsultarSubarrendatariosConRemisionesAsignadasClienteProyecto: [{ DocumentoCliente: '900', IdProyecto: 3 }],
  InformeClienteEquiposEnObra: [{ DocumentoCliente: '900', IdProyecto: 3 }],
  InformeInternoEmpresaEquiposEnObra: [{ DocumentoCliente: '900' }],
  VerEstadoDeCuentaCliente: ['900'],
  VerEstadoDeCuentaClientePaginado: ['900', PAGINACION, { Proyecto: 'Torre', Equipo: '' }],
  VerMovimientosGenerales: [{ FechaInicio: '2026-01-01', FechaFin: '2026-01-31' }],
  VerMovimientosGeneralesPaginado: [PAGINACION, { DocumentoCliente: '900', IdProyecto: '' }],
  VerDisponibilidadDeRepuesto: [{ IdTipoBodega: 1, IdRepuesto: 2 }],
  VerEquiposDelCliente: [{ IdTipoBodega: 1, DocumentoPropietario: '900' }],
  VerRepuestosDisponibles: [{ IdTipoBodega: 1 }],
  VerDisponibilidadDeEquipos: [{ IdCategoria: 1, DocumentoSubarrendatario: '800' }],
  ConsultarRemisionesConPaginacion: [{ page: 1, limit: 10 }],
  VerActividadRecienteMovimientos: [5],
  Login: [{ NombreUsuario: 'ana', ClaveUsuario: 'secreta' }],
  GuardarAvatar: [{ formulario: 'avatar' }, 'mi foto.png'],
  VerificarExistenciaUsuario: ['1001'],
  verificarClienteExistenteService: ['1001'],
  ConsultarCredencialesDelProfesional: ['1001'],
};

const RESPUESTA_OK = { encontrado: true, Datos: [{ Id: 1 }], Total: 1, mensaje: 'ok' };

function argumentosPara(nombre: string): unknown[] {
  if (nombre in ARGUMENTOS) return ARGUMENTOS[nombre];
  if (nombre.endsWith('Paginado')) return [PAGINACION];
  return [7];
}

function errorBackend() {
  return Object.assign(new Error('Request failed with status code 400'), {
    isAxiosError: true,
    response: { status: 400, data: { error: 'Mensaje del backend' } },
  });
}

function errorDeRed() {
  return Object.assign(new Error('Network Error'), { isAxiosError: true });
}

const METODOS = ['get', 'post', 'put', 'delete', 'patch'] as const;

function espiarAxios(implementacion: () => Promise<unknown>) {
  return Object.fromEntries(
    METODOS.map((metodo) => [metodo, vi.spyOn(axiosInstance, metodo).mockImplementation(implementacion as never)])
  ) as Record<(typeof METODOS)[number], ReturnType<typeof vi.spyOn>>;
}

async function resultado(promesa: () => unknown) {
  try {
    const valor = await promesa();
    return { tipo: 'resuelve', valor: valor instanceof Blob ? 'Blob' : valor };
  } catch (error) {
    const err = error as { message?: string; response?: unknown };
    return { tipo: 'lanza', mensaje: err?.message, conservaRespuestaAxios: Boolean(err?.response) };
  }
}

function serializarLlamadas(espias: ReturnType<typeof espiarAxios>) {
  return METODOS.flatMap((metodo) => espias[metodo].mock.calls.map((args: unknown[]) => [metodo.toUpperCase(), ...args]));
}

const casos = Object.entries(modulos)
  .flatMap(([ruta, modulo]) =>
    Object.entries(modulo)
      .filter(([, valor]) => typeof valor === 'function')
      .map(([nombre, fn]) => ({ id: `${ruta.replace('./', '')} › ${nombre}`, nombre, fn: fn as Funcion }))
  )
  .sort((a, b) => a.id.localeCompare(b.id));

beforeEach(() => {
  // Login genera una llave de sesión con la hora y Math.random: se fijan para que el snapshot sea estable.
  vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
  vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:avatar');
});

describe('contrato de la capa de servicios', () => {
  it('descubre todos los servicios', () => {
    expect(casos.length).toBeGreaterThan(90);
  });

  for (const { id, nombre, fn } of casos) it(id, async () => {
    const args = argumentosPara(nombre);

    const exito = espiarAxios(async () => ({ status: 200, data: RESPUESTA_OK }));
    const conExito = await resultado(() => fn(...args));
    const peticiones = serializarLlamadas(exito);

    espiarAxios(async () => Promise.reject(errorBackend()));
    const conErrorDelBackend = await resultado(() => fn(...args));

    espiarAxios(async () => Promise.reject(errorDeRed()));
    const conErrorDeRed = await resultado(() => fn(...args));

    expect({ peticiones, conExito, conErrorDelBackend, conErrorDeRed }).toMatchSnapshot();
  });
});

describe('reglas puntuales de servicios', () => {
  it('Login responde undefined si el backend no devuelve 200', async () => {
    const { Login } = await import('@/services/login/LoginService');
    vi.spyOn(axiosInstance, 'post').mockResolvedValue({ status: 204, data: {} });
    await expect(Login({ NombreUsuario: 'a', ClaveUsuario: 'b' })).resolves.toBeUndefined();
  });

  it('Login cifra las credenciales: el cuerpo no contiene la clave en claro', async () => {
    const { Login } = await import('@/services/login/LoginService');
    const post = vi.spyOn(axiosInstance, 'post').mockResolvedValue({ status: 200, data: { rol: 'Administrador' } });
    await Login({ NombreUsuario: 'ana', ClaveUsuario: 'secreta' });
    const cuerpo = JSON.stringify(post.mock.calls[0][1]);
    expect(cuerpo).not.toContain('secreta');
    expect(cuerpo).not.toContain('ana');
  });

  it('VerificarExistenciaUsuario devuelve false si el documento no existe', async () => {
    const { VerificarExistenciaUsuario } = await import(
      '@/services/gestionycontrol/usuariosgenerales/VerificarExistenciaUsuarioGeneralService'
    );
    vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: { encontrado: false } });
    await expect(VerificarExistenciaUsuario('1')).resolves.toBe(false);
    vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: {} });
    await expect(VerificarExistenciaUsuario('1')).resolves.toEqual({ encontrado: false, cliente: null });
  });

  it('verificarClienteExistenteService devuelve false/objeto vacío según la respuesta', async () => {
    const { verificarClienteExistenteService } = await import('@/services/gestionycontrol/clientes/CrearClienteService');
    vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: { encontrado: false } });
    await expect(verificarClienteExistenteService('1')).resolves.toBe(false);
    vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: {} });
    await expect(verificarClienteExistenteService('1')).resolves.toEqual({ encontrado: false, cliente: null });
  });

  it('los informes de estado de cuenta exigen DocumentoCliente sin llamar al backend', async () => {
    const { InformeClienteEquiposEnObra } = await import(
      '@/services/comercial/estado_de_cuenta/InformeClienteEquiposEnObraService'
    );
    const { InformeInternoEmpresaEquiposEnObra } = await import(
      '@/services/comercial/estado_de_cuenta/InformeInternoEmpresaEquiposEnObraService'
    );
    const get = vi.spyOn(axiosInstance, 'get');
    await expect(InformeClienteEquiposEnObra({ DocumentoCliente: '' })).rejects.toThrow('DocumentoCliente es obligatorio');
    await expect(InformeInternoEmpresaEquiposEnObra({ DocumentoCliente: '' })).rejects.toThrow(
      'DocumentoCliente es obligatorio'
    );
    expect(get).not.toHaveBeenCalled();
  });

  it('consultarPaginado omite la búsqueda vacía y usa el mensaje genérico si no hay ninguno', async () => {
    const { consultarPaginado } = await import('@/services/paginacion');
    const get = vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: { Datos: [] } });
    await consultarPaginado('http://api.test/x', { pagina: 1, limite: 10 });
    expect(get).toHaveBeenCalledWith('http://api.test/x', { params: { pagina: 1, limite: 10 } });
    vi.spyOn(axiosInstance, 'get').mockRejectedValue({});
    await expect(consultarPaginado('http://api.test/x', { pagina: 1, limite: 10 })).rejects.toThrow('Error desconocido');
  });

  it('los servicios que distinguen errores de axios envuelven los errores desconocidos', async () => {
    const { CrearRemision } = await import('@/services/comercial/remisiones/CrearRemisionService');
    const { EliminarVehiculo } = await import('@/services/gestionycontrol/vehiculos/EliminarVehiculoService');
    vi.spyOn(axiosInstance, 'post').mockRejectedValue(new Error('otro'));
    vi.spyOn(axiosInstance, 'delete').mockRejectedValue(new Error('otro'));
    await expect(CrearRemision({})).rejects.toThrow('Error desconocido al crear la remisión.');
    await expect(EliminarVehiculo(1)).rejects.toThrow('Error desconocido al eliminar el vehículo.');
  });

  it('los mensajes de error caen en el texto por defecto cuando no hay detalle', async () => {
    const { ActualizarDevolucion } = await import('@/services/comercial/devoluciones/ActualizarDevolucionService');
    const { ObtenerPDFDevolucion } = await import('@/services/comercial/devoluciones/ObtenerPDFDevolucionService');
    const { VerResumenDashboard } = await import('@/services/dashboard/VerResumenDashboardService');
    const { VerMovimientosGenerales } = await import(
      '@/services/comercial/movimientos_generales/VerMovimientosGeneralesService'
    );
    vi.spyOn(axiosInstance, 'put').mockRejectedValue({});
    vi.spyOn(axiosInstance, 'get').mockRejectedValue({});
    await expect(ActualizarDevolucion({})).rejects.toThrow('Error desconocido');
    await expect(ObtenerPDFDevolucion(1)).rejects.toThrow('Error desconocido al generar el PDF de la devolución');
    await expect(VerResumenDashboard()).rejects.toThrow('Error desconocido');
    await expect(VerMovimientosGenerales()).rejects.toThrow('Error al consultar los movimientos generales');
    vi.spyOn(axiosInstance, 'get').mockRejectedValue({ response: { data: { message: 'detalle' } } });
    await expect(ObtenerPDFDevolucion(1)).rejects.toThrow('detalle');
  });

  it('VerActividadRecienteMovimientos usa 10 como límite por defecto', async () => {
    const { VerActividadRecienteMovimientos } = await import(
      '@/services/comercial/remisiones/ConsultarRemisionesService'
    );
    const get = vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: {} });
    await VerActividadRecienteMovimientos();
    expect(get.mock.calls[0][1]).toEqual({ params: { Limite: 10 } });
  });
});
