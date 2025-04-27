'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import Departamentos from '@/services/Departamentos';
import Ciudades from '@/services/Municipios';
import Paises from '@/services/Paises';
import TipoDocumentos from '@/services/TipoDocumentos';
import axios from 'axios';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import CircularProgressWithLabel from '@/components/dashboard/componentes_generales/mensajedecarga/CircularProgressWithLabel';

const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

// const Paises = [
//     { value: '1', label: 'Colombia' },
//     { value: '2', label: 'España' },
// ]

// const Departamentos = [
//     { value: '1', label: 'Antioquia' },
//     { value: '2', label: 'Risaralda' }
// ]

// const Ciudades = [
//     { value: '1', label: 'Medellín' },
//     { value: '2', label: 'Pereira' }
// ]

const Barrios = [
    { value: '1', label: 'Pupular1' }
]

interface TipoDeDato {
    ValorNombre: string,
    ValorNit: string,
    ValorDireccion: string,
    ValorTelefono: string,
    ValorCelular: string,
    ValorCorreo: string,
    ValorPais: string,
    ValorDepartamento: string,
    ValorCiudad: string,
    ValorBarrio: string
}


export function FormularioCrearCliente(): React.JSX.Element {

    const [datos, setDatos] = React.useState({
        Nombre: '',
        TipoIdentificacion: '1',
        Identificacion: '',
        Direccion: '',
        Telefono: '',
        Celular: '',
        Correo: '',
        Estado: '1',
    });

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'Nombre', mensaje: 'El nombre es obligatorio.' },
        { campo: 'Identificacion', mensaje: 'La identificación es obligatoria.' },
        { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
        { campo: 'Telefono', mensaje: 'El teléfono es obligatorio.' },
        { campo: 'Celular', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
        { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
        { campo: 'Estado', mensaje: 'El estado es obligatorio' }
    ];

    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);

    };

    // Crear una referencia para el FormularioValidator
    const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);


    const [progress, setProgress] = React.useState(0);
    // const handleCrearCliente = async () => {
    //     console.log(datos.Correo);
    //     console.log(datos);

    //     const esValido = await formularioRef.current?.manejarValidacion();

    //     if (esValido) {
    //         console.log("Validación exitosa. Procediendo a crear...");

    //         try {
    //             setCargando(true);
    //             // 1. Hacer la petición al API con Axios
    //             const { data } = await axios.post('http://localhost:3000/crearcliente', datos);

    //             console.log('Mecánico creado exitosamente:', data);
    //             manejarValidacionExitosa();

    //             setMostrarAlerta(true);

    //             // 2. Limpiar formulario
    //             setDatos({
    //                 Nombre: '',
    //                 TipoIdentificacion: '',
    //                 Identificacion: '',
    //                 Direccion: '',
    //                 Telefono: '',
    //                 Celular: '',
    //                 Correo: '',
    //                 Estado: '1',
    //             });
    //         } catch (error: any) {
    //             // 3. Manejar errores
    //             if (error.response) {
    //                 // El servidor respondió con un error
    //                 console.error('Error del servidor:', error.response.data);
    //             } else if (error.request) {
    //                 // La petición no llegó al servidor
    //                 console.error('No hubo respuesta del servidor:', error.request);
    //             } else {
    //                 // Otro tipo de error
    //                 console.error('Error desconocido:', error.message);
    //             }
    //         }
    //     }
    // };


    // Función para manejar cambios en los inputs
    // Función para manejar la creación del cliente
    //   const handleCrearCliente = async () => {
    //     console.log(datos.Correo);
    //     console.log(datos);

    //     // Validar formulario
    //     const esValido = await formularioRef.current?.manejarValidacion();

    //     if (esValido) {
    //                 // Incrementar el progreso
    //                 let progreso = 0;
    //                 const progressInterval = setInterval(() => {
    //                   if (progreso < 80) {
    //                     progreso += 10;
    //                     setProgress(progreso);
    //                   }
    //                 }, 200);
    //       try {
    //         setCargando(true);


    //         // Hacer la petición al API con Axios
    //         const { data } = await axios.post('http://localhost:3000/crearcliente', datos);
    //         clearInterval(progressInterval);
    //         setProgress(100); // Asegurarse de que llegue al 100%

    //         console.log('Cliente creado exitosamente:', data);
    //         manejarValidacionExitosa();

    //         setMostrarAlerta(true);

    //         // Limpiar formulario
    //         setDatos({
    //           Nombre: '',
    //           TipoIdentificacion: '',
    //           Identificacion: '',
    //           Direccion: '',
    //           Telefono: '',
    //           Celular: '',
    //           Correo: '',
    //           Estado: '1',
    //         });
    //       } catch (error) {
    //         clearInterval(progressInterval); // Detener el progreso en caso de error
    //         setProgress(0); // Resetear el progreso
    //         console.error('Error al crear cliente:', error);
    //       } finally {
    //         setCargando(false);
    //       }
    //     }
    //   };

    const esperar = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const handleCrearCliente = async () => {
        console.log(datos.Correo);
        console.log(datos);

        // Validar formulario
        const esValido = await formularioRef.current?.manejarValidacion();

        if (esValido) {
            let progressInterval: NodeJS.Timeout | null = null; // Declarar progressInterval aquí
            try {
                setCargando(true);
                // Incrementar el progreso
                let progreso = 0;
                progressInterval = setInterval(() => {
                    if (progreso < 80) {
                        progreso += 10;
                        setProgress(progreso);
                    }
                }, 20000);

                // Hacer la petición al API con Axios
                const { data } = await axios.post('http://localhost:3000/crearcliente', datos);
                clearInterval(progressInterval); // Limpiar el intervalo
                setProgress(100); // Asegurarse de que llegue al 100%

                // Llama a la función de espera
                await esperar(2000); // Espera 3 segundos

                console.log('Cliente creado exitosamente:', data);
                manejarValidacionExitosa();

                setMostrarAlerta(true);

                // Limpiar formulario
                setDatos({
                    Nombre: '',
                    TipoIdentificacion: '4',
                    Identificacion: '',
                    Direccion: '',
                    Telefono: '',
                    Celular: '',
                    Correo: '',
                    Estado: '1',
                });
            } catch (error) {
                if (progressInterval) {
                    clearInterval(progressInterval); // Detener el progreso en caso de error
                }
                setProgress(0); // Resetear el progreso
                console.error('Error al crear cliente:', error);
            } finally {
                setCargando(false);
            }
        }
    };

    const handleChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };

    //Nombre
    const [Nombre, setNombre] = React.useState('');
    const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(event.target.value);
    };

    const [TipoIdentificacion, setTipoIdentificacion] = React.useState<string>('4');
    const handleChangeTipoIdentificacion = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setTipoIdentificacion(newValue);
    };

    //Nit
    const [Nit, setNit] = React.useState('');
    const handleChangeNit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNit(event.target.value);
    };

    //Dirección
    const [Direccion, setDireccion] = React.useState('');
    const handleChangeDireccion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDireccion(event.target.value);
    };

    //Teléfono
    const [Telefono, setTelefono] = React.useState('');
    const handleChangeTelefono = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTelefono(event.target.value);
    };

    //Celular
    const [Celular, setCelular] = React.useState('');
    const handleChangeCelular = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCelular(event.target.value);
    };

    //Estado
    const [Estado, setEstado] = React.useState<string>('');
    const handleChangeEstado = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setEstado(newValue);
    };

    //Correo
    const [Correo, setCorreo] = React.useState('');
    const handleChangeCorreo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCorreo(event.target.value);
    };

    //País
    const [Pais, setPais] = React.useState<string>('48');
    const handleChangePais = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setPais(newValue);
    };

    //Departamento
    const [Departamento, setDepartamento] = React.useState<string>('1');
    const handleChangeDepartamento = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setDepartamento(newValue);
    };

    //Ciudad
    const [Ciudad, setCiudad] = React.useState<string>('1');
    const handleChangeCiudad = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setCiudad(newValue);
    };

    //Barrio
    const [Barrio, setBarrio] = React.useState<string>('');
    const handleChangeBarrio = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setBarrio(newValue);
    };

    //Mostrar alerta y success de inserción
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);
    const [camposFaltantes, setCamposFaltantes] = React.useState<string[]>([]);
    const [cargando, setCargando] = React.useState<boolean>(false);
    // const handleCrearCliente = () => {
    //     setCargando(true);
    //     const DatosDeEnvio = {
    //         ValorNombre: Nombre,
    //         ValorNit: Nit,
    //         ValorDireccion: Direccion,
    //         ValorTelefono: Telefono,
    //         ValorCelular: Celular,
    //         ValorCorreo: Correo,
    //         ValorPais: Pais,
    //         ValorDepartamento: Departamento,
    //         ValorCiudad: Ciudad,
    //         ValorBarrio: Barrio
    //     }
    //     setMostrarAlerta(true);

    //     // Ocultar después de 3 segundos
    //     setTimeout(() => {
    //         setMostrarAlerta(false);
    //     }, 3000);
    // };

    return (
        <Card>
            {/* <CircularProgressWithLabel value={10}/> */}
            <CardHeader
                title="Creación de cliente" size="small"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Nombre"
                            value={datos.Nombre}
                            onChange={handleChange}
                            // required
                            tamano="small"
                            tipo_input="text"
                            valorname='Nombre'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Tipo de identificación'
                            value={datos.TipoIdentificacion}
                            options={TipoDocumentos}
                            size='small'
                            onChange={handleChange}
                            valorname='TipoIdentificacion'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Identificación'
                            value={datos.Identificacion}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Identificacion'
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Dirección'
                            value={datos.Direccion}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Direccion'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Teléfono'
                            value={datos.Telefono}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Telefono'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Celular'
                            value={datos.Celular}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Celular'
                            maximalongitud={10}
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Correo'
                            value={datos.Correo}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Correo'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Estado'
                            value={datos.Estado}
                            options={EstadoCliente}
                            size='small'
                            onChange={handleChange}
                        />
                    </Grid>
                    {/* <Grid md={2} xs={12} mt={0.5} style={{display: 'block'}}>
                        <InputSelect
                            label='País'
                            value={Pais}
                            options={Paises}
                            size='small'
                            onChange={handleChangePais}
                            valorname='Pais'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Departamento'
                            value={Departamento}
                            options={Departamentos}
                            size='small'
                            onChange={handleChangeDepartamento}
                            valorname='Departamento'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Ciudad'
                            value={Ciudad}
                            options={Ciudades}
                            size='small'
                            onChange={handleChangeCiudad}
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Barrio'
                            value={Barrio}
                            options={Barrios}
                            size='small'
                            onChange={handleChangeBarrio}
                        />
                    </Grid> */}

                    {/* <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select defaultValue="Activo" label="Estado" name="state" variant="outlined" size="small">
                                {EstadoCliente.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}
                </Grid>
                {/* {mostrarAlerta && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Este es un mensaje de error!
                    </Alert>
                )} */}
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearCliente}>
                    Crear cliente
                </Button>
                <FormularioValidator
                    ref={formularioRef}
                    datos={datos}
                    reglasValidacion={reglasValidacion}
                    onValid={manejarValidacionExitosa}
                />
            </CardActions>

            {/* Snackbar con alerta */}
            <Snackbar
                open={mostrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                onClose={() => setMostrarAlerta(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }} onClose={() => setMostrarAlerta(false)}>
                    Cliente creado exitosamente
                </Alert>
            </Snackbar>

            {/* Si cargando es verdadero, mostrar el CircularProgressWithLabel */}
            {cargando && <CircularProgressWithLabel value={progress} />}
        </Card>
    );
}