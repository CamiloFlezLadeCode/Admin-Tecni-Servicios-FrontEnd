import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';

// // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// export const Login = async (datos: { NombreUsuario: string; ClaveUsuario: string }) => {
//   try {
//     // const response = await axios.post(`${apiUrl}/login`, datos, {
//     //   withCredentials: true,  // <--- ESTA LÍNEA ES CLAVE
//     // });
//     const response = await axiosInstance.post(apiRoutes.login.iniciar_sesion, datos, {
//       withCredentials: true,  // <--- ESTA LÍNEA ES CLAVE
//     });

//     if (response.status === 200) {
//       const { credenciales, rol, nombre, documento, correo, token, accesohabilitado } = response.data;
//       return { rol, nombre, documento, correo, token, accesohabilitado };
//     }
//   } catch (error) {
//     console.error('Error al consultar las credenciales => ', error);
//     throw new Error('No se pudo iniciar sesión. Intenta nuevamente.');
//   }
// };


// FRONTEND
export const Login = async (datos: { NombreUsuario: string; ClaveUsuario: string }) => {
  try {
    // 1. Generar clave de sesión
    const sessionKey = generateSessionKey();

    // 2. Cifrar credenciales
    const encryptedData = await encryptCredentials(datos, sessionKey);
    console.log(datos);
    console.log(encryptedData);

    // 3. Enviar datos cifrados
    const response = await axiosInstance.post(
      apiRoutes.login.iniciar_sesion,
      {
        data: encryptedData,
        key: sessionKey // En un caso real, esto se intercambia via Diffie-Hellman
      },
      {
        withCredentials: true,
      },

    );

    if (response.status === 200) {
      const { rol, nombre, documento, correo, token, accesohabilitado } = response.data;
      return { rol, nombre, documento, correo, token, accesohabilitado };
    }
  } catch (error) {
    console.error('Error en login => ', error);
    throw new Error('No se pudo iniciar sesión. Intenta nuevamente.');
  }
};

const generateSessionKey = (): string => {
  return btoa(Date.now().toString() + Math.random().toString(36)).substring(0, 16);
};

const encryptCredentials = async (datos: any, key: string): Promise<string> => {
  const text = JSON.stringify(datos);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};
