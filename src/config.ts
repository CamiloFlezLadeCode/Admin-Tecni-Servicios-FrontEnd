import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

type Entorno = 'Produccion' | 'Desarrollo';

const ENTORNO = (process.env.NEXT_PUBLIC_ENTORNO as Entorno) ?? 'Desarrollo';

const NIVEL_LOG: Record<Entorno, string | undefined> = {
  Produccion: process.env.NEXT_PUBLIC_LOG_LEVEL_PRODUCTION,
  Desarrollo: process.env.NEXT_PUBLIC_LOG_LEVEL_DEVELOPMENT,
};

const LOG_LEVEL = NIVEL_LOG[ENTORNO] ?? process.env.NEXT_PUBLIC_LOG_LEVEL_DEVELOPMENT;

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
  logLevel: keyof typeof LogLevel;
}

// export const config: Config = {
//   site: { name: 'Devias Kit', description: '', themeColor: '#090a0b', url: getSiteURL() },
//   logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
// };

export const config: Config = {
  site: { name: 'TecniServicios', description: '', themeColor: '#090a0b', url: getSiteURL() },
  logLevel: (LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};


// logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL
// Controla qué tanto logueo se permite según el entorno:

// LogLevel.NONE: No muestra nada.
// LogLevel.ERROR: Solo errores.
// LogLevel.WARN: Errores + advertencias.
// LogLevel.ALL: Todo (útil en desarrollo).