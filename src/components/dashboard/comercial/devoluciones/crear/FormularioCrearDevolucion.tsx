'use client';

import { useSocketIO } from '@/hooks/use-WebSocket';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import { UserContext } from '@/contexts/user-context';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import InputSelect from '../../../componentes_generales/formulario/Select';
// Imports para mostrar info de la bd
import { ConsultarSiguienteNoDevolucion } from '@/services/comercial/devoluciones/ConsultarSiguienteNoDevolucionService';
import { CrearDevolucion } from '@/services/comercial/devoluciones/CrearDevolucionService';
import { MostrarItemsRemision } from '@/services/comercial/devoluciones/MostrarItemsRemisionService';
import { VerRemisionesCliente } from '@/services/comercial/devoluciones/VerRemisionesClienteService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { padding } from '@mui/system';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';


// 1. Interfaces
// interface Devolucion {
//     Cliente: string;
//     NoDevolucion: string;
//     UsuarioCreacion: string;
// }


// 1. INTERFACES
interface Devolucion {
    NoDevolucion: string;
    Cliente: string;
    IdRemision?: number | null; // Añadir remisión asociada
    IdProyecto?: number | null; // Proyecto específico
    Observaciones: string;
    UsuarioCreacion: string;
    EstadoEquipo: number;
    IdEstado: number;
    PersonaQueRecibe: string;
    PersonaQueEntrega: string;
    FechaDevolucion: Dayjs;
}

interface ItemDevolucion {
    IdEquipo: string;
    NombreEquipo?: string;
    CantidadArrendada: number;
    CantidadPendiente: string;
    CantidadADevolver: number;
    EstadoEquipo: number;
    // Motivo?: string;
    Observaciones?: string;
    IdRemision?: string; // Añadir ID de remisión asociada
}

interface DevolucionEnvio {
    IdRemision: number | null;
    NoDevolucion: string;
    DocumentoCliente: string;
    IdProyecto: number;
    Observaciones: string;
    UsuarioCreacion: string;
    IdEstado: number;
    PersonaQueRecibe: string;
    PersonaQueEntrega: string;
    Detalles: ItemDevolucion[];
}

interface Option {
    value: string | number;
    label: string;
}

// 2. COMPONENTE PRINCIPAL
export function FormularioCrearDevolucion(): React.JSX.Element {
    // 3. HOOKS DE REACT Y OTROS HOOKS DE LIBRERÍAS
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const { sendMessage, messages } = useSocketIO();

    // 4. ESTADOS
    const [datos, setDatos] = React.useState<Devolucion>({
        Cliente: '',
        NoDevolucion: '', // Temporal, luego se consulta a la API
        Observaciones: '',
        UsuarioCreacion: documentoUsuarioActivo ?? '',
        EstadoEquipo: -1,
        IdEstado: 8,
        PersonaQueRecibe: '',
        PersonaQueEntrega: '',
        FechaDevolucion: dayjs()
    });

    const [clientes, setClientes] = React.useState<Option[]>([]);
    const [proyectos, setProyectos] = React.useState<Option[]>([]);
    const [remisiones, setRemisiones] = React.useState<Option[]>([]);
    const [itemsRemision, setItemsRemision] = React.useState<ItemDevolucion[]>([]);

    //Para el manejo de las notificiones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

    // 5. USEEFFECT PARA LA CARGA INICIAL Y SOCKETS
    // Cargar remisiones pendientes cuando se selecciona cliente y proyecto
    React.useEffect(() => {
        ObtenerClientes();
        CargarEstados();
        CargarSiguienteNoDevolucion();
    }, []);

    React.useEffect(() => {
        ObtenerProyectosDelCliente();
        setDatos(prev => ({
            ...prev,
            Prueba: `DocCliente: ${datos.Cliente} - IdProyec: ${datos.IdProyecto}`
        }))
    }, [datos.Cliente, datos.IdProyecto])

    React.useEffect(() => {
        if (datos.Cliente && datos.IdProyecto) {
            cargarRemisionesPendientes(datos.Cliente, datos.IdProyecto);
        }
    }, [datos.Cliente, datos.IdProyecto]);

    React.useEffect(() => {
        setDatos(prev => ({ ...prev, Remision: '' }));
        setItemsRemision([]);
    }, [datos.IdProyecto]);

    React.useEffect(() => {
        if (messages.length > 0) {
            const UltimoMensaje = messages[messages.length - 1];
            if (UltimoMensaje.tipo === 'devolucion-creada') {
                CargarSiguienteNoDevolucion();
            }
        }
    }, [messages]);

    // 6. FUNCIONES DEL COMPONENTE
    const cargarRemisionesPendientes = async (clienteId: string, proyectoId: number) => {
        try {
            // Implementar servicio que consulte remisiones con items pendientes
            // const res = await ListarRemisionesPendientes(clienteId, proyectoId);
            // setRemisiones(res);
            const Remisiones = await VerRemisionesCliente(clienteId, proyectoId);
            setRemisiones(Remisiones);
        } catch (error) {
            console.error('Error al cargar remisiones:', error);
        }
    };

    // Cargar siguiente no devolución
    const CargarSiguienteNoDevolucion = async () => {
        try {
            const SiguienteNoDevolucion = await ConsultarSiguienteNoDevolucion();
            setDatos(prev => ({
                ...prev, NoDevolucion: SiguienteNoDevolucion[0].SiguienteNoDevolucion
            }));
        } catch (error) {
            console.error('Error al consultar el siguiente número de devolución: ', error);
        }
    };
    // ...

    // Cargar los clientes
    const ObtenerClientes = async () => {
        try {
            const Clientes = await ListarClientes();
            setClientes(Clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    // Cargar proyectos según el cliente seleccionado
    const ObtenerProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.Cliente
            }
            const Proyectos = await ListarProyectos(DocumentoCliente);
            setProyectos(Proyectos);
        } catch (error) {
            console.error('Error al obtener los proyectos del cliente:', error);
        }
    }

    // Cargar items cuando se selecciona una remisión
    const cargarItemsRemision = async (remisionId: string) => {
        try {
            const ItemsRemision = await MostrarItemsRemision(remisionId);
            // Inicializar cada ítem con EstadoEquipo en -1
            const itemsConEstadoInicial = ItemsRemision.map((item: any) => ({
                ...item,
                EstadoEquipo: -1, // Valor inicial
                CantidadADevolver: ''
            }));

            setItemsRemision(itemsConEstadoInicial);
        } catch (error) {
            console.error('Error al cargar items:', error);
        }
    };

    // Cargar estados
    const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarEstados = async () => {
        try {
            const Estados = await ListarEstados();
            const estadosPermitidos = new Set(['buen estado', 'dañado', 'perdido']);
            const NuevosEstados = Estados.filter((element: any) =>
                estadosPermitidos.has(element.label.toLowerCase().trim())
            );
            NuevosEstados.unshift(
                { value: -1, label: 'Sin seleccionar' }
            );
            setEstados(NuevosEstados);
        } catch (error) {
            console.error('Erro al listar los estados: ', error);
        }
    };
    // ...

    // Cargar profesionales / persona que recibe el equipo
    const [profesionales, setProfesionales] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarProfesionales = async () => {
        try {
            const Profesionales = await ListarProfesionalesPertenecientes();
            setProfesionales(Profesionales);
        } catch (error) {
            console.error(`Error al cargar los profesionales: ${error}`);
        }
    }
    // ...

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));

        // Resetear proyectos si cambia el cliente
        if (name === 'Cliente' && value !== datos.Cliente) {
            setDatos(prev => ({ ...prev, Proyecto: '', Remision: '' }));
            setProyectos([]);
            setRemisiones([]);
            setItemsRemision([]);
        }

        // Cargar items si se selecciona una remisión
        if (name === 'IdRemision') {
            cargarItemsRemision(value);
            CargarProfesionales();
        }
    };

    // ✅ Manejador específico para el DateTimePicker
    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaDevolucion: fecha || dayjs() }));
    };

    // Función para mostrar mensaje
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    // ...

    const actualizarCantidadADevolver = (idEquipo: string, nuevaCantidad: number) => {
        setItemsRemision(prevItems =>
            prevItems.map(item => {
                if (item.IdEquipo === idEquipo) {
                    const cantidadMaxima = item.CantidadPendiente;
                    const cantidadFinal = Math.min(
                        Math.max(nuevaCantidad, 0), // No menor a 0
                        Number(cantidadMaxima)             // No mayor al pendiente
                    );
                    return { ...item, CantidadADevolver: cantidadFinal };
                }
                return item;
            })
        );
    };
    // ...

    const prepararDatosEnvio = (): DevolucionEnvio | null => {
        // Validaciones básicas
        if (!datos.Cliente || !datos.IdProyecto || !datos.IdRemision) {
            console.error('Faltan datos requeridos');
            return null;
        }

        // Filtrar solo items con cantidad a devolver > 0
        const itemsAEnviar = itemsRemision.filter(item => item.CantidadADevolver > 0);

        if (itemsAEnviar.length === 0) {
            console.error('No hay items para devolver');
            mostrarMensaje('Debe ingresar una cantidad y seleccionar un estado válido', 'error');
            return null;
        }

        // Validar que todos los items tengan estado seleccionado
        const itemsInvalidos = itemsAEnviar.some(item => item.EstadoEquipo === -1);
        if (itemsInvalidos) {
            console.error('Algunos items no tienen estado seleccionado');
            mostrarMensaje('Algunos items no tienen estado válido seleccionado', 'error');
            return null;
        }

        return {
            NoDevolucion: datos.NoDevolucion,
            DocumentoCliente: datos.Cliente,
            IdRemision: datos.IdRemision,
            IdProyecto: datos.IdProyecto,
            Observaciones: datos.Observaciones,
            UsuarioCreacion: datos.UsuarioCreacion,
            IdEstado: datos.IdEstado,
            PersonaQueRecibe: datos.PersonaQueRecibe,
            PersonaQueEntrega: datos.PersonaQueEntrega,
            Detalles: itemsAEnviar.map(item => ({
                // IdEquipo: item.IdEquipo,
                // CantidadADevolver: item.CantidadADevolver,
                // EstadoEquipo: item.EstadoEquipo,
                // // Opcionales:
                // // Motivo: item.Motivo ?? '',
                // Observaciones: item.Observaciones ?? '',
                // IdRemision: datos.Remision // Asociar a la remisión
                IdEquipo: item.IdEquipo,
                NombreEquipo: item.NombreEquipo, // <-- incluir
                CantidadArrendada: item.CantidadArrendada, // <-- incluir
                CantidadPendiente: item.CantidadPendiente, // <-- incluir
                CantidadADevolver: item.CantidadADevolver,
                EstadoEquipo: item.EstadoEquipo,
                //   Motivo: item.Motivo ?? '',
                Observaciones: item.Observaciones ?? '',
                // IdRemision: datos.Remision ?? ''
            }))
        };
    };

    const handleEnviarDevolucion = async () => {
        const datosEnvio = prepararDatosEnvio();

        if (!datosEnvio) {
            // Mostrar error al usuario
            // alert('Por favor complete todos los campos requeridos');
            return null;
        }

        try {
            // Aquí iría tu servicio para enviar la devolución
            // const resultado = await CrearDevolucionService(datosEnvio);

            // console.log('Datos listos para enviar:', datosEnvio);
            await CrearDevolucion(datosEnvio);
            mostrarMensaje('Devolución creada correctamente', 'success');
            sendMessage('devolucion-creada', {});


            // Resetear formulario después de enviar
            resetearFormulario();
        } catch (error) {
            console.error('Error al enviar devolución:', error);
            mostrarMensaje(`Hubo un error al crear la devolución: ${error}`, 'error');
        }
    };
    // ...


    // Función para resetear
    const resetearFormulario = () => {
        // 1. Limpiar items
        setItemsRemision([]);

        // 2. Resetear datos principales
        setDatos(prev => ({
            ...prev,
            IdRemision: null,
            // IdProyecto: null,
            Observaciones: '',
            UsuarioCreacion: user?.documento ?? '', // Mantener usuario si es necesario
            IdEstado: 8, // Estado inicial por defecto
            PersonaQueEntrega: '',
            PersonaQueRecibe: ''
        }));

        // 3. Si tienes otros estados relacionados, resetealos también
        // setOtroEstado(valorInicial);
    };
    // ...
    const actualizarEstadoEntregaEquipo = (idEquipo: string, nuevoEstadoEntregaEquipo: number) => {
        setItemsRemision(prevItems =>
            prevItems.map(item =>
                item.IdEquipo === idEquipo
                    ? { ...item, EstadoEquipo: nuevoEstadoEntregaEquipo }
                    : item
            )
        );
    };
    // ...

    // Función para verificar si todos los items están en 0 para pendiente
    const todosItemsSinPendiente = itemsRemision.length > 0 &&
        itemsRemision.every(item =>
            item.CantidadPendiente === '0' ||
            Number(item.CantidadPendiente) <= 0
        );
    // ...

    // Función para mostrar la fecha y la hora seleccionada
    const MostrarFechaHora = async () => {
                console.log(datos.FechaDevolucion.toString())
    }
    // ...


    // 7. RENDERIZADO JSX DEL COMPONENTE
    return (
        <>
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
            <Card>
                {/* Cabecera */}
                <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                    <Typography variant="subtitle1" color="text.primary">
                        Creación de devolución
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                        <Input
                            label='Devolución No:'
                            value={datos.NoDevolucion}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='NoDevolucion'
                        />
                    </Typography>
                </Box>
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid md={4} xs={12}>
                            <FechayHora
                                label="Fecha y hora"
                                value={datos.FechaDevolucion}
                                onChange={handleFechaChange}
                            />
                        </Grid>

                        {/* Selector de Cliente */}
                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Cliente"
                                value={datos.Cliente}
                                options={clientes}
                                onChange={handleChange}
                                valorname="Cliente"
                            />
                        </Grid>

                        {/* Selector de Proyecto (solo si hay cliente seleccionado) */}
                        {/* {datos.Cliente && (
                            <Grid md={4} xs={12}>
                                <InputSelect
                                    label="Proyecto"
                                    value={Number(datos.IdProyecto)}
                                    options={proyectos}
                                    onChange={handleChange}
                                    valorname="IdProyecto"
                                />
                            </Grid>
                        )} */}
                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Proyecto"
                                value={Number(datos.IdProyecto)}
                                options={proyectos}
                                onChange={handleChange}
                                valorname="IdProyecto"
                            />
                        </Grid>

                        {/* Selector de Remisión (solo si hay proyecto seleccionado) */}
                        {/* {datos.IdProyecto && (
                            <Grid md={4} xs={12}>
                                <InputSelect
                                    label="Remisión No"
                                    value={Number(datos.IdRemision)}
                                    options={remisiones}
                                    onChange={handleChange}
                                    valorname="IdRemision"
                                />
                            </Grid>
                        )} */}
                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Remisión No"
                                value={Number(datos.IdRemision)}
                                options={remisiones}
                                onChange={handleChange}
                                valorname="IdRemision"
                            />
                        </Grid>

                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Subarrendatario"
                                value={Number(datos.IdRemision)}
                                options={remisiones}
                                onChange={handleChange}
                                valorname="IdRemision"
                            />
                        </Grid>
                    </Grid>

                    {/* Lista de Items (solo si hay remisión seleccionada) */}
                    {itemsRemision.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h6">Items a devolver</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Equipo</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Arrendado</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Pendiente</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000', width: '15%' }}>A Devolver</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important', width: { xs: '18%', md: '20%' } }}>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody
                                    >
                                        {itemsRemision.map((item) => (
                                            <TableRow
                                                key={item.IdEquipo}
                                                sx={{ padding: { xs: '6px 8px', md: '8px 12px' } }}
                                            >
                                                <TableCell>{item.NombreEquipo}</TableCell>
                                                <TableCell>{item.CantidadArrendada}</TableCell>
                                                <TableCell>{item.CantidadPendiente}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        label=""
                                                        tipo_input="number"
                                                        value={item.CantidadADevolver || ''}
                                                        tamano="small"
                                                        onChange={(e) => {
                                                            const raw = e.target.value;

                                                            // Evita ceros a la izquierda (si el número tiene más de 1 dígito y empieza con 0)
                                                            const limpio = raw.replace(/^0+(?=\d)/, '');

                                                            // Conviértelo a número seguro (0 si vacío o NaN)
                                                            const numero = limpio === '' ? 0 : parseInt(limpio, 10);

                                                            actualizarCantidadADevolver(item.IdEquipo, numero);
                                                        }}
                                                        bloqueado={item.CantidadPendiente === '0'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <InputSelect
                                                        label=""
                                                        value={item.EstadoEquipo} // <-- Usar el estado del ítem individual
                                                        options={estados}
                                                        onChange={(e) => {
                                                            const nuevoEstado = parseInt(e.target.value);
                                                            actualizarEstadoEntregaEquipo(item.IdEquipo, nuevoEstado);
                                                        }}
                                                        valorname={`EstadoEquipo-${item.IdEquipo}`} // Nombre único por ítem
                                                        bloqueado={item.CantidadPendiente === '0'}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid md={6} xs={12} mt={0.5} >
                                <Input
                                    label='Observaciones'
                                    value={datos.Observaciones}
                                    onChange={handleChange}
                                    // required
                                    tamano='small'
                                    tipo_input='textarea'
                                    valorname='Observaciones'
                                    bloqueado={todosItemsSinPendiente}
                                />
                            </Grid>
                            <Grid container spacing={2} mt={.5}>
                                <Grid md={4} xs={12} >
                                    <InputSelect
                                        label="Recibe"
                                        value={datos.PersonaQueRecibe} // <-- Usar el estado del ítem individua)l
                                        options={profesionales}
                                        onChange={handleChange}
                                        valorname="PersonaQueRecibe"
                                        bloqueado={todosItemsSinPendiente}
                                    />
                                </Grid>
                                <Grid md={4} xs={12} >
                                    <Input
                                        label='Entrega'
                                        value={datos.PersonaQueEntrega}
                                        onChange={handleChange}
                                        // required
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='PersonaQueEntrega'
                                        bloqueado={todosItemsSinPendiente}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <Button variant='contained' onClick={MostrarFechaHora}>
                        Mostrar Fecha con hora
                    </Button>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleEnviarDevolucion} disabled={itemsRemision.length === 0 || todosItemsSinPendiente}>
                        Crear devolución
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
