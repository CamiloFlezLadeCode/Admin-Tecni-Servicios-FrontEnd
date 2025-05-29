'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { UserContext } from '@/contexts/user-context';
import { CrearEquipo } from '@/services/gestionycontrol/equipos/CrearEquipoService';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { Typography } from '@mui/material';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';

const EstadoEquipo = [
    { value: '3', label: 'Disponible' },
    { value: '4', label: 'No disponible' },
    { value: '5', label: 'Reparación' },
]

const Caracteristica = [
    { value: '1', label: 'Alquiler' },
    { value: '2', label: 'Venta' },
    { value: '3', label: 'Reparación' },
]

const Categorias = [
    { value: '1', label: 'ACCESORIOS' },
    { value: '2', label: 'ANDAMIOS DE CARGA - SISTEMA DALMINE' },
    { value: '3', label: 'ANDAMIOS Y COMPLEMENTARIOS' },
    { value: '4', label: 'BROCAS - MUELAS - CINCELES - DISCOS' },
    { value: '5', label: 'COBROS Y REPARACIONES' },
    { value: '6', label: 'COMPRESORES PARA AIRE - PINTURA' },
    { value: '7', label: 'EQUIPO ELECTROMECÁNICO VARIOS' },
    { value: '8', label: 'EQUIPO PARA VACIADO DE CONCRETO' },
    { value: '9', label: 'EQUIPOS PARA COMPACTACIÓN' },
    { value: '10', label: 'EQUIPOS PARA CORTE' },
    { value: '11', label: 'EQUIPOS PARA DEMOLICIÓN' },
    { value: '12', label: 'EQUIPOS PARA ELEVACIÓN - ARRASTRE ' },
    { value: '13', label: 'EQUIPOS PARA GENERACIÓN DE ENERGIA ' },
    { value: '14', label: 'EQUIPOS PARA JARDINERIA' },
    { value: '15', label: 'EQUIPOS PARA TRABAJOS EN ALTURAS' },
    { value: '16', label: 'FORMALETERIA MAN HOLE - SUMIDERO' },
    { value: '17', label: 'FORMALETERIA PARA COLUMNA' },
    { value: '18', label: 'FORMALETERIA PARA LOSA' },
    { value: '19', label: 'FORMALETERIA PARA MURO' },
    { value: '20', label: 'FORMALETERIA VARIOS' },
    { value: '21', label: 'HERRAMIENTA MENOR - OTROS' },
    { value: '22', label: 'MAQUINARIA PESADA' },
    { value: '23', label: 'MOTOBOMBAS Y COMPLEMENTARIOS' },
    { value: '24', label: 'SOLDADORES Y COMPLEMENTARIOS' },
    { value: '25', label: 'TALADROS' },
    { value: '26', label: 'TRANSPORTE' },
    { value: '27', label: 'VENTAS' },
]


export function FormularioCrearEquipo(): React.JSX.Element {
    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    //Arreglo para manejar el estado de todos los campos
    const [datos, setDatos] = React.useState({
        NombreEquipo: '',
        CategoriaEquipo: '1',
        PrecioVenta: '',
        PrecioAlquiler: '',
        PrecioReparacion: '',
        UsuarioCreacion: documentoUsuarioActivo,
        EstadoEquipo: '3'
    });

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'NombreEquipo', mensaje: 'El nombre es obligatorio.' },
        { campo: 'CategoriaEquipo', mensaje: 'La categoria es obligatoria.' },
        { campo: 'PrecioReparacion', mensaje: 'El precio de reparación es obligatorio.' },
        { campo: 'EstadoEquipo', mensaje: 'El estado es obligatorio.' },
    ];

    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);
    };

    // Crear una referencia para el FormularioValidator
    const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);

    const [progress, setProgress] = React.useState(0);
    const [cargando, setCargando] = React.useState<boolean>(false);
    const handleCrearEquipo = async () => {
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
                const data = await CrearEquipo(datos);
                clearInterval(progressInterval); // Limpiar intervalo
                setProgress(100);

                mostrarMensaje('Equipo creado exitosamente', 'success');

                // Limpiar formulario
                setDatos({
                    NombreEquipo: '',
                    CategoriaEquipo: '1',
                    PrecioVenta: '',
                    PrecioAlquiler: '',
                    PrecioReparacion: '',
                    UsuarioCreacion: documentoUsuarioActivo,
                    EstadoEquipo: '3'
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
    // const verificarClienteExistente = async (identificacion: string) => {
    //     if (!identificacion) return; // Si no hay identificación, no consultar

    //     const result = await verificarClienteExistenteService(identificacion);

    //     if (result) {
    //         mostrarMensaje('El cliente ya se encuentra registrado.', 'error');
    //         console.log('Cliente encontrado:');
    //     };
    // };

    //Función para manejar el cambio en los inputs
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };


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

    //Llenado para el select del subarrendatario
    const [subarrendatario, setSubarrendatario] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarSubarrendatarios = async () => {
        try {
            const Subarrendatarios = await ListarSubarrendatarios();
            setSubarrendatario(Subarrendatarios);
        } catch (error) {
            console.error('Error al listar los subarrendatarios: ', error);
        }
    };
    //...

    React.useEffect(() => {
        CargarSubarrendatarios();
    }, []);

    return (
        <Card>
            {/* <CardHeader
                title="Creación de equipo"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            /> */}
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de equipo</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            label='Referencia'
                            value={datos.CategoriaEquipo}
                            options={Categorias}
                            size='small'
                            onChange={handleChange}
                            valorname='CategoriaEquipo'
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Nombre'
                            value={datos.NombreEquipo}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='NombreEquipo'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Subarrendatario'
                            value={datos.EstadoEquipo}
                            options={subarrendatario}
                            size='small'
                            onChange={handleChange}
                            valorname='EstadoEquipo'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Precio Venta'
                            value={datos.PrecioVenta}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='PrecioVenta'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Precio Alquiler'
                            value={datos.PrecioAlquiler}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='PrecioAlquiler'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <Input
                            label='Precio Reparación'
                            value={datos.PrecioReparacion}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='PrecioReparacion'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Estado'
                            value={datos.EstadoEquipo}
                            options={EstadoEquipo}
                            size='small'
                            onChange={handleChange}
                            valorname='EstadoEquipo'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearEquipo}>
                    Crear equipo
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
}