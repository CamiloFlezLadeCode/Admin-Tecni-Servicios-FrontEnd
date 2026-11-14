import { vi } from 'vitest';

import axiosInstance from '@/config/axiosConfig';

export type Metodo = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface PeticionRegistrada {
  metodo: Metodo;
  /** Ruta sin la URL base: `/ver-bodegas`. */
  ruta: string;
  /** URL sin la base pero con su query string (si la petición la arma a mano). */
  url: string;
  cuerpo?: unknown;
  params?: Record<string, unknown>;
  config?: Record<string, unknown>;
}

/** Valor a responder, una función que lo calcula o un error (se rechaza la promesa). */
export type Respuesta = unknown | ((peticion: PeticionRegistrada) => unknown);

type Rutas = Partial<Record<`${Uppercase<Metodo>} ${string}`, Respuesta>>;

const BASE = 'http://api.test';

export class ErrorApi extends Error {
  isAxiosError = true;
  response: { status: number; data: { error: string } };

  constructor(mensaje: string, status = 400) {
    super(`Request failed with status code ${status}`);
    this.response = { status, data: { error: mensaje } };
  }
}

/** Respuesta con un estado HTTP distinto de 200 (p. ej. `new ConEstado(204)`). */
export class ConEstado {
  constructor(
    public status: number,
    public data: unknown = ''
  ) {}
}

/**
 * Simula el backend sobre la instancia compartida de axios.
 *
 * - Las rutas se declaran como `'GET /ver-bodegas'` (sin URL base, sin query).
 *   Un sufijo `*` hace coincidir por prefijo: `'GET /ver-vehiculo/*'`.
 * - Sin ruta declarada: GET con `pagina` → página vacía; otro GET → `[]`;
 *   POST/PUT/DELETE → `{ mensaje: 'ok' }`.
 * - `peticiones` guarda todo lo que se llamó, en orden.
 */
export function simularApi(rutas: Rutas = {}) {
  const peticiones: PeticionRegistrada[] = [];

  const buscar = (metodo: Metodo, ruta: string): Respuesta | undefined => {
    const clave = `${metodo.toUpperCase()} ${ruta}` as keyof Rutas;
    if (clave in rutas) return rutas[clave];
    const prefijo = Object.keys(rutas).find((k) => {
      if (!k.endsWith('*')) return false;
      const [m, r] = k.split(' ');
      return m === metodo.toUpperCase() && ruta.startsWith(r.slice(0, -1));
    });
    return prefijo ? rutas[prefijo as keyof Rutas] : undefined;
  };

  const responder = (metodo: Metodo) =>
    vi.spyOn(axiosInstance, metodo).mockImplementation((async (url: string, a?: any, b?: any) => {
      const tieneCuerpo = metodo === 'post' || metodo === 'put' || metodo === 'patch';
      const config = (tieneCuerpo ? b : a) ?? {};
      const [ruta] = String(url).replace(BASE, '').split('?');
      const peticion: PeticionRegistrada = {
        metodo,
        ruta,
        url: String(url).replace(BASE, ''),
        cuerpo: tieneCuerpo ? a : undefined,
        params: config.params,
        config,
      };
      peticiones.push(peticion);

      let valor = buscar(metodo, ruta);
      if (typeof valor === 'function') valor = (valor as (p: PeticionRegistrada) => unknown)(peticion);
      if (valor instanceof Error) throw valor;
      if (valor === undefined) {
        if (metodo === 'get') {
          valor = config.params?.pagina ? { Datos: [], Total: 0, Pagina: 1, Limite: 10, TotalPaginas: 0 } : [];
        } else {
          valor = { mensaje: 'ok' };
        }
      }
      if (valor instanceof ConEstado) return { status: valor.status, data: valor.data, headers: {}, config };
      return { status: 200, data: valor, headers: {}, config };
    }) as never);

  const espias = {
    get: responder('get'),
    post: responder('post'),
    put: responder('put'),
    delete: responder('delete'),
    patch: responder('patch'),
  };

  return {
    peticiones,
    espias,
    /** Peticiones hechas a una ruta (y método opcional). */
    llamadasA(ruta: string, metodo?: Metodo) {
      return peticiones.filter((p) => p.ruta === ruta && (!metodo || p.metodo === metodo));
    },
    /** Cambia o agrega rutas sobre la marcha. */
    definir(nuevas: Rutas) {
      Object.assign(rutas, nuevas);
    },
  };
}

export function paginar<T>(Datos: T[], extras: Record<string, unknown> = {}) {
  return { Datos, Total: Datos.length, Pagina: 1, Limite: 10, TotalPaginas: 1, ...extras };
}
