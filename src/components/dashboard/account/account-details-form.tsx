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
    Nombres: '',
    Apellidos: '',
    Correo: '',
    Direccion: '',
    Telefono: '',
    Celular: '',
  });
  const CargarInformacionDelUsuarioActivo = async () => {
    try {
      const Info = await ConsultarInformacionUsuarioActivo(DocumentoUsuarioActivo);
      setinformacionUsuarioActivo({
        Nombres: Info[0].Nombres,
        Apellidos: Info[0].Apellidos,
        Correo: Info[0].Correo,
        Direccion: Info[0].Direccion,
        Telefono: Info[0].Telefono,
        Celular: Info[0].Celular,
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

    if (name === 'Celular') {
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
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
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
                  value={informacionUsuarioActivo.Nombres}
                  onChange={handleChange}
                  // required
                  tamano="small"
                  tipo_input="text"
                  valorname='Nombres'
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
                value={informacionUsuarioActivo.Apellidos}
                onChange={handleChange}
                // required
                tamano="small"
                tipo_input="text"
                valorname='Apellidos'
              />
            </Grid>
            <Grid md={6} xs={12}>
              {/* <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email" />
              </FormControl> */}
              <Input
                label="Correo"
                value={informacionUsuarioActivo.Correo}
                onChange={handleChange}
                // required
                tamano="small"
                tipo_input="text"
                valorname='Correo'
              />
            </Grid>
            <Grid md={6} xs={12}>
              {/* <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl> */}
              <Input
                label="Celular"
                value={informacionUsuarioActivo.Celular}
                onChange={handleChange}
                // required
                tamano="small"
                tipo_input="text"
                valorname='Celular'
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
          <Button variant="contained">Guardar cambios</Button>
        </CardActions>
      </Card>
    </form>
  );
}
