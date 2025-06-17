'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { SelectChangeEvent } from '@mui/material/Select';
import { UserContext } from '@/contexts/user-context';
import { ConsultarInformacionUsuarioActivo } from '@/services/gestionycontrol/cuenta/ConsultarInformacionUsuarioActivoService';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { ActualizarInformacionUsuarioActivo } from '@/services/gestionycontrol/cuenta/ActualizarInformacionUsuarioActivoService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { useSocketIO } from '@/hooks/use-WebSocket';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  // Se captura el documento del usuario activo
  const { user } = React.useContext(UserContext) || { user: null };
  const DocumentoUsuarioActivo = user ? `${user.documento}` : '';
  // ...

  // Se maneja el estado para la información del usuario
  const [informacionUsuarioActivo, setinformacionUsuarioActivo] = React.useState({
    NombresUsuario: '',
    ApellidosUsuario: '',
    CorreoUsuario: '',
    DireccionUsuario: '',
    CelularUsuario: '',
    DocumentoUsuario: DocumentoUsuarioActivo
  });
  const CargarInformacionDelUsuarioActivo = async () => {
    try {
      const Info = await ConsultarInformacionUsuarioActivo(DocumentoUsuarioActivo);
      setinformacionUsuarioActivo({
        NombresUsuario: Info[0].Nombres,
        ApellidosUsuario: Info[0].Apellidos,
        CorreoUsuario: Info[0].Correo,
        DireccionUsuario: Info[0].Direccion,
        CelularUsuario: Info[0].Celular,
        DocumentoUsuario: DocumentoUsuarioActivo
      });
    } catch (error) {
      console.error(`Error al cargar la información del usuario activo: ${error}`);
    }
  };
  React.useEffect(() => {
    CargarInformacionDelUsuarioActivo();
  }, []);
  // ...

  //Función para manejar el cambio en los inputs
  // const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setinformacionUsuarioActivo((prevDatos) => ({
  //     ...prevDatos,
  //     [name]: value,
  //   }));

  //   if (name === 'Celular') {
  //     // Solo permitir números y máximo 10 dígitos
  //     const soloNumeros = value.replace(/\D/g, ''); // Elimina todo lo que no sea número

  //     if (soloNumeros.length > 10) return; // No actualizar si supera los 10

  //     setinformacionUsuarioActivo((prevDatos) => ({
  //       ...prevDatos,
  //       [name]: soloNumeros,
  //     }));
  //   }
  // }
  const handleChange = async (
    e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'CelularUsuario') {
      const soloNumeros = value.replace(/\D/g, ''); // Solo números
      if (soloNumeros.length > 10) return; // No actualiza si supera 10

      setinformacionUsuarioActivo((prevDatos) => ({
        ...prevDatos,
        [name]: soloNumeros,
      }));
    } else {
      // Otros campos normales
      setinformacionUsuarioActivo((prevDatos) => ({
        ...prevDatos,
        [name]: value,
      }));
    }
  };
  //  ... 

  //Para el manejo de las notificiones/alertas
  const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
  const [mensajeAlerta, setMensajeAlerta] = React.useState('');
  const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error' | 'warning'>('success');
  const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error' | 'warning') => {
    setMensajeAlerta(mensaje);
    setTipoAlerta(tipo);
    setMostrarAlertas(true);
  };
  //...

  //Se implementa el uso del websocket
  const { sendMessage, messages } = useSocketIO();
  // ...

  // Se definen las reglas con su respectivo mensaje de alerta
  const reglasValidacion = [
    { campo: 'NombresUsuario', mensaje: 'El nombre es obligatorio' },
    { campo: 'CorreoUsuario', mensaje: 'El correo es obligatorio y debe ser válido.' },
    { campo: 'CelularUsuario', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
  ];
  // ...

  // Se maneja la validación exitosa del formulario
  const manejarValidacionExitosa = () => {
    // Lógica para manejar la validación exitosa
    console.log("Validación exitosa. Procesar datos...", informacionUsuarioActivo);

  };
  // ...

  // Se crea referencia para el formulario validador
  const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);
  // ...

  // Se maneja funcionalidad para la actualización de los datos del usuario activo
  const HandleActualizarInformacionUsuarioActivo = async () => {
    // Validar formulario
    const esValido = await formularioRef.current?.manejarValidacion();

    if (esValido) {
      try {
        await ActualizarInformacionUsuarioActivo(informacionUsuarioActivo);
        sendMessage('informacion-usuario-activo-actualizada', {});
        mostrarMensaje(
          'Información actualizada correctamente. Si cambiaste el nombre, cierra sesión y vuelve a ingresar para que el cambio se refleje.',
          'success'
        );
      } catch (error) {
        mostrarMensaje(`Errro al actualizar la información: ${error}`, 'error');
      }
    }

  };
  // ...
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <MensajeAlerta
        open={mostrarAlertas}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
        onClose={() => setMostrarAlertas(false)}
        duracion={5000}
      />

      <Card>
        <CardHeader subheader="La información se puede editar" title="Perfil" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                {/* <InputLabel>First name</InputLabel>
                <OutlinedInput defaultValue="Sofia" label="First name" name="firstName" /> */}
                <Input
                  label="Nombres"
                  value={informacionUsuarioActivo.NombresUsuario}
                  onChange={handleChange}
                  // required
                  tamano="small"
                  tipo_input="text"
                  valorname='NombresUsuario'
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              {/* <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue="Rivers" label="Last name" name="lastName" />
              </FormControl> */}
              <Input
                label="Apellidos"
                value={informacionUsuarioActivo.ApellidosUsuario}
                onChange={handleChange}
                // required
                tamano="small"
                tipo_input="text"
                valorname='ApellidosUsuario'
              />
            </Grid>
            <Grid md={6} xs={12}>
              {/* <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email" />
              </FormControl> */}
              <Input
                label="Correo"
                value={informacionUsuarioActivo.CorreoUsuario}
                onChange={handleChange}
                // required
                tamano="small"
                tipo_input="text"
                valorname='CorreoUsuario'
              />
            </Grid>
            <Grid md={6} xs={12}>
              {/* <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl> */}
              <Input
                label="Celular"
                value={informacionUsuarioActivo.CelularUsuario}
                onChange={handleChange}
                // required
                tamano="small"
                tipo_input="text"
                valorname='CelularUsuario'
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Input
                label="Dirección"
                value={informacionUsuarioActivo.DireccionUsuario}
                onChange={handleChange}
                tamano="small"
                tipo_input="text"
                valorname='DireccionUsuario'
              />
            </Grid>
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue="New York" label="State" name="state" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput label="City" />
              </FormControl>
            </Grid> */}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={HandleActualizarInformacionUsuarioActivo}>Guardar cambios</Button>
          <FormularioValidator
            ref={formularioRef}
            datos={informacionUsuarioActivo}
            reglasValidacion={reglasValidacion}
            onValid={manejarValidacionExitosa}
          />
        </CardActions>
      </Card>
    </form>
  );
}
