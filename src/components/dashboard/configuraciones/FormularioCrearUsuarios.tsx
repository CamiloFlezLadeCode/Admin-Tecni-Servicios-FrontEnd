'use client';

import * as React from 'react';
import {
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Divider,
    SelectChangeEvent,
    Box,
    IconButton,
    FormHelperText,
} from '@mui/material';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { Divide } from '@phosphor-icons/react';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ConsultarCredencialesDelProfesional } from '@/services/configuraciones/ConsultarCredencialesDelProfesionalService';
import { UserContext } from '@/contexts/user-context';
import { CrearCredencialesProfesionalPorAdministrador } from '@/services/configuraciones/CrearCredencialesProfesionalPorAdministradorService';
import { ActualizarCredencialesProfesionalPorAdministrador } from '@/services/configuraciones/ActualizarCredencialesProfesionalPorAdministradorService';

// Se definen validaciones con zod
const schema = zod
    .object({
        User: zod.string().min(1, 'El usuario es obligatorio'),
        Password: zod.string().min(1, 'La contraseña es obligatoria'),
    });
type Values = zod.infer<typeof schema>;
const defaultValues: Values = { User: '', Password: '' };
// ...
export function FormularioCrearUsuarios(): React.JSX.Element {

    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;


    // Se listan los profesionales pertenecientes
    const [profesionalesPertenecientes, setProfesionalesPertenecientes] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarProfesionalesPertenecientes = async () => {
        try {
            const Respuesta = await ListarProfesionalesPertenecientes();
            Respuesta.unshift(
                { value: 'SinSeleccionar', label: 'Sin seleccionar' }
            );
            setProfesionalesPertenecientes(Respuesta);
        } catch (error) {
            mostrarMensaje(`Hubo un error al listar los profesionales. ${error}`, 'error');
        }
    };
    React.useEffect(() => {
        CargarProfesionalesPertenecientes();
    }, []);
    // ...

    // Se implementas estados y funcionalidad para mostrar las alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error' | 'warning'>('success');
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error' | 'warning') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    // ...

    // Estado para todos los campos
    const [datos, setDatos] = React.useState({
        DocumentoProfesional: 'SinSeleccionar',
        User: '',
        Password: ''
    });
    // ...

    // Se maneja el cambio para todos los campos
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    }
    // ...

    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = React.useState(false);
    // ...


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    // Se implementa funcionalidad para cosultar credenciales del profesional seleccionado
    const [TextoBoton, setTextoBoton] = React.useState('.');
    const [botonHabilitado, setBotonHabilitado] = React.useState<boolean>(true);
    const HandleConsultarCredencialesProfesional = async () => {
        try {
            const Respuesta = await ConsultarCredencialesDelProfesional(datos.DocumentoProfesional);

            const TieneCredenciales = Respuesta.TieneCredenciales;

            if (TieneCredenciales === 'SI' && Array.isArray(Respuesta.Credenciales) && Respuesta.Credenciales.length > 0) {
                const credencial = Respuesta.Credenciales[0];
                const User = credencial.NombreUsuarioProfesional;
                const Password = credencial.ClaveUsuarioProfesional;

                setTextoBoton('Actualizar');
                setBotonHabilitado(false);
                reset({
                    User: User,
                    Password: Password
                });
            } else {
                setTextoBoton('Crear');
                setBotonHabilitado(false);
                reset({
                    User: '',
                    Password: ''
                });
            }
        } catch (error) {
            mostrarMensaje(`Hubo un error al consultar las credenciales del profesional: ${error}`, 'error');
        }
    };
    // ...

    // Se ejecuta la función únicamente si el valor realmente cambia y si su value es diferente de SinSeleccionar
    const prevDocumentoRef = React.useRef<string | null>(null);
    React.useEffect(() => {
        if (datos.DocumentoProfesional === 'SinSeleccionar') {
            setBotonHabilitado(true);
        }

        if (
            datos.DocumentoProfesional &&
            datos.DocumentoProfesional !== prevDocumentoRef.current &&
            datos.DocumentoProfesional !== 'SinSeleccionar'
        ) {
            prevDocumentoRef.current = datos.DocumentoProfesional;
            HandleConsultarCredencialesProfesional();
        }
    }, [datos.DocumentoProfesional]);
    // ...

    const onSubmit = async (data: Values) => {
        const DatosAEnviar = {
            ...data,
            DocumentoProfesional: datos.DocumentoProfesional,
            DocumentoUsuario: documentoUsuarioActivo,
            Accion: TextoBoton
        };
        // Se captura la operación a realizar
        const Operacion = DatosAEnviar.Accion;
        // ...

        // Se implementa switch para manejar cada operación
        switch (Operacion) {
            case 'Crear':
                try {
                    await CrearCredencialesProfesionalPorAdministrador(DatosAEnviar);
                    mostrarMensaje('Credenciales creadas correctamente', 'success');
                    setDatos((prev) => ({
                        ...prev,
                        DocumentoProfesional: 'SinSeleccionar'
                    }));
                    reset((data) => ({
                        ...data,
                        User: '',
                        Password: ''
                    }));
                    setTextoBoton('.');
                } catch (error) {
                    mostrarMensaje(`Hubo un error al crear las credenciales del profesional: ${error}`, 'error');
                };
                break;

            case 'Actualizar':
                try {
                    await ActualizarCredencialesProfesionalPorAdministrador(DatosAEnviar);
                    mostrarMensaje('Credenciales actualizadas correctamente', 'success');
                    setDatos((prev) => ({
                        ...prev,
                        DocumentoProfesional: 'SinSeleccionar'
                    }));
                    reset((data) => ({
                        ...data,
                        User: '',
                        Password: ''
                    }));
                    setTextoBoton('.');
                } catch (error) {
                    mostrarMensaje(`Hubo un error al actualizar las credenciales del profesional: ${error}`, 'error');
                }
                break;

            default:

                break;
        }
        // ...
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de usuarios</Typography>
                <Divider />
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid md={6} xs={12} mt={0.5}>
                            <InputSelect
                                label='Seleccinar profesional'
                                value={datos.DocumentoProfesional}
                                options={profesionalesPertenecientes}
                                size='small'
                                onChange={handleChange}
                                valorname='DocumentoProfesional'
                            />
                        </Grid>
                        <Grid md={6} xs={12} mt={0.5} display='grid' gap={2}>
                            {/* <Input
                                label="Usuario"
                                value={datos.User}
                                onChange={handleChange}
                                // required
                                tamano="small"
                                tipo_input="text"
                                valorname='User'
                            /> */}


                            <Controller
                                name="User"
                                control={control}
                                render={({ field }) => (
                                    <Box display="flex" flexDirection="column">
                                        <Input
                                            {...field}
                                            label="Usuario"
                                            tamano="small"
                                            tipo_input="text"
                                            valorname="Usuario"
                                            endAdornment={
                                                <IconButton style={{ cursor: 'default' }}>
                                                    <Box width="25px" height="25px" sx={{ cursor: 'default' }} />
                                                </IconButton>
                                            }
                                        />
                                        {errors.User && (
                                            <FormHelperText error>{errors.User.message}</FormHelperText>
                                        )}
                                    </Box>
                                )}
                            />
                            {/* <Input
                                label="Contraseña"
                                value={datos.Password}
                                onChange={handleChange}
                                // required
                                tamano="small"
                                tipo_input="password"
                                valorname='Password'
                            /> */}

                            <Controller
                                name="Password"
                                control={control}
                                render={({ field }) => (
                                    <Box display="flex" flexDirection="column">
                                        <Input
                                            {...field}
                                            label="Contraseña"
                                            tamano="small"
                                            tipo_input={showPassword ? 'text' : 'password'}
                                            valorname="Password"
                                            endAdornment={
                                                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                                                </IconButton>
                                            }
                                        />
                                        {errors.Password && (
                                            <FormHelperText error>{errors.Password.message}</FormHelperText>
                                        )}
                                    </Box>
                                )}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant='contained' type="submit" disabled={botonHabilitado}>{TextoBoton}</Button>
                </CardActions>
            </Card>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </form>
    )
};