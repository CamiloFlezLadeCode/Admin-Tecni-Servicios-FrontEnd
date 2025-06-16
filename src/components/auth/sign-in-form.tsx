// 'use client';

// import * as React from 'react';
// // import RouterLink from 'next/link';
// import { useRouter } from 'next/navigation';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Alert from '@mui/material/Alert';
// import Button from '@mui/material/Button';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import InputLabel from '@mui/material/InputLabel';
// // import Link from '@mui/material/Link';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
// import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
// import { Controller, useForm } from 'react-hook-form';
// import { z as zod } from 'zod';

// // import { paths } from '@/paths';
// import { authClient } from '@/lib/auth/client';
// import { useUser } from '@/hooks/use-user';
// import { Login } from '@/services/login/LoginService';

// const schema = zod.object({
//   email: zod.string().min(1, { message: 'Email is required' }).email(),
//   password: zod.string().min(1, { message: 'Password is required' }),
// });

// type Values = zod.infer<typeof schema>;

// const defaultValues = { email: 'admin@tecniservicios.net', password: 'Admin1' } satisfies Values;

// export function SignInForm(): React.JSX.Element {
//   const router = useRouter();

//   const { checkSession } = useUser();

//   const [showPassword, setShowPassword] = React.useState<boolean>();

//   const [isPending, setIsPending] = React.useState<boolean>(false);

//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

//   const onSubmit = React.useCallback(
//     async (values: Values): Promise<void> => {
//       setIsPending(true);

//       const { error } = await authClient.signInWithPassword(values);

//       if (error) {
//         setError('root', { type: 'server', message: error });
//         setIsPending(false);
//         return;
//       }

//       // Refresh the auth state
//       await checkSession?.();

//       // UserProvider, for this case, will not refresh the router
//       // After refresh, GuestGuard will handle the redirect
//       router.refresh();
//     },
//     [checkSession, router, setError]
//   );

//   const Credenciales = {
//     NombreUsuario:'',
//     ClaveUsuario: ''
//   }

//   return (
//     <Stack spacing={4}>
//       <Stack spacing={1}>
//         <Typography variant="h4">Iniciar sesión</Typography>
//         {/* <Typography color="text.secondary" variant="body2">
//           Don&apos;t have an account?{' '}
//           <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
//             Sign up
//           </Link>
//         </Typography> */}
//       </Stack>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Stack spacing={2}>
//           <Controller
//             control={control}
//             name="email"
//             render={({ field }) => (
//               <FormControl error={Boolean(errors.email)}>
//                 <InputLabel>Usuario</InputLabel>
//                 <OutlinedInput {...field} label="Usuario" type="email" />
//                 {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
//               </FormControl>
//             )}
//           />
//           <Controller
//             control={control}
//             name="password"
//             render={({ field }) => (
//               <FormControl error={Boolean(errors.password)}>
//                 <InputLabel>Contraseña</InputLabel>
//                 <OutlinedInput
//                   {...field}
//                   endAdornment={
//                     showPassword ? (
//                       <EyeIcon
//                         cursor="pointer"
//                         fontSize="var(--icon-fontSize-md)"
//                         onClick={(): void => {
//                           setShowPassword(false);
//                         }}
//                       />
//                     ) : (
//                       <EyeSlashIcon
//                         cursor="pointer"
//                         fontSize="var(--icon-fontSize-md)"
//                         onClick={(): void => {
//                           setShowPassword(true);
//                         }}
//                       />
//                     )
//                   }
//                   label="Contraseña"
//                   type={showPassword ? 'text' : 'password'}
//                 />
//                 {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
//               </FormControl>
//             )}
//           />
//           <div>
//             {/* <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
//               Forgot password?
//             </Link> */}
//           </div>
//           {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
//           <Button disabled={isPending} type="submit" variant="contained">
//             Ir
//           </Button>
//         </Stack>
//       </form>
//       {/* <Alert color="warning">
//         Use{' '}
//         <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
//           sofia@devias.io
//         </Typography>{' '}
//         with password{' '}
//         <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
//           Secret1
//         </Typography>
//       </Alert> */}
//     </Stack>
//   );
// }


// NUEVOOOO BUENOOOO
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Login } from '@/services/login/LoginService'; // Asegúrate de que la ruta sea correcta
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  email: zod.string().min(1, { message: 'El usuario es requerido' }),
  password: zod.string().min(1, { message: 'Contraseña es requerida' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  // const onSubmit = React.useCallback(
  //   async (values: Values): Promise<void> => {
  //     setIsPending(true);

  //     try {
  //       const { email: NombreUsuario, password: ClaveUsuario } = values;

  //       const result = await Login({ NombreUsuario, ClaveUsuario });

  //       if (!result || !result.credenciales) {
  //         setError('root', { type: 'server', message: 'Error al iniciar sesión' });
  //         return;
  //       }

  //       // Almacenar las credenciales en localStorage
  //       localStorage.setItem('custom-auth-token', result.credenciales);

  //       await checkSession?.();
  //       router.refresh();
  //     } catch (error) {
  //       const errorMessage = (error as Error).message || 'Error desconocido';
  //       setError('root', { type: 'server', message: errorMessage });
  //     } finally {
  //       setIsPending(false);
  //     }
  //   },
  //   [checkSession, router, setError]
  // );


  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const { email: NombreUsuario, password: ClaveUsuario } = values;

        const result = await Login({ NombreUsuario, ClaveUsuario });

        // if (!result || !result.credenciales) {
        //   setError('root', { type: 'server', message: 'Error al iniciar sesión' });
        //   return;
        // }

        // if (!result || result.accesohabilitado === false) {
        //   setError('root', { type: 'server', message: 'Usuario inhabilitado' });
        //   return;
        // }

        // if (!result || !result.rol) {
        //   setError('root', { type: 'server', message: 'Error al iniciar sesión' });
        //   return;
        // }

        // console.table(result);
        if (!result) {
          setError('root', { type: 'server', message: 'Error al iniciar sesión' });
          return;
        }

        if (!result.accesohabilitado) {
          setError('root', { type: 'server', message: 'Usuario inhabilitado' });
          return;
        }

        if (!result.rol) {
          setError('root', { type: 'server', message: 'Error al iniciar sesión' });
          return;
        }


        // Almacenar las credenciales
        localStorage.setItem('custom-auth-rol', result.rol);
        localStorage.setItem('custom-auth-name', result.nombre); // No olvides guardar el nombre
        localStorage.setItem('custom-auth-documento', result.documento);
        localStorage.setItem('custom-auth-correo', result.correo);
        localStorage.setItem('custom-auth-token-autenticacion', result.token);

        document.cookie = `custom-auth-rol=${result.rol}; path=/`;

        await checkSession?.();
        // router.push('/'); // 👈 Redirige aquí a la ruta deseada
        // router.refresh(); // Redirige a la página principal
        // window.location.href = '/';
        router.push('/dashboard');


      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        setError('root', { type: 'server', message: errorMessage });
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Iniciar sesión</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Usuario</InputLabel>
                <OutlinedInput {...field} label="Usuario" type="text" autoComplete="current-username" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Contraseña</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => setShowPassword(true)}
                      />
                    )
                  }
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error" severity="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Ir
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
