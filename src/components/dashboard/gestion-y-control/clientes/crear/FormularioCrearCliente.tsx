'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import CircularProgressWithLabel from '@/components/dashboard/componentes_generales/mensajedecarga/CircularProgressWithLabel';
import { crearCliente, verificarClienteExistenteService } from '@/services/gestionycontrol/clientes/CrearClienteService';
import TipoDocumentos from '@/services/TipoDocumentos';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { UserContext } from '@/contexts/user-context';
import { CrearUsuario } from '@/services/gestionycontrol/usuarios/CrearUsuarioService';
import { Typography } from '@mui/material';


const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const Barrios = [
    { value: '1', label: 'Pupular1' }
]

const RolesDisponibles = [
    { value: '1', label: 'Administrador' },
    { value: '2', label: 'Mecánico' },
    { value: '3', label: 'Conductor' },
    { value: '4', label: 'Cliente' },
]

export function FormularioCrearCliente(): React.JSX.Element {

    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    //Se maneja el estado para todos los campos
    const [datos, setDatos] = React.useState({
        Nombres: '',
        TipoDocumento: '4',
        DocumentoUsuario: '',
        Direccion: '',
        Telefono: '',
        Celular: '',
        Correo: '@gmail.com',
        Estado: '1',
        UsuarioCreacion: documentoUsuarioActivo,
        Roles: '4'
    });

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'Nombres', mensaje: 'El nombre es obligatorio.' },
        { campo: 'DocumentoUsuario', mensaje: 'La identificación es obligatoria.' },
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
    const handleCrearCliente = async () => {
        // Validar formulario
        const esValido = await formularioRef.current?.manejarValidacion();

        if (esValido) {
            let progressInterval: NodeJS.Timeout | null = null;
            try {
                setCargando(true);
                // Lógica del progreso
                let progreso = 0;
                progressInterval = setInterval(() => {
                    if (progreso < 80) {
                        progreso += 10;
                        setProgress(progreso);
                    }
                }, 20000);

                // Hacer la petición de crear cliente
                // const data = await crearCliente(datos);
                const data = await CrearUsuario(datos);
                clearInterval(progressInterval); // Limpiar intervalo
                setProgress(100);

                mostrarMensaje('Cliente creado exitosamente', 'success');

                // Limpiar formulario
                setDatos({
                    Nombres: '',
                    TipoDocumento: '4',
                    DocumentoUsuario: '',
                    Direccion: '',
                    Telefono: '',
                    Celular: '',
                    Correo: '@gmail.com',
                    Estado: '1',
                    UsuarioCreacion: documentoUsuarioActivo,
                    Roles: '4'
                });
            } catch (error) {
                if (progressInterval) clearInterval(progressInterval); // Limpiar
                setProgress(0); // Resetear el progreso
                mostrarMensaje(`Error al crear el cliente: ${error}`, 'error');
            } finally {
                setCargando(false);
            }
        }
    };

    // // Función para verificar si el cliente ya existe
    // const verificarClienteExistente = async (identificacion: string) => {
    //     if (!identificacion) return; // Si no hay identificación, no consultar

    //     const result = await verificarClienteExistenteService(identificacion);

    //     if (result) {
    //         mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
    //         console.log('Cliente encontrado:');
    //     };
    // };

    // Función para verificar si el cliente ya existe
    const verificarClienteExistente = async (identificacion: string) => {
        if (!identificacion) return; // Si no hay identificación, no consultar

        console.log('Verificando cliente con identificacion:', identificacion);

        const result = await verificarClienteExistenteService(identificacion);

        // Verificamos el resultado
        if (result) {
            mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
            console.log('Cliente encontrado:', result);
        } else {
            console.log('Cliente no encontrado');
        }
    };

    //Función para manejar el cambio en los inputs
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));

        if (name === 'DocumentoUsuario') {
            if (value.trim() !== '') {
                console.log(value);
                await verificarClienteExistente(value);
            }
        }

        if (name === 'Estado') {
            console.log(value);
        }

        if (name === 'Correo') {
            // const esValido = await formularioRef.current?.manejarValidacion();
        }
    };

    // const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;

    //     if (name === 'Roles') {
    //         const currentRoles = datos.Roles;
    //         const newRoles = typeof value === 'string' ? [value] : value;

    //         setDatos((prevDatos) => ({
    //             ...prevDatos,
    //             Roles: currentRoles.includes(newRoles[0])
    //                 ? currentRoles.filter(rol => rol !== newRoles[0])
    //                 : [...currentRoles, ...newRoles],
    //         }));
    //     } else {
    //         setDatos((prevDatos) => ({
    //             ...prevDatos,
    //             [name]: value,
    //         }));

    //         if (name === 'Identificacion') {
    //             if (value.trim() !== '') {
    //                 console.log(value);
    //                 await verificarClienteExistente(value);
    //             }
    //         }

    //         if (name === 'Estado') {
    //             console.log(value);
    //         }

    //         if (name === 'Correo') {
    //             // const esValido = await formularioRef.current?.manejarValidacion();
    //         }
    //     }
    // };

    //Mostrar alerta y success de inserción
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);
    const [camposFaltantes, setCamposFaltantes] = React.useState<string[]>([]);
    const [cargando, setCargando] = React.useState<boolean>(false);


    // Dentro del estado:
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // Función para abrir alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    return (
        <Card>
            {/* <CircularProgressWithLabel value={10}/> */}
            {/* <CardHeader
                title="Creación de cliente" size="small"
                sx={{
                    // fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '4px', // Espaciado interno más pequeño
                    fontWeight: 'lighter',
                    color: '#000000'
                }}
                
            />
            <Divider /> */}
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de cliente</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label="Nombre"
                            value={datos.Nombres}
                            onChange={handleChange}
                            // required
                            tamano="small"
                            tipo_input="text"
                            valorname='Nombres'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Tipo de identificación'
                            value={datos.TipoDocumento}
                            options={TipoDocumentos}
                            size='small'
                            onChange={handleChange}
                            valorname='TipoDocumento'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Identificación'
                            value={datos.DocumentoUsuario}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='DocumentoUsuario'
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
                            valorname='Estado'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Rol'
                            value={datos.Roles}
                            options={RolesDisponibles}
                            size='small'
                            onChange={handleChange}
                            valorname='Roles'
                            bloqueado={true}
                        />
                    </Grid>
                </Grid>
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
            {/* Si cargando es verdadero, mostrar el CircularProgressWithLabel */}
            {cargando && <CircularProgressWithLabel value={progress} />}


            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </Card>
    );
}