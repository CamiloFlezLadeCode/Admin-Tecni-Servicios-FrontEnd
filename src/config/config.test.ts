import { afterEach, describe, expect, it, vi } from 'vitest';

import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

async function cargarConEntorno(variables: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [clave, valor] of Object.entries(variables)) vi.stubEnv(clave, valor as string);
  const [{ default: instancia }, { apiRoutes: rutas }, { config }] = await Promise.all([
    import('@/config/axiosConfig'),
    import('@/config/apiRoutes'),
    import('@/config'),
  ]);
  return { instancia, rutas, config };
}

/** Adaptador falso: devuelve la config final de la petición, sin red. */
const adaptadorEco = async (config: any) => ({ data: config, status: 200, statusText: 'OK', headers: {}, config });

describe('axiosConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('apunta a la URL de desarrollo y envía credenciales', () => {
    expect(axiosInstance.defaults.baseURL).toBe('http://api.test');
    expect(axiosInstance.defaults.withCredentials).toBe(true);
    expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('adjunta el token JWT de localStorage como Authorization: Bearer', async () => {
    localStorage.setItem('custom-auth-token-autenticacion', 'jwt-123');
    const { data } = await axiosInstance.get('/perfil', { adapter: adaptadorEco });
    expect(data.headers.Authorization).toBe('Bearer jwt-123');
  });

  it('no pisa un Authorization explícito ni lo agrega sin token', async () => {
    const explicito = await axiosInstance.get('/x', { adapter: adaptadorEco, headers: { Authorization: 'Bearer otro' } });
    expect(explicito.data.headers.Authorization).toBe('Bearer otro');

    const sinToken = await axiosInstance.get('/x', { adapter: adaptadorEco });
    expect(sinToken.data.headers.Authorization).toBeUndefined();
  });

  it('tolera que localStorage no esté disponible', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const { data } = await axiosInstance.get('/x', { adapter: adaptadorEco });
    expect(data.headers.Authorization).toBeUndefined();
  });

  it('propaga los errores de respuesta sin transformarlos', async () => {
    const error = Object.assign(new Error('falló'), { response: { status: 500 } });
    await expect(
      axiosInstance.get('/x', {
        adapter: async () => {
          throw error;
        },
      })
    ).rejects.toBe(error);
  });

  it('usa las URL de producción cuando el entorno es Produccion', async () => {
    const { instancia, rutas, config } = await cargarConEntorno({
      NEXT_PUBLIC_ENTORNO: 'Produccion',
      NEXT_PUBLIC_API_URL_PRODUCTION: 'https://api.prod',
      NEXT_PUBLIC_LOG_LEVEL_PRODUCTION: 'ERROR',
    });
    expect(instancia.defaults.baseURL).toBe('https://api.prod');
    expect(rutas.login.iniciar_sesion).toBe('https://api.prod/login');
    expect(config.logLevel).toBe('ERROR');
  });

  it('cae en las variables de desarrollo si falta la del entorno elegido', async () => {
    const { instancia, rutas, config } = await cargarConEntorno({
      NEXT_PUBLIC_ENTORNO: 'Produccion',
      NEXT_PUBLIC_API_URL_PRODUCTION: undefined,
      NEXT_PUBLIC_LOG_LEVEL_PRODUCTION: undefined,
    });
    expect(instancia.defaults.baseURL).toBe('http://api.test');
    expect(rutas.login.iniciar_sesion).toBe('http://api.test/login');
    expect(config.logLevel).toBe('ALL');
  });

  it('usa Desarrollo cuando no se define el entorno', async () => {
    const { instancia } = await cargarConEntorno({ NEXT_PUBLIC_ENTORNO: undefined });
    expect(instancia.defaults.baseURL).toBe('http://api.test');
  });
});

describe('apiRoutes', () => {
  it('construye las rutas con parámetros', () => {
    expect(apiRoutes.vehiculos.consultarvehiculoporid(5)).toBe('http://api.test/ver-vehiculo/5');
    expect(apiRoutes.usuariosgenerales.verificarexistenciausuario('9')).toBe('http://api.test/buscarclientepordocumento/9');
    expect(apiRoutes.comercial.remisiones.ver_pdf_remision(3)).toBe('http://api.test/obtener-pdf-remision/3');
  });

  it('todas las rutas estáticas parten de la URL base', () => {
    const recorrer = (nodo: unknown): string[] =>
      typeof nodo === 'string'
        ? [nodo]
        : typeof nodo === 'function'
          ? [String((nodo as (a: string) => string)('X'))]
          : Object.values(nodo as object).flatMap(recorrer);
    const rutas = recorrer(apiRoutes);
    expect(rutas.length).toBeGreaterThan(50);
    for (const ruta of rutas) expect(ruta.startsWith('http://api.test/')).toBe(true);
  });
});
