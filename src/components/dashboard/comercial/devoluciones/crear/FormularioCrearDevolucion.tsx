'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import { UserContext } from '@/contexts/user-context';
import { useSocketIO } from '@/hooks/use-WebSocket';
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
// Servicios
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import { ConsultarSiguienteNoDevolucion } from '@/services/comercial/devoluciones/ConsultarSiguienteNoDevolucionService';
import { CrearDevolucion } from '@/services/comercial/devoluciones/CrearDevolucionService';
import { ConsultarSubarrendatariosConRemisionesAsignadasClienteProyecto } from '@/services/comercial/devoluciones/VerSubarrendatariosConRemisionesAsignadasClienteProyectoService';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import dayjs, { Dayjs } from 'dayjs';
import { equipos_pendientes_por_devolver } from '@/services/comercial/devoluciones/EquiposPendientesPorDevolverService';
import { OrdenarSubarrendatarios } from '@/lib/order/orders';
import { OpcionPorDefecto, OpcionPorDefectoNumber } from '@/lib/constants/option-default';


// 1. INTERFACES
interface Devolucion {
    NoDevolucion: string;
    Cliente: string;
    IdProyecto?: number | null;
    Observaciones: string;
    UsuarioCreacion: string;
    EstadoEquipo: number;
    IdEstado: number;
    PersonaQueRecibe: string;
    PersonaQueEntrega: string;
    FechaDevolucion: Dayjs;
    Subarrendatario: string;
    IncluyeTransporte: boolean | null;
    ValorTransporte: number;
}

interface ItemDevolucion {
    IdEquipo: string;
    NombreEquipo?: string;
    CantidadArrendada: number;
    CantidadPendiente: string;
    CantidadADevolver: number;
    EstadoEquipo: number;
    Observaciones?: string;
    IdRemision: string; // Cambiado a obligatorio
    NoRemision?: string;
    Descripcion?: string;
}

interface DevolucionEnvio {
    IdRemision: string | null; // Cambiar a null ya que no hay remisión principal
    NoDevolucion: string;
    DocumentoCliente: string;
    IdProyecto: number;
    Observaciones: string;
    UsuarioCreacion: string;
    IdEstado: number;
    PersonaQueRecibe: string;
    PersonaQueEntrega: string;
    Detalles: ItemDevolucion[];
    FechaDevolucion: string;
    DocumentoSubarrendatario: string;
    IncluyeTransporte: boolean | null;
    ValorTransporte: number;
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
        Cliente: OpcionPorDefecto.value,
        NoDevolucion: '',
        Observaciones: '',
        UsuarioCreacion: documentoUsuarioActivo ?? '',
        EstadoEquipo: -1,
        IdEstado: 8,
        PersonaQueRecibe: OpcionPorDefecto.value,
        PersonaQueEntrega: '',
        FechaDevolucion: dayjs(),
        Subarrendatario: '',
        IncluyeTransporte: null,
        ValorTransporte: 0
    });

    const [clientes, setClientes] = React.useState<Option[]>([]);
    const [proyectos, setProyectos] = React.useState<Option[]>([]);
    const [itemsRemision, setItemsRemision] = React.useState<ItemDevolucion[]>([]);
    const [subarrendatarios, setSubarrendatarios] = React.useState<Option[]>([]);
    const [profesionales, setProfesionales] = React.useState<Option[]>([]);
    const [estados, setEstados] = React.useState<Option[]>([]);

    // Para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // 5. USEEFFECT PARA LA CARGA INICIAL Y SOCKETS
    React.useEffect(() => {
        ObtenerClientes();
        CargarEstados();
        CargarSiguienteNoDevolucion();
    }, []);

    React.useEffect(() => {
        if (datos.Cliente) {
            ObtenerProyectosDelCliente();
        }
    }, [datos.Cliente]);

    React.useEffect(() => {
        if (datos.Cliente && datos.IdProyecto) {
            CargarSubarrendatariosConRemisionesAsignadasClienteProyecto();
        }
    }, [datos.Cliente, datos.IdProyecto]);

    React.useEffect(() => {
        // Limpiar items cuando cambia el proyecto
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

    React.useEffect(() => {
        if (datos.Subarrendatario && datos.IdProyecto) {
            cargarEquiposPendientesPorDevolver();
        }
    }, [datos.Subarrendatario, datos.IdProyecto]);

    // 6. FUNCIONES DEL COMPONENTE
    const CargarSubarrendatariosConRemisionesAsignadasClienteProyecto = async () => {
        try {
            const SubarrendatariosConRemisionesAsignadas = await ConsultarSubarrendatariosConRemisionesAsignadasClienteProyecto({
                DocumentoCliente: datos.Cliente,
                IdProyecto: datos.IdProyecto
            });
            setSubarrendatarios(await OrdenarSubarrendatarios({ AllSubarrendatarios: SubarrendatariosConRemisionesAsignadas }));
        } catch (error) {
            console.error(`Error al consultar subarrendatarios: ${error}`);
        }
    }

    const CargarSiguienteNoDevolucion = async () => {
        try {
            const SiguienteNoDevolucion = await ConsultarSiguienteNoDevolucion();
            setDatos(prev => ({
                ...prev,
                NoDevolucion: SiguienteNoDevolucion[0].SiguienteNoDevolucion
            }));
        } catch (error) {
            console.error('Error al consultar el siguiente número de devolución: ', error);
            mostrarMensaje('Error al cargar número de devolución', 'error');
        }
    };

    const ObtenerClientes = async () => {
        try {
            const Clientes = await ListarClientes();
            Clientes.unshift(OpcionPorDefecto)
            setClientes(Clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            mostrarMensaje('Error al cargar clientes', 'error');
        }
    };

    const ObtenerProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.Cliente
            }
            const Proyectos = await ListarProyectos(DocumentoCliente);
            setProyectos(Proyectos);
        } catch (error) {
            console.error('Error al obtener los proyectos del cliente:', error);
            mostrarMensaje('Error al cargar proyectos', 'error');
        }
    }

    const cargarEquiposPendientesPorDevolver = async () => {
        try {
            const EquiposPendientes = await equipos_pendientes_por_devolver({
                IdProyecto: datos.IdProyecto,
                DocumentoSubarrendatario: datos.Subarrendatario
            });

            const equiposConEstadoInicial = EquiposPendientes.map((equipo: any) => ({
                ...equipo,
                EstadoEquipo: -1,
                CantidadADevolver: 0,
                IdRemision: equipo.IdRemision // Usar el IdRemision que viene del servicio
            }));

            setItemsRemision(equiposConEstadoInicial);
        } catch (error) {
            console.error(`Error al buscar equipos pendientes por devolver: ${error}`);
            mostrarMensaje('Error al cargar equipos pendientes', 'error');
        }
    }

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
            console.error('Error al listar los estados: ', error);
            mostrarMensaje('Error al cargar estados', 'error');
        }
    };

    const CargarProfesionales = async () => {
        try {
            const Profesionales = await ListarProfesionalesPertenecientes();
            Profesionales.unshift(
                OpcionPorDefecto
            );
            setProfesionales(Profesionales);
        } catch (error) {
            console.error(`Error al cargar los profesionales: ${error}`);
            mostrarMensaje('Error al cargar profesionales', 'error');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;

        // Manejar diferentes tipos de campos
        if (name === 'IdProyecto') {
            const nuevoIdProyecto = value === '' ? null : Number(value);

            if (nuevoIdProyecto !== datos.IdProyecto) {
                setDatos(prev => ({
                    ...prev,
                    IdProyecto: nuevoIdProyecto,
                    Subarrendatario: ''
                }));
                setItemsRemision([]);
            } else {
                setDatos(prev => ({ ...prev, IdProyecto: nuevoIdProyecto }));
            }
            return;
        }

        if (name === 'IncluyeTransporte') {
            const nuevoValor = value === 'SI';
            setDatos(prev => ({
                ...prev,
                IncluyeTransporte: nuevoValor,
                ValorTransporte: nuevoValor === false ? 0 : prev.ValorTransporte
            }));
            return;
        }

        // Para otros campos que son strings
        setDatos(prev => ({ ...prev, [name]: value }));

        // Resetear proyectos si cambia el cliente
        if (name === 'Cliente' && value !== datos.Cliente) {
            setDatos(prev => ({
                ...prev,
                IdProyecto: null,
                Subarrendatario: ''
            }));
            setProyectos([]);
            setItemsRemision([]);
            setSubarrendatarios([]);
        }

        if (name === 'Subarrendatario') {
            if (value) {
                CargarProfesionales();
            } else {
                setItemsRemision([]);
            }
        }
    };

    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaDevolucion: fecha || dayjs() }));
    };

    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    const actualizarCantidadADevolver = (idCompuesto: string, nuevaCantidad: number) => {
        setItemsRemision(prevItems =>
            prevItems.map(item => {
                const itemIdCompuesto = `${item.IdEquipo}-${item.IdRemision}`;

                if (itemIdCompuesto === idCompuesto) {
                    const cantidadMaxima = item.CantidadPendiente;
                    const cantidadFinal = Math.min(
                        Math.max(nuevaCantidad, 0),
                        Number(cantidadMaxima)
                    );
                    return { ...item, CantidadADevolver: cantidadFinal };
                }
                return item;
            })
        );
    };

    const actualizarEstadoEntregaEquipo = (idCompuesto: string, nuevoEstadoEntregaEquipo: number) => {
        setItemsRemision(prevItems =>
            prevItems.map(item => {
                const itemIdCompuesto = `${item.IdEquipo}-${item.IdRemision}`;

                if (itemIdCompuesto === idCompuesto) {
                    return { ...item, EstadoEquipo: nuevoEstadoEntregaEquipo };
                }
                return item;
            })
        );
    };

    const prepararDatosEnvio = (): DevolucionEnvio | null => {
        // Validar datos básicos
        if (!datos.Cliente || !datos.IdProyecto) {
            mostrarMensaje('Debe seleccionar cliente y proyecto', 'error');
            return null;
        }

        // Validar que haya subarrendatario seleccionado
        if (!datos.Subarrendatario) {
            mostrarMensaje('Debe seleccionar un subarrendatario', 'error');
            return null;
        }

        // Filtrar solo items con cantidad a devolver > 0
        const itemsAEnviar = itemsRemision.filter(item => item.CantidadADevolver > 0);

        if (itemsAEnviar.length === 0) {
            mostrarMensaje('Debe ingresar una cantidad a devolver mayor a 0', 'error');
            return null;
        }

        // Validar que todos los items tengan estado seleccionado
        const itemsInvalidos = itemsAEnviar.some(item => item.EstadoEquipo === -1);
        if (itemsInvalidos) {
            mostrarMensaje('Todos los items deben tener un estado válido seleccionado', 'error');
            return null;
        }

        // Validar que todos los items tengan IdRemision
        const itemsSinRemision = itemsAEnviar.some(item => !item.IdRemision);
        if (itemsSinRemision) {
            mostrarMensaje('Todos los items deben tener una remisión asociada', 'error');
            return null;
        }

        // Validar personas que reciben y entregan si IncluyeTransporte es true
        if (datos.IncluyeTransporte === true) {
            const recibeInvalido = !datos.PersonaQueRecibe || datos.PersonaQueRecibe === OpcionPorDefecto.value;
            const entregaInvalido = !datos.PersonaQueEntrega || datos.PersonaQueEntrega.trim() === '';

            if (recibeInvalido || entregaInvalido) {
                mostrarMensaje('Debe especificar quién recibe y quién entrega los equipos cuando se incluye transporte', 'error');
                return null;
            }
        }

        // Validar transporte
        if (datos.IncluyeTransporte === null) {
            mostrarMensaje('Debe indicar si incluye transporte', 'error');
            return null;
        }

        if (datos.IncluyeTransporte && (!datos.ValorTransporte || datos.ValorTransporte <= 0)) {
            mostrarMensaje('El valor del transporte debe ser mayor a 0', 'error');
            return null;
        }

        return {
            NoDevolucion: datos.NoDevolucion,
            DocumentoCliente: datos.Cliente,
            IdRemision: null, // Siempre null ya que no hay una remisión principal
            IdProyecto: datos.IdProyecto!,
            Observaciones: datos.Observaciones,
            UsuarioCreacion: datos.UsuarioCreacion,
            IdEstado: datos.IdEstado,
            PersonaQueRecibe: datos.PersonaQueRecibe,
            PersonaQueEntrega: datos.PersonaQueEntrega,
            DocumentoSubarrendatario: datos.Subarrendatario,
            IncluyeTransporte: datos.IncluyeTransporte,
            ValorTransporte: Number(datos.ValorTransporte),
            Detalles: itemsAEnviar.map(item => ({
                IdEquipo: item.IdEquipo,
                NombreEquipo: item.NombreEquipo,
                CantidadArrendada: item.CantidadArrendada,
                CantidadPendiente: item.CantidadPendiente,
                CantidadADevolver: item.CantidadADevolver,
                EstadoEquipo: item.EstadoEquipo,
                Observaciones: item.Observaciones ?? '',
                IdRemision: item.IdRemision // Cada item envía su propio IdRemision
            })),
            FechaDevolucion: datos.FechaDevolucion.format('YYYY-MM-DD HH:mm:ss')
        };
    };

    const handleEnviarDevolucion = async () => {
        const datosEnvio = prepararDatosEnvio();

        if (!datosEnvio) {
            return;
        }

        try {
            await CrearDevolucion(datosEnvio);
            mostrarMensaje('Devolución creada correctamente', 'success');
            sendMessage('devolucion-creada', {});
            resetearFormulario();
            CargarSubarrendatariosConRemisionesAsignadasClienteProyecto();
        } catch (error) {
            console.error('Error al enviar devolución:', error);
            mostrarMensaje(`Hubo un error al crear la devolución: ${error}`, 'error');
        }
    };

    const resetearFormulario = () => {
        setItemsRemision([]);
        setDatos(prev => ({
            ...prev,
            Subarrendatario: '',
            Observaciones: '',
            PersonaQueEntrega: '',
            PersonaQueRecibe: OpcionPorDefecto.value,
            // Mantener estos valores:
            Cliente: prev.Cliente,
            IdProyecto: prev.IdProyecto,
            UsuarioCreacion: documentoUsuarioActivo ?? '',
            IdEstado: 8,
            FechaDevolucion: dayjs(),
            IncluyeTransporte: null,
            ValorTransporte: 0
        }));
    };

    const todosItemsSinPendiente = itemsRemision.length > 0 &&
        itemsRemision.every(item =>
            item.CantidadPendiente === '0' ||
            Number(item.CantidadPendiente) <= 0
        );

    const opcionesTransporte = [
        OpcionPorDefecto,
        { value: 'SI', label: 'SI' },
        { value: 'NO', label: 'NO' },
    ];

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
                            tamano='small'
                            tipo_input='text'
                            valorname='NoDevolucion'
                            bloqueado
                        />
                    </Typography>
                </Box>
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid md={3} xs={12}>
                            <FechayHora
                                label="Fecha y hora"
                                value={datos.FechaDevolucion}
                                onChange={handleFechaChange}
                            />
                        </Grid>

                        {/* Selector de Cliente */}
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Cliente"
                                value={datos.Cliente}
                                options={clientes}
                                onChange={handleChange}
                                valorname="Cliente"
                            />
                        </Grid>

                        {/* Selector de Proyecto */}
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Proyecto"
                                value={Number(datos.IdProyecto)}
                                options={proyectos}
                                onChange={handleChange}
                                valorname="IdProyecto"
                            />
                        </Grid>

                        {/* Selector de Subarrendatario */}
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Subarrendatario"
                                value={datos.Subarrendatario}
                                options={subarrendatarios}
                                onChange={handleChange}
                                valorname="Subarrendatario"
                            />
                        </Grid>

                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="¿Incluye Transporte?"
                                value={datos.IncluyeTransporte === null ? 'SinSeleccionar' : (datos.IncluyeTransporte ? 'SI' : 'NO')}
                                options={opcionesTransporte}
                                onChange={handleChange}
                                valorname="IncluyeTransporte"
                                required
                            />
                        </Grid>

                        {/* Valor Transporte */}
                        {datos.IncluyeTransporte === true && (
                            <Grid md={3} xs={12}>
                                <Input
                                    label="Valor Transporte"
                                    value={datos.ValorTransporte}
                                    onChange={handleChange}
                                    tamano="small"
                                    tipo_input="number"
                                    valorname="ValorTransporte"
                                    required
                                />
                            </Grid>
                        )}
                    </Grid>

                    {/* Lista de Items */}
                    {itemsRemision.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h6">Items a devolver</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Descripción Remisión</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Equipo</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cantidad Alquilada</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cantidad Pendiente</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000', width: '15%' }}>A Devolver</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important', width: { xs: '18%', md: '20%' } }}>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {itemsRemision.map((item) => (
                                            <TableRow
                                                key={`${item.IdEquipo}-${item.IdRemision}`}
                                                sx={{ padding: { xs: '6px 8px', md: '8px 12px' }, display: item.CantidadPendiente === '0' ? 'none' : 'table-row' }}
                                            >
                                                <TableCell>{item.Descripcion}</TableCell>
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
                                                            const limpio = raw.replace(/^0+(?=\d)/, '');
                                                            const numero = limpio === '' ? 0 : parseInt(limpio, 10);
                                                            actualizarCantidadADevolver(`${item.IdEquipo}-${item.IdRemision}`, numero);
                                                        }}
                                                        bloqueado={item.CantidadPendiente === '0'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <InputSelect
                                                        label=""
                                                        value={item.EstadoEquipo}
                                                        options={estados}
                                                        onChange={(e) => {
                                                            const nuevoEstado = parseInt(e.target.value);
                                                            actualizarEstadoEntregaEquipo(`${item.IdEquipo}-${item.IdRemision}`, nuevoEstado);
                                                        }}
                                                        valorname={`EstadoEquipo-${item.IdEquipo}-${item.IdRemision}`}
                                                        bloqueado={item.CantidadPendiente === '0'}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid md={6} xs={12} mt={0.5}>
                                <Input
                                    label='Observaciones'
                                    value={datos.Observaciones}
                                    onChange={handleChange}
                                    tamano='small'
                                    tipo_input='textarea'
                                    valorname='Observaciones'
                                    bloqueado={todosItemsSinPendiente}
                                />
                            </Grid>

                            <Grid container spacing={2} mt={.5}>
                                <Grid md={3} xs={12}>
                                    <InputSelect
                                        label="Recibe"
                                        value={datos.PersonaQueRecibe}
                                        options={profesionales}
                                        onChange={handleChange}
                                        valorname="PersonaQueRecibe"
                                        bloqueado={todosItemsSinPendiente}
                                        required={datos.IncluyeTransporte === true}
                                    />
                                </Grid>
                                <Grid md={3} xs={12}>
                                    <Input
                                        label='Entrega'
                                        value={datos.PersonaQueEntrega}
                                        onChange={handleChange}
                                        tamano='small'
                                        tipo_input='text'
                                        valorname='PersonaQueEntrega'
                                        bloqueado={todosItemsSinPendiente}
                                        required={datos.IncluyeTransporte === true}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={handleEnviarDevolucion}
                        disabled={itemsRemision.length === 0 || todosItemsSinPendiente}
                    >
                        Crear devolución
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}