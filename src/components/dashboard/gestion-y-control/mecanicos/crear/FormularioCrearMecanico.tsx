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
import { CrearMecanico } from '@/services/gestionycontrol/mecanicos/CrearMecanicoService';
import { UserContext } from '@/contexts/user-context';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';


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

const RolesDisponibles = [
    { value: '1', label: 'Administrador' },
    { value: '2', label: 'Mecánico' },
    { value: '3', label: 'Conductor' },
    { value: '4', label: 'Cliente' },
]

export function FormularioCrearMecanico(): React.JSX.Element {
    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const [datos, setDatos] = React.useState({
        Nombres: '',
        Apellidos: '',
        TipoDocumento: '1',
        Documento: '',
        Direccion: '',
        Celular: '',
        Correo: '@gmail.com',
        UsuarioCreacion: documentoUsuarioActivo,
        Estado: '1',
        Roles: '2'
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
    const [progress, setProgress] = React.useState(0);
    const handleCrearMecanico = async () => {
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
                const data = await CrearMecanico(datos);
                clearInterval(progressInterval); // Limpiar intervalo
                setProgress(100);

                mostrarMensaje('Mecánico creado exitosamente', 'success');

                // Limpiar formulario
                setDatos({
                    Nombres: '',
                    Apellidos: '',
                    TipoDocumento: '1',
                    Documento: '',
                    Direccion: '',
                    Celular: '',
                    Correo: '@gmail.com',
                    UsuarioCreacion: documentoUsuarioActivo,
                    Estado: '1',
                    Roles: '2'
                });
            } catch (error) {
                if (progressInterval) clearInterval(progressInterval); // Limpiar
                setProgress(0); // Resetear el progreso
                mostrarMensaje(`Error al crear el mecánico: ${error}`, 'error');
            } finally {
                setCargando(false);
            }
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
                // await funcionaparaverificarclienteexiste(value);
            }
        }
    };




    // // Función para manejar cambios en los inputs
    // const handleChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setDatos((prevDatos) => ({
    //         ...prevDatos,
    //         [name]: value,
    //     }));
    // };


    //Nombres forma directa individual
    // const [Nombres, setNombres] = React.useState('');
    // const handleChangeNombres = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setNombres(event.target.value);
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
                            valorname='TipoDocumento'
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

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </Card>
    );
};