import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  withCredentials: true, // Si usas cookies o sesiones
  headers: {
    'Content-Type': 'application/json',
  },
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