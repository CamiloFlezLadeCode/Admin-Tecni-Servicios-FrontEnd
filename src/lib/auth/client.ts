// 'use client';

// import type { User } from '@/types/user';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// } satisfies User;

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface SignInWithOAuthParams {
//   provider: 'google' | 'discord';
// }

// export interface SignInWithPasswordParams {
//   email: string;
//   password: string;
// }

// export interface ResetPasswordParams {
//   email: string;
// }

// class AuthClient {
//   async signUp(_: SignUpParams): Promise<{ error?: string }> {
//     // Make API request

//     // We do not handle the API, so we'll just generate a token and store it in localStorage.
//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);

//     return {};
//   }

//   async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
//     return { error: 'Social authentication not implemented' };
//   }

//   async signInWithPassword(_params: SignInWithPasswordParams): Promise<{ error?: string }> {
//     const { email, password } = params;

//     // Make API request

//     // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
//     if (email !== 'Camilo' || password !== 'FlezLade') {
//       return { error: 'Credenciales incorrectas' };
//     }

//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);

//     return {};
//   }

//   async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Password reset not implemented' };
//   }

//   async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Update reset not implemented' };
//   }

//   async getUser(): Promise<{ data?: User | null; error?: string }> {
//     // Make API request

//     // We do not handle the API, so just check if we have a token in localStorage.
//     const token = localStorage.getItem('custom-auth-token');

//     if (!token) {
//       return { data: null };
//     }

//     return { data: user };
//   }

//   async signOut(): Promise<{ error?: string }> {
//     localStorage.removeItem('custom-auth-token');

//     return {};
//   }
// }

// export const authClient = new AuthClient();



// NUEVOOOOO BUENOOO
// 'use client';

// import type { User } from '@/types/user';
// import axios from 'axios';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// const user: User = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// };

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface SignInWithOAuthParams {
//   provider: 'google' | 'discord';
// }

// export interface SignInWithPasswordParams {
//   email: string;
//   password: string;
// }

// export interface ResetPasswordParams {
//   email: string;
// }

// class AuthClient {
//   async signUp(_params: SignUpParams): Promise<{ error?: string }> {
//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);
//     console.log('Token de registro almacenado:', token);
//     return {};
//   }

//   async signInWithOAuth(_params: SignInWithOAuthParams): Promise<{ error?: string }> {
//     return { error: 'Autenticación social no implementada' };
//   }

//   async signInWithPassword(_params: SignInWithPasswordParams): Promise<{ credenciales?: string; nombre?: string; error?: string }> {
//     const { email, password } = params;

//     // Llama a tu API de autenticación
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { NombreUsuario: email, ClaveUsuario: password });
//     console.log( "HOLA MORR");

//     if (response.status !== 200) {
//       return { error: 'Credenciales incorrectas' };
//     }

//     const { credenciales } = response.data;
//     localStorage.setItem('custom-auth-token', credenciales);
//     return { credenciales };
//   }


//   async resetPassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Restablecimiento de contraseña no implementado' };
//   }

//   async updatePassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Actualización de contraseña no implementada' };
//   }

//   async getUser(): Promise<{ data?: User | null; error?: string }> {
//     const token = localStorage.getItem('custom-auth-token');

//     if (!token) {
//       return { data: null };
//     }


//     return { data: user }; // Devuelve el usuario simulado
//   }

//   async signOut(): Promise<{ error?: string }> {
//     localStorage.removeItem('custom-auth-token');
//     console.log('Usuario desconectado. Token eliminado.');
//     return {};
//   }
// }

// export const authClient = new AuthClient();





// otro
// 'use client';

// import type { User } from '@/types/user';
// import axios from 'axios';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// const user: User = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// };

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface SignInWithOAuthParams {
//   provider: 'google' | 'discord';
// }

// export interface SignInWithPasswordParams {
//   email: string;
//   password: string;
// }

// export interface ResetPasswordParams {
//   email: string;
// }

// class AuthClient {
//   async signUp(_params: SignUpParams): Promise<{ error?: string }> {
//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);
//     console.log('Token de registro almacenado:', token);
//     return {};
//   }

//   async signInWithOAuth(_params: SignInWithOAuthParams): Promise<{ error?: string }> {
//     return { error: 'Autenticación social no implementada' };
//   }

//   async signInWithPassword(_params: SignInWithPasswordParams): Promise<{ credenciales?: string; nombre?: string; error?: string }> {
//     const { email, password } = params;

//     // Llama a tu API de autenticación
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { NombreUsuario: email, ClaveUsuario: password });

//     if (response.status !== 200) {
//       return { error: 'Credenciales incorrectas' };
//     }

//     const { credenciales, nombre } = response.data; // Asegúrate de que tu API devuelva el nombre
//     localStorage.setItem('custom-auth-token', credenciales);
//     return { credenciales, nombre }; // Devuelve también el nombre
//   }

//   async resetPassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Restablecimiento de contraseña no implementado' };
//   }

//   async updatePassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Actualización de contraseña no implementada' };
//   }

//   async getUser(): Promise<{ data?: User | null; error?: string }> {
//     const token = localStorage.getItem('custom-auth-token');

//     if (!token) {
//       return { data: null };
//     }

//     return { data: user }; // Devuelve el usuario simulado
//   }

//   async signOut(): Promise<{ error?: string }> {
//     localStorage.removeItem('custom-auth-token');
//     console.log('Usuario desconectado. Token eliminado.');
//     return {};
//   }
// }

// export const authClient = new AuthClient();










'use client';

import type { User } from '@/types/user';
import axios from 'axios';

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
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

      // Esta ruta debe estar protegida con el middleware verificarToken
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/perfil`, {
      //   withCredentials: true, // 👈 Enviamos la cookie JWT al backend
      // });

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/perfil`, {
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
      // console.log('Error en getUser:', error);
      console.log(error);
      return { data: null, error: 'No autenticado o sesión expirada' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('custom-auth-name');
      localStorage.removeItem('custom-auth-documento');
      localStorage.removeItem('custom-auth-correo');
      localStorage.removeItem('custom-auth-rol');

      //Permanece token aún cerrando la pestaña ó navegador
      localStorage.removeItem('custom-auth-token-autenticacion');

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
