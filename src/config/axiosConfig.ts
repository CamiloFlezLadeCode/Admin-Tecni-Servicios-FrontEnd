import axios from 'axios';

type Entorno = 'Produccion' | 'Desarrollo';

const ENTORNO = (process.env.NEXT_PUBLIC_ENTORNO as Entorno) ?? 'Desarrollo';

const URLS: Record<Entorno, string | undefined> = {
  Produccion: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
  Desarrollo: process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT,
};

const API_BASE_URL = URLS[ENTORNO] ?? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  baseURL: API_BASE_URL,
  withCredentials: true, // Si usas cookies o sesiones
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token JWT a cada petición (el backend exige Authorization: Bearer en todo excepto /login y /health)
axiosInstance.interceptors.request.use((requestConfig) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('custom-auth-token-autenticacion');
      if (token && !requestConfig.headers.Authorization) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // localStorage no disponible
    }
  }
  return requestConfig;
});

// ✅ Interceptores para manejar errores, tokens, etc.
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // console.error('Error en respuesta:', error.response ?? error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;