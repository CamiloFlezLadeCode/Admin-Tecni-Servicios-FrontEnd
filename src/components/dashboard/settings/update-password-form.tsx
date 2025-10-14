// 'use client';

// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
// import Divider from '@mui/material/Divider';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Stack from '@mui/material/Stack';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';
// import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
// import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
// import { Box, IconButton } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// // Para validar formulario
// import { z as zod } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Controller, useForm } from 'react-hook-form';
// // ...
// import FormHelperText from '@mui/material/FormHelperText';

// // Se implementa validación con Z/Zod
// const schema = zod.object({
//   Password: zod.string().min(1, { message: 'La contraseña es obligatoria' }),
//   ConfirmPassword: zod.string().min(1, { message: 'Confirmar la contraseña es obligatorio' }),
// });

// type Values = zod.infer<typeof schema>;

// const defaultValues = { Password: '', ConfirmPassword: '' } satisfies Values;
// // ...

// export function UpdatePasswordForm(): React.JSX.Element {
//   // Se maneja el estado para los campos
//   const [datos, setDatos] = React.useState({
//     Password: '',
//     ConfirmPassword: ''
//   });
//   // ...

//   //Función para manejar el cambio en los inputs
//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setDatos((prevDatos) => ({
//       ...prevDatos,
//       [name]: value,
//     }));
//   };
//   // ...

//   // Estado para mostar/ocultar el contenido de los campos contraseña y confirm contraseña
//   const [showPassword, setShowPassword] = React.useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
//   // ...

//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
//   return (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//       }}
//     >
//       <Card>
//         <CardHeader subheader="Actualizar contraseña" title="Contraseña" />
//         <Divider />
//         <CardContent>
//           {/* <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
//             <FormControl fullWidth>
//               <InputLabel>Password</InputLabel>
//               <OutlinedInput label="Password" name="password" type="password" />
//             </FormControl>
//             <FormControl fullWidth>
//               <InputLabel>Confirm password</InputLabel>
//               <OutlinedInput label="Confirm password" name="confirmPassword" type="password" />
//             </FormControl>
//           </Stack> */}

//           <Grid container spacing={1}>
//             <Grid md={4} xs={12} mt={0.5} display='flex'>
//               <Input
//                 label="Contraseña"
//                 value={datos.Password}
//                 onChange={handleChange}
//                 // required
//                 tamano="small"
//                 // tipo_input="password"
//                 tipo_input={showPassword ? 'text' : 'password'}
//                 valorname='Password'
//               />
//               <IconButton onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
//               </IconButton>
//               {errors.Password ? <FormHelperText>{errors.Password.message}</FormHelperText> : null}
//             </Grid>
//           </Grid>

//           <Grid container spacing={1} mt={3}>
//             <Grid md={4} xs={12} mt={0.5} display='flex'>
//               <Input
//                 label="Confirmar contraseña"
//                 value={datos.ConfirmPassword}
//                 onChange={handleChange}
//                 // required
//                 tamano="small"
//                 // tipo_input="password"
//                 tipo_input={showConfirmPassword ? 'text' : 'password'}
//                 valorname='ConfirmPassword'
//               />
//               <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
//               </IconButton>
//             </Grid>
//           </Grid>
//         </CardContent>
//         <Divider />
//         <CardActions sx={{ justifyContent: 'flex-end' }}>
//           <Button variant="contained">Actualizar</Button>
//         </CardActions>
//       </Card>
//     </form>
//   );
// }






'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  FormHelperText,
  Box
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import { UserContext } from '@/contexts/user-context';
import { ActualizarCredencialesUsuarioActivo } from '@/services/gestionycontrol/ajustes/ActualizarCredencialesUsuarioActivoService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

// Validación con Zod
const schema = zod
  .object({
    User: zod.string().min(1, 'El usuario es obligatorio'),
    Password: zod.string().min(1, 'La contraseña es obligatoria'),
    ConfirmPassword: zod.string().min(1, 'Confirmar la contraseña es obligatorio'),
  })
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['ConfirmPassword'],
  });

type Values = zod.infer<typeof schema>;

const defaultValues: Values = { User: '', Password: '', ConfirmPassword: '' };

export function UpdatePasswordForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  // Consumir el contexto del usuario
  const { user } = React.useContext(UserContext) || { user: null };
  // Obtener el nombre del usuario, si existe
  const documentoUsuarioActivo = user ? `${user.documento}` : null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      User: documentoUsuarioActivo || ''
    },
    resolver: zodResolver(schema),
  });

  // Dentro del estado:
  const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
  const [mensajeAlerta, setMensajeAlerta] = React.useState('');
  const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error' | 'warning'>('success');

  // Función para abrir alerta
  const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error' | 'warning') => {
    setMensajeAlerta(mensaje);
    setTipoAlerta(tipo);
    setMostrarAlertas(true);
  };


  const onSubmit = async (data: Values) => {
    const datosConDocumento = {
      // ...data,
      User: documentoUsuarioActivo,
      Password: data.Password,
      ConfirmPassword: data.ConfirmPassword,
      DocumentoUsuarioActivo: documentoUsuarioActivo, // o el valor que tengas
    };
    try {
      await ActualizarCredencialesUsuarioActivo(datosConDocumento);
      mostrarMensaje('Credenciales actualizadas correctamente', 'success');
      reset();
    } catch (error) {
      mostrarMensaje(`Ocurrió un error al actualizar las credenciales: ${error}`, 'success');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MensajeAlerta
        open={mostrarAlertas}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
        onClose={() => setMostrarAlertas(false)}
      />
      <Card>
        <CardHeader subheader="Actualizar credenciales" title="Credenciales" />
        <Divider />
        <CardContent>
          <Grid container spacing={1}>
            <Grid md={12} xs={12} display="flex" alignItems="flex-start">
              {/* <Controller
                name="User"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Usuario"
                    tamano="small"
                    tipo_input="text"
                    valorname="Usuario"
                  />
                )}
              /> */}
              <Controller
                name="User"
                control={control}
                render={({ field }) => (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Input
                      {...field}
                      label="Usuario"
                      tamano="small"
                      tipo_input="text"
                      valorname="Usuario"
                      bloqueado
                      // InputProps={{
                      //   endAdornment: (
                      //     <Box width="40px" /> // Reserva espacio, como el ícono del ojito
                      //   ),
                      // }}
                      endAdornment={
                        <IconButton style={{ cursor: 'default' }}>
                          {/* {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />} */}
                          {/* <Box width="25px" /> */}
                          <Box width="25px" height="25px" sx={{ cursor: 'default' }} />
                        </IconButton>
                      }
                    />
                  </Box>
                )}
              />
            </Grid>
            {errors.User && (
              <Grid xs={12}>
                <FormHelperText error>{errors.User.message}</FormHelperText>
              </Grid>
            )}
          </Grid>

          <Grid container spacing={1} mt={2}>
            <Grid md={12} xs={12} display="flex" alignItems="flex-start">
              <Controller
                name="Password"
                control={control}
                render={({ field }) => (
                  <Box display="flex" alignItems="center" gap={1}>
                    {/* <Input
                      {...field}
                      label="Contraseña"
                      tamano="small"
                      tipo_input={showPassword ? 'text' : 'password'}
                      valorname="Password"
                    /> */}
                    <Input
                      {...field}
                      label="Contraseña"
                      tamano="small"
                      tipo_input={showPassword ? 'text' : 'password'}
                      valorname="Password"
                      // InputProps={{
                      //   endAdornment: (
                      //     <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      //       {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                      //     </IconButton>
                      //   ),
                      // }}
                      endAdornment={
                        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                        </IconButton>
                      }
                    />
                    {/* <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </IconButton> */}
                  </Box>
                )}
              />
            </Grid>
            {errors.Password && (
              <Grid xs={12}>
                <FormHelperText error>{errors.Password.message}</FormHelperText>
              </Grid>
            )}
          </Grid>

          <Grid container spacing={1} mt={2}>
            <Grid md={12} xs={12} display="flex" alignItems="flex-start">
              <Controller
                name="ConfirmPassword"
                control={control}
                render={({ field }) => (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Input
                      {...field}
                      label="Confirmar contraseña"
                      tamano="small"
                      tipo_input={showConfirmPassword ? 'text' : 'password'}
                      valorname="ConfirmPassword"
                      // InputProps={{
                      //   endAdornment: (
                      //     <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      //       {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                      //     </IconButton>
                      //   ),
                      // }}
                      endAdornment={
                        <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}>
                          {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                        </IconButton>
                      }
                    />
                    {/* <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </IconButton> */}
                  </Box>
                )}
              />
            </Grid>
            {errors.ConfirmPassword && (
              <Grid xs={12}>
                <FormHelperText error>{errors.ConfirmPassword.message}</FormHelperText>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Actualizar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
