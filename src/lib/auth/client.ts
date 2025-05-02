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

//   async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
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
//   async signUp(params: SignUpParams): Promise<{ error?: string }> {
//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);
//     console.log('Token de registro almacenado:', token);
//     return {};
//   }

//   async signInWithOAuth(params: SignInWithOAuthParams): Promise<{ error?: string }> {
//     return { error: 'Autenticación social no implementada' };
//   }

//   async signInWithPassword(params: SignInWithPasswordParams): Promise<{ credenciales?: string; nombre?: string; error?: string }> {
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


//   async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Restablecimiento de contraseña no implementado' };
//   }

//   async updatePassword(params: ResetPasswordParams): Promise<{ error?: string }> {
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
//   async signUp(params: SignUpParams): Promise<{ error?: string }> {
//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);
//     console.log('Token de registro almacenado:', token);
//     return {};
//   }

//   async signInWithOAuth(params: SignInWithOAuthParams): Promise<{ error?: string }> {
//     return { error: 'Autenticación social no implementada' };
//   }

//   async signInWithPassword(params: SignInWithPasswordParams): Promise<{ credenciales?: string; nombre?: string; error?: string }> {
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

//   async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Restablecimiento de contraseña no implementado' };
//   }

//   async updatePassword(params: ResetPasswordParams): Promise<{ error?: string }> {
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
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    console.log('Token de registro almacenado:', token);
    return {};
  }

  async signInWithOAuth(params: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Autenticación social no implementada' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ credenciales?: string; nombre?: string; documento?: string; error?: string }> {
    const { email, password } = params;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      NombreUsuario: email,
      ClaveUsuario: password
    });

    if (response.status !== 200) {
      return { error: 'Credenciales incorrectas' };
    }

    const { credenciales, nombre, documento } = response.data;

    localStorage.setItem('custom-auth-token', credenciales);
    localStorage.setItem('custom-auth-name', nombre); // Guardamos el nombre completo
    localStorage.setItem('custom-auth-documento', documento);

    return { credenciales, nombre, documento };
  }

  async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Restablecimiento de contraseña no implementado' };
  }

  async updatePassword(params: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Actualización de contraseña no implementada' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');
    const name = localStorage.getItem('custom-auth-name');
    const documento = localStorage.getItem('custom-auth-documento');

    if (!token || !name || !documento) {
      return { data: null };
    }

    const user: User = {
      id: 'USR-001',
      avatar: '/assets/avatar.png',
      fullName: name,
      email: '', // Puedes llenarlo si lo tuvieras en la respuesta del backend
      documento: documento,
    };

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('custom-auth-name');
    localStorage.removeItem('custom-auth-documento');
    console.log('Usuario desconectado. Token, nombre y documento eliminados.');
    return {};
  }
}

export const authClient = new AuthClient();
