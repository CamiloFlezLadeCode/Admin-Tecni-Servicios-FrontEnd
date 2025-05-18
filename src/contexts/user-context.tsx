// 'use client';

// import * as React from 'react';

// import type { User } from '@/types/user';
// import { authClient } from '@/lib/auth/client';
// import { logger } from '@/lib/default-logger';

// export interface UserContextValue {
//   user: User | null;
//   error: string | null;
//   isLoading: boolean;
//   checkSession?: () => Promise<void>;
// }

// export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

// export interface UserProviderProps {
//   children: React.ReactNode;
// }

// export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
//   const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
//     user: null,
//     error: null,
//     isLoading: true,
//   });

//   const checkSession = React.useCallback(async (): Promise<void> => {
//     try {
//       const { data, error } = await authClient.getUser();

//       if (error) {
//         logger.error(error);
//         setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
//         return;
//       }

//       setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
//     } catch (err) {
//       logger.error(err);
//       setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
//     }
//   }, []);

//   React.useEffect(() => {
//     checkSession().catch((err: unknown) => {
//       logger.error(err);
//       // noop
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
//   }, []);

//   return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
// }

// export const UserConsumer = UserContext.Consumer;










// NUEVOOO BUENOOOO
// 'use client';

// import * as React from 'react';
// import type { User } from '@/types/user';
// import { authClient } from '@/lib/auth/client';
// import { logger } from '@/lib/default-logger';

// export interface UserContextValue {
//   user: User | null;
//   error: string | null;
//   isLoading: boolean;
//   checkSession?: () => Promise<void>;
// }

// export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

// export interface UserProviderProps {
//   children: React.ReactNode;
// }

// export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
//   const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
//     user: null,
//     error: null,
//     isLoading: true,
//   });

//   const checkSession = React.useCallback(async (): Promise<void> => {
//     try {
//       const { data, error } = await authClient.getUser();

//       if (error) {
//         logger.error(error);
//         setState({ user: null, error: 'Error al obtener el usuario', isLoading: false });
//         return;
//       }

//       setState({ user: data ?? null, error: null, isLoading: false });
//     } catch (err) {
//       logger.error(err);
//       setState({ user: null, error: 'Error inesperado', isLoading: false });
//     }
//   }, []);

//   React.useEffect(() => {
//     checkSession().catch((err: unknown) => {
//       logger.error(err);
//     });
//   }, [checkSession]);

//   return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
// }

// export const UserConsumer = UserContext.Consumer;


// otrooo
'use client';

import * as React from 'react';
import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  // const checkSession = React.useCallback(async (): Promise<void> => {
  //   try {
  //     const { data, error } = await authClient.getUser();

  //     if (error) {
  //       logger.error(error);
  //       setState({ user: null, error: 'Error al obtener el usuario', isLoading: false });
  //       return;
  //     }

  //     setState({ user: data ?? null, error: null, isLoading: false });
  //   } catch (err) {
  //     logger.error(err);
  //     setState({ user: null, error: 'Error inesperado', isLoading: false });
  //   }
  // }, []);

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await authClient.getUser();

      if (error || !data) {
        // ⚠️ Importante: NO marques error si simplemente no hay sesión
        setState({ user: null, error: null, isLoading: false });
        return;
      }

      setState({ user: data, error: null, isLoading: false });
    } catch (err) {
      logger.error(err);
      // ⚠️ De nuevo, error inesperado del servidor va a error, pero permití render
      setState({ user: null, error: 'Error inesperado', isLoading: false });
    }
  }, []);


  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
    });
  }, [checkSession]);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
