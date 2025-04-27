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
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import TipoDocumentos from '@/services/TipoDocumentos';
import axios from 'axios'; 

const EstadoMecanico = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

interface DatosTipo {
    ValorNombres: string;
    ValorApellidos: string;
    ValorDocumento: string;
    ValorDireccion: string;
    ValorCelular: string;
    ValorCorreo: string;
    ValorEstado: string;
}

// Define una interfaz para los datos
interface DatosMecanico {
    Nombres: string;
    Apellidos: string;
    Documento: string;
    Direccion: string;
    Celular: string;
    Correo: string;
    Estado: string;
}

export function FormularioCrearMecanico(): React.JSX.Element {

    const [datos, setDatos] = React.useState({
        Nombres: '',
        Apellidos: '',
        TipoDocumento: '1',
        Documento: '',
        Direccion: '',
        Celular: '',
        Correo: '',
        Estado: '1',
    });

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
        { campo: 'Apellidos', mensaje: 'El apellido es obligatorio.' },
        { campo: 'Documento', mensaje: 'El documento es obligatorio.' },
        { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
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

    // const handleCrearMecanico = () => {
    //     console.log(datos.Correo)
    //     console.log(datos);
    //     // Llamar a la función de validación del FormularioValidator
    //     formularioRef.current?.manejarValidacion();
    //     // manejarValidacionExitosa();
    //     console.log("LLEGUE");

    // };

    // const handleCrearMecanico = async () => {
    //     console.log(datos.Correo);
    //     console.log(datos);

    //     const esValido = await formularioRef.current?.manejarValidacion();

    //     if (esValido) {
    //         console.log("LLEGUE");
    //         try {

    //         } catch (error) {

    //         }
    //         manejarValidacionExitosa();

    //         setMostrarAlerta(true);
    //         // Reiniciar los campos del formulario
    //         setDatos({
    //             Nombres: '',
    //             Apellidos: '',
    //             TipoDocumento: '',
    //             Documento: '',
    //             Direccion: '',
    //             Celular: '',
    //             Correo: '',
    //             Estado: '', // O el valor que desees por defecto
    //         });
    //     }
    // };


    const handleCrearMecanico = async () => {
        console.log(datos.Correo);
        console.log(datos);
    
        const esValido = await formularioRef.current?.manejarValidacion();
    
        if (esValido) {
            console.log("Validación exitosa. Procediendo a crear...");
    
            try {
                // 1. Hacer la petición al API con Axios
                const { data } = await axios.post('/api/mecanicos', datos);
    
                console.log('Mecánico creado exitosamente:', data);
                manejarValidacionExitosa();
    
                setMostrarAlerta(true);
    
                // 2. Limpiar formulario
                setDatos({
                    Nombres: '',
                    Apellidos: '',
                    TipoDocumento: '',
                    Documento: '',
                    Direccion: '',
                    Celular: '',
                    Correo: '',
                    Estado: '', // O valor que necesites por defecto
                });
            } catch (error: any) {
                // 3. Manejar errores
                if (error.response) {
                    // El servidor respondió con un error
                    console.error('Error del servidor:', error.response.data);
                } else if (error.request) {
                    // La petición no llegó al servidor
                    console.error('No hubo respuesta del servidor:', error.request);
                } else {
                    // Otro tipo de error
                    console.error('Error desconocido:', error.message);
                }
            }
        }
    };


    // Función para manejar cambios en los inputs
    const handleChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };


    //Nombres
    const [Nombres, setNombres] = React.useState('');
    const handleChangeNombres = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombres(event.target.value);
    };

    //Apellidos
    const [Apellidos, setApellidos] = React.useState('');
    const handleChangeApellidos = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApellidos(event.target.value);
    };

    //Documento
    const [Documento, setDocumento] = React.useState('');
    const handleChangeDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDocumento(event.target.value);
    };

    //Dirección
    const [Direccion, setDireccion] = React.useState('');
    const handleChangeDireccion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDireccion(event.target.value);
    };

    //Tipo de documento
    const [TipoDocumento, setTipoDocumento] = React.useState('');
    const handleChangeTipoDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoDocumento(event.target.value);
    };

    //Celular
    const [Celular, setCelular] = React.useState('');
    const handleChangeCelular = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCelular(event.target.value);
    };

    //Correo
    const [Correo, setCorreo] = React.useState('');
    const handleChangeCorreo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCorreo(event.target.value);
    };

    //Estado
    const [Estado, setEstado] = React.useState<string>('');
    const handleChangeEstado = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setEstado(newValue);
    };

    //Mostrar alerta, validaciones y creación de mecánico
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);
    const [cargando, setCargando] = React.useState<boolean>(false);
    const [camposFaltantes, setCamposFaltantes] = React.useState<string[]>([]);
    const [MostrarAlertaSuccess, setMostrarAlertaSuccess] = React.useState<boolean>(false);
    // const handleCrearMecanico = () => {
    //     // setMostrarAlerta(true);

    //     setCargando(true);
    //     const Datos: DatosTipo = {
    //         ValorNombres: Nombres,
    //         ValorApellidos: Apellidos,
    //         ValorDocumento: Documento,
    //         ValorDireccion: Direccion,
    //         ValorCelular: Celular,
    //         ValorCorreo: Correo,
    //         ValorEstado: Estado,
    //     };

    //     const camposFaltantes = []; // Array para almacenar mensajes de campos faltantes


    //     // Ocultar después de 3 segundos
    //     setTimeout(() => {
    //         setMostrarAlerta(false);
    //     }, 3000);
    // };


    return (
        <Card>
            <CardHeader
                title="Creación de mecánico" size="small"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    {/* <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Nombres'
                            value={Nombres}
                            onChange={handleChangeNombres}
                            // required
                            tamano='small'
                            tipo_input='text'
                        />
                    </Grid> */}
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Nombres'
                            value={datos.Nombres}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Nombres'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Apellidos'
                            value={datos.Apellidos}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Apellidos'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                       <InputSelect
                          label='Tipo de documento'
                          value={datos.TipoDocumento}
                          options={TipoDocumentos}
                          size='small'
                          onChange={handleChange}
                       />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Documento'
                            value={datos.Documento}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Documento'
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
                            options={EstadoMecanico}
                            size='small'
                            valorname='Estado'
                            // onChange={handleChangeEstado}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                {/* {mostrarAlerta && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Este es un mensaje de error!
                    </Alert>
                )} */}
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearMecanico}>
                    Crear mecánico
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
        </Card>
    );
}