import type { Page, Request, Route } from '@playwright/test';

/** Host ficticio configurado en `playwright.config.ts`; nunca se toca el backend real. */
export const API = 'http://api.e2e.test';
const WS = 'http://ws.e2e.test';

export const USUARIO_PRUEBA = {
  nombre: 'Usuario Pruebas',
  documento: '1000000001',
  correo: 'pruebas@tecniservicios.test',
  rol: 'Administrador',
};

type Manejador = (ruta: Route, peticion: Request, url: URL) => Promise<void> | void;

export interface ApiSimulada {
  /** Peticiones recibidas por la API simulada, en orden. */
  readonly peticiones: { metodo: string; ruta: string; params: URLSearchParams; cuerpo: unknown }[];
  /** Responde `ruta` (pathname exacto) con el manejador dado. */
  en: (ruta: string, manejador: Manejador) => void;
}

// axios usa withCredentials: el navegador no acepta '*' con credenciales.
const CORS = {
  'access-control-allow-origin': 'http://localhost:3101',
  'access-control-allow-credentials': 'true',
  'access-control-allow-headers': 'authorization, content-type',
  'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

export function json(ruta: Route, cuerpo: unknown, status = 200): Promise<void> {
  return ruta.fulfill({
    status,
    contentType: 'application/json',
    headers: CORS,
    body: JSON.stringify(cuerpo),
  });
}

/**
 * Intercepta toda la API. Lo que no tenga manejador responde `[]`, que es lo que
 * devuelven los listados sin paginar, para que el resto de la pantalla cargue.
 */
export async function simularApi(page: Page): Promise<ApiSimulada> {
  const manejadores = new Map<string, Manejador>();
  const peticiones: ApiSimulada['peticiones'] = [];

  // Socket.IO no tiene servidor en las pruebas: se corta sin reintentos ruidosos.
  await page.route(`${WS}/**`, (ruta) => ruta.abort());

  await page.route(`${API}/**`, async (ruta, peticion) => {
    const url = new URL(peticion.url());
    if (peticion.method() === 'OPTIONS') {
      await ruta.fulfill({
        status: 204,
        headers: CORS,
      });
      return;
    }
    let cuerpo: unknown = null;
    try {
      cuerpo = peticion.postDataJSON();
    } catch {
      cuerpo = peticion.postData();
    }
    peticiones.push({ metodo: peticion.method(), ruta: url.pathname, params: url.searchParams, cuerpo });
    const manejador = manejadores.get(url.pathname);
    if (manejador) {
      await manejador(ruta, peticion, url);
    } else {
      await json(ruta, []);
    }
  });

  return {
    peticiones,
    en: (ruta, manejador) => manejadores.set(ruta, manejador),
  };
}

/** Deja una sesión iniciada (lo mismo que guarda el formulario de login) y responde /perfil. */
export async function iniciarSesionSimulada(page: Page, api: ApiSimulada, rol = USUARIO_PRUEBA.rol): Promise<void> {
  api.en('/perfil', (ruta) => json(ruta, { ...USUARIO_PRUEBA, rol }));
  await page.addInitScript(
    ({ usuario, rolSesion }) => {
      localStorage.setItem('custom-auth-token-autenticacion', 'token-e2e');
      localStorage.setItem('custom-auth-name', usuario.nombre);
      localStorage.setItem('custom-auth-documento', usuario.documento);
      localStorage.setItem('custom-auth-correo', usuario.correo);
      localStorage.setItem('custom-auth-rol', rolSesion);
    },
    { usuario: USUARIO_PRUEBA, rolSesion: rol }
  );
  await page.context().addCookies([{ name: 'custom-auth-rol', value: rol, url: 'http://localhost:3101' }]);
}
