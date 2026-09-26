'use client';

import type { User } from '@/types/user';
import axiosInstance from '@/config/axiosConfig';
import { apiRoutes } from '@/config/apiRoutes';


function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_params: SignUpParams): Promise<{ error?: string }> {
    // const token = generateToken();
    // localStorage.setItem('custom-auth-token', token);
    // console.log('Token de registro almacenado:', token);
    return {};
  }

  async signInWithOAuth(_params: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Autenticación social no implementada' };
  }

  async signInWithPassword(_params: SignInWithPasswordParams): Promise<{ nombre?: string; documento?: string; error?: string; correo?: string; token?: string; rol?: string; }> {
    const { email, password } = _params;

    try {
      const response = await axiosInstance.post(
        apiRoutes.login.iniciar_sesion,
        {
          NombreUsuario: email,
          ClaveUsuario: password,
        },
        {
          withCredentials: true, // 👈 Esto permite que la cookie se guarde automáticamente
        }
      );

      console.log('Cookies en document.cookie:', document.cookie);
      if (response.status !== 200) {
        return { error: 'Credenciales incorrectas' };
      };

      const { nombre, documento, correo, token, rol } = response.data;

      // Podés guardar esto en memoria/localStorage si lo necesitás para mostrar en la UI
      localStorage.setItem('custom-auth-name', nombre);
      localStorage.setItem('custom-auth-documento', documento);
      localStorage.setItem('custom-auth-correo', correo);
      localStorage.setItem('custom-auth-rol', rol);
      // localStorage.setItem('custom-auth-token-autenticacion', token);

      //Permanece token aún cerrando la pestaña ó navegador
      localStorage.setItem('custom-auth-token-autenticacion', token);

      document.cookie = `custom-auth-rol=${rol}; path=/`;

      //Token se retirar cuando se cierra la pestaña ó navegador
      // sessionStorage.setItem('custom-auth-token-autenticacion', token);


      return { nombre, documento, correo, token, rol };

    } catch (error) {
      console.error('Error en signInWithPassword: ', error);
      return { error: 'Error al iniciar sesión' };
    }
  }

  async resetPassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Restablecimiento de contraseña no implementado' };
  }

  async updatePassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Actualización de contraseña no implementada' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {

      const TokenAutorizado = localStorage.getItem('custom-auth-token-autenticacion');
      // const TokenAutorizado = sessionStorage.getItem('custom-auth-token-autenticacion');

      // Sin token no hay sesión: no se consulta /perfil (respondería 401 con "Bearer null").
      if (!TokenAutorizado) {
        return { data: null };
      }

      // Esta ruta debe estar protegida con el middleware verificarToken
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/perfil`, {
      //   withCredentials: true, // 👈 Enviamos la cookie JWT al backend
      // });

      const response = await axiosInstance.get(apiRoutes.login.perfil, {
        headers: {
          Authorization: `Bearer ${TokenAutorizado}`, // 👈 Aquí lo envías de forma segura
        },
      });

      const { nombre, correo, documento, rol } = response.data;

      const user: User = {
        id: 'USR-001',
        avatar: '/assets/avatar.png',
        fullName: nombre,
        email: correo,
        documento: documento,
        rol: rol
      };

      return { data: user };
    } catch (error) {
      // 401/403 = token vencido o inválido: es un caso esperado, no se registra.
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status !== 401 && status !== 403) {
        console.error('Error en getUser:', error);
      }
      return { data: null, error: 'No autenticado o sesión expirada' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      try {
        await axiosInstance.post(apiRoutes.login.cerrar_sesion, {}, { withCredentials: true });
      } catch (logoutError) {
        // Con token vencido el backend responde 401/403; igual se limpia la sesión local
        console.warn('No se pudo notificar el cierre de sesión al servidor:', logoutError);
      }
      localStorage.removeItem('custom-auth-name');
      localStorage.removeItem('custom-auth-documento');
      localStorage.removeItem('custom-auth-correo');
      localStorage.removeItem('custom-auth-rol');

      //Permanece token aún cerrando la pestaña ó navegador
      localStorage.removeItem('custom-auth-token-autenticacion');

      document.cookie = "custom-auth-rol=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      //Token se retirar cuando se cierra la pestaña ó navegador
      // sessionStorage.removeItem('custom-auth-token-autenticacion');
      return {};
    } catch (error) {
      console.error('Error en signOut:', error);
      return { error: 'Error al cerrar sesión' };
    }
  }
}

export const authClient = new AuthClient();
