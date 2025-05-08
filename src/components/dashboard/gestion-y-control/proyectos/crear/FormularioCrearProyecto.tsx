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
import { ListarClientes } from '@/services/generales/ListarClientesService';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { CrearProyecto } from '@/services/gestionycontrol/proyectos/CrearProyectoService';
import { UserContext } from '@/contexts/user-context';




const EstadoProyecto = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const Clientess = [
    { id: '100', value: '1', label: 'Emrpesa1' },
    { id: '101', value: '2', label: 'Empresa2' },
]

interface Client {
    IdCliente: number;
    DocumentoCliente: string;
    NombreCliente: string;
};

export function FormularioCrearProyecto(): React.JSX.Element {
    // Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    // Obtener el nombre del usuario, si existe
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

    //Se maneja el estado de todos los campos del formulario
    const [datos, setDatos] = React.useState({
        NombreProyecto: '',
        DocumentoCliente: '333',
        DireccionProyecto: '',
        UsuarioCreacion: documentoUsuarioActivo,
        EstadoProyecto: '1'
    });

    //Función para manejar el cambio en los inputs
    const handleChange = async (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };

    // Crear una referencia para el FormularioValidator
    const formularioRef = React.useRef<{ manejarValidacion: () => void }>(null);
    const handleCrearProyecto = async () => {
        //Se valida el formulario
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            let progressInterval: NodeJS.Timeout | null = null;
            try {
                const data = await CrearProyecto(datos);
                mostrarMensaje('Proyecto creado exitosamente', 'success');
                setDatos({
                    NombreProyecto: '',
                    DocumentoCliente: '333',
                    DireccionProyecto: '',
                    UsuarioCreacion: documentoUsuarioActivo,
                    EstadoProyecto: '1'
                });
            } catch (error) {
                mostrarMensaje(`Error al crear el proyecto: ${error}`, 'error');
            }
        }
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

    // const [Clientes, setClientes] = React.useState<Client[]>([]);
    const [Clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([{ value: 'ClienteX', label: 'ClienteX' }]);


    const [valorSeleccionado, setValorSeleccionado] = React.useState<string | number>('');

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'NombreProyecto', mensaje: 'El nombre del proyecto es obligatorio.' },
        { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
        { campo: 'DireccionProyecto', mensaje: 'La dirección es obligatoria.' },
        { campo: 'EstadoProyecto', mensaje: 'El estado es obligatorio' },
    ];
    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);
    };


    const Listar = async () => {
        try {
            const data = await ListarClientes();
            // console.log(data);

            // Verifica si los datos ya están en el formato correcto
            setClientes(data); // Establece los datos directamente

            // Establece un valor por defecto basado en los datos de la base de datos
            if (data.length > 0) {
                setValorSeleccionado(data[0].value); // Marca el primer cliente como seleccionado por defecto
            }
        } catch (error) {
            console.error('Error al listar clientes:', error);
        }
    };

    // Llama a la función Listar cuando sea necesario, por ejemplo, en un useEffect
    React.useEffect(() => {
        Listar();
    }, []);


    const handleChangee = (event: SelectChangeEvent<string | number>) => {
        setValorSeleccionado(event.target.value as string | number); // Actualiza el valor seleccionado
    };

    return (
        <Card>
            <CardHeader
                title="Creación de proyecto" size="small"
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
                            label='Nombre'
                            value={datos.NombreProyecto}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='NombreProyecto'
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa/Cliente'
                            // value={String(valorSeleccionado)}
                            value={datos.DocumentoCliente}
                            options={Clientes}
                            size='small'
                            onChange={handleChange}
                            valorname='DocumentoCliente'
                        />
                    </Grid>
                    <Grid md={4} xs={12} mt={0.5}>
                        <Input
                            label='Dirección'
                            value={datos.DireccionProyecto}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='DireccionProyecto'
                        />
                    </Grid>
                    <Grid md={2} xs={12} mt={0.5}>
                        <InputSelect
                            label='Estado'
                            value={datos.EstadoProyecto}
                            options={EstadoProyecto}
                            size='small'
                            valorname='EstadoProyecto'
                            // onChange={handleChangeEstado}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrearProyecto}>
                    Crear proyecto
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