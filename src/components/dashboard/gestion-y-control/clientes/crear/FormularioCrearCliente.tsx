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


const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const Barrios = [
    { value: '1', label: 'Pupular1' }
]

export function FormularioCrearCliente(): React.JSX.Element {

    //Se maneja el estado para todos los campos
    const [datos, setDatos] = React.useState({
        Nombre: '',
        TipoIdentificacion: '4',
        Identificacion: '',
        Direccion: '',
        Telefono: '',
        Celular: '',
        Correo: '',
        EstadoCliente: '1',
    });

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'Nombre', mensaje: 'El nombre es obligatorio.' },
        { campo: 'Identificacion', mensaje: 'La identificación es obligatoria.' },
        { campo: 'Direccion', mensaje: 'La dirección es obligatoria.' },
        { campo: 'Telefono', mensaje: 'El teléfono es obligatorio.' },
        { campo: 'Celular', mensaje: 'El celular es obligatorio y debe ser un número válido de 10 dígitos.' },
        { campo: 'Correo', mensaje: 'El correo es obligatorio y debe ser válido.' },
        { campo: 'EstadoCliente', mensaje: 'El estado es obligatorio' }
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
                const data = await crearCliente(datos);
                clearInterval(progressInterval); // Limpiar intervalo
                setProgress(100);

                mostrarMensaje('Cliente creado exitosamente', 'success');

                // Limpiar formulario
                setDatos({
                    Nombre: '',
                    TipoIdentificacion: '4',
                    Identificacion: '',
                    Direccion: '',
                    Telefono: '',
                    Celular: '',
                    Correo: '',
                    EstadoCliente: '1',
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

    // Función para verificar si el cliente ya existe
    const verificarClienteExistente = async (identificacion: string) => {
        if (!identificacion) return; // Si no hay identificación, no consultar

        const result = await verificarClienteExistenteService(identificacion);

        if (result) {
            mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
            console.log('Cliente encontrado:');
        };
    };

    //Función para manejar el cambio en los inputs
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));

        if (name === 'Identificacion') {
            if (value.trim() !== '') {
                console.log(value);
                await verificarClienteExistente(value);
            }
        }

        if (name === 'Correo') {
            // const esValido = await formularioRef.current?.manejarValidacion();
        }
    };


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
                            value={datos.EstadoCliente}
                            options={EstadoCliente}
                            size='small'
                            onChange={handleChange}
                            valorname='Estado'
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