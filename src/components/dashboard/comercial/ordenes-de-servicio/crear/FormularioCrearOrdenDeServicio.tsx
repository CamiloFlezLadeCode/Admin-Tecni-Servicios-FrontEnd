'use client';

import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { UserContext } from '@/contexts/user-context';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '../../../componentes_generales/formulario/Select';
import {
    useTheme,
    Card,
    Box,
    Typography,
    Divider,
    CardContent,
    CardActions,
    Button,
    SelectChangeEvent,
    Checkbox
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import { ConsultarSiguienteNoOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import { ListarProfesionalesPertenecientes } from '@/services/configuraciones/ListarProfesionalesPertenecientesService';
import { listarmecanicos } from '@/services/generales/ListarMecanicosService';
import { CrearOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/CrearOrdenDeServicioService';

// 1. Interfaces ó Types
interface DatosOrdenDeServicio {
    NoOrdenDeServicio: string;
    DocumentoCliente: string;
    IdProyecto: number | null;
    Garantia: number | null;
    Descripcion: string;
    Observaciones: string;
    DocumentoMecanico: string;
    PersonaQueEntrega: string;
    PersonaQueRecibe: string;
    UsuarioCreacion: string | null;
    IdEstado: number | null;
}

type GarantiaValue = 0 | 1 | null;

interface Equipo {
    cantidad: string;
    descripcion: string;
}

// 2. Compornente principal
export function FormularioCrearOrdenDeServicio(): React.JSX.Element {
    // 3. Hooks de React y otros hooks de librerías
    const theme = useTheme();
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const { sendMessage, messages } = useSocketIO();
    // 4. Estados
    const [datos, setDatos] = React.useState<DatosOrdenDeServicio>({
        NoOrdenDeServicio: '',
        DocumentoCliente: '',
        IdProyecto: null,
        Garantia: null as GarantiaValue,
        Descripcion: '',
        Observaciones: '',
        DocumentoMecanico: '',
        PersonaQueEntrega: '',
        PersonaQueRecibe: '',
        UsuarioCreacion: documentoUsuarioActivo,
        IdEstado: 8,
    });
    const [siguienteNoOrdenDeServicio, setSiguienteNoOrdenDeServicio] = React.useState('');
    const [clientes, setClientes] = React.useState<{ value: number | string; label: string }[]>([]);
    const [proyectos, setProyectos] = React.useState<{ value: number | string; label: string }[]>([]);
    const [profesionalesPertenecientes, setProfesionalesPertenecientes] = React.useState<{ value: number | string; label: string }[]>([]);
    const [mecanicos, setMecanicos] = React.useState<{ value: number | string; label: string }[]>([]);
    const [opcionGarantia, setOpcionGarantia] = React.useState<GarantiaValue>(null);
    const [equipos, setEquipos] = React.useState<Equipo[]>([{ cantidad: '', descripcion: '' }]);
    //Estados para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    //...

    // 5. useEffect para carga inicial y sockets
    React.useEffect(() => {
        const CargarDatosIniciales = async () => {
            try {
                // Llamadas y almacenados 
                const [
                    SiguienteNoOrdenDeServicio,
                    Clientes,
                    ProfesionalesPertenecientes,
                    Mecanicos
                ] = await Promise.all([
                    ConsultarSiguienteNoOrdenDeServicio(),
                    ListarClientes(),
                    ListarProfesionalesPertenecientes(),
                    listarmecanicos()
                ]);

                // Se asignan los datos que vienen de la bd
                const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
                setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
                setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
                setClientes(Clientes);
                setProfesionalesPertenecientes(ProfesionalesPertenecientes);
                setMecanicos(Mecanicos);
            } catch (error) {
                console.error(`Error al cargar datos: ${error}`);
            }
        };
        CargarDatosIniciales();
    }, []);

    React.useEffect(() => {
        if (datos.NoOrdenDeServicio === '') {
            setDatos(prev => ({ ...prev, NoOrdenDeServicio: siguienteNoOrdenDeServicio }));
        }
    }, [datos.NoOrdenDeServicio]);

    React.useEffect(() => {
        CargarProyectosDelCliente();
    }, [datos.DocumentoCliente]);

    React.useEffect(() => {
        if (messages.length > 0) {
            const UltimoMensaje = messages[messages.length - 1];
            if (UltimoMensaje.tipo === 'orden-de-servicio-creada') {
                CargarSiguienteNoOrdenDeServicio();
            }
        }
    }, [messages]);
    // 6. Funciones del componente
    const CargarSiguienteNoOrdenDeServicio = async () => {
        try {
            const SiguienteNoOrdenDeServicio = await ConsultarSiguienteNoOrdenDeServicio();
            // Se asignan los datos que vienen de la bd
            const SiguienteNoOrdenDeServicioReal = SiguienteNoOrdenDeServicio[0]?.SiguienteNoOrdenDeServicio;
            setDatos(prev => ({ ...prev, NoOrdenDeServicio: SiguienteNoOrdenDeServicioReal }));
            setSiguienteNoOrdenDeServicio(SiguienteNoOrdenDeServicioReal);
        } catch (error) {
            console.error(`Error al describir la acción: ${error}`);
        }
    }
    const CargarProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.DocumentoCliente
            };
            const Proyectos = await ListarProyectos(DocumentoCliente);
            setProyectos(Proyectos);
        } catch (error) {
            console.error(`Error al listar los proyectos: ${error}`);
        }
    };

    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        const { name, value } = e.target;
        setDatos(prev => ({
            ...prev,
            [name ?? '']: value,
        }))
    };

    const handleGarantiaChange = (value: GarantiaValue) => {
        setOpcionGarantia(value);
        setDatos(prev => ({
            ...prev,
            Garantia: value === null ? 0 : value
        }));
    };

    //
    const handleAddEquipo = () => {
        // Verifica si el último equipo está vacío antes de agregar uno nuevo
        if (equipos.length === 0 || equipos[equipos.length - 1].cantidad !== '' || equipos[equipos.length - 1].descripcion !== '') {
            setEquipos([...equipos, { cantidad: '', descripcion: '' }]);
        }
    };

    const handleRemoveEquipo = (index: number) => {
        if (equipos.length === 1) {
            // Si es el último equipo, solo limpiamos
            setEquipos([{ cantidad: '', descripcion: '' }]);
        } else {
            // Eliminamos el equipo
            setEquipos(equipos.filter((_, i) => i !== index));
        }
    };

    const handleChangee = (index: number, field: keyof Equipo, value: string) => {
        const newEquipos = [...equipos];
        newEquipos[index][field] = value;
        setEquipos(newEquipos);
    };

    //Función para abrir la alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //....

    //Se crea referencia para el formulario validador
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
    const reglasValidacion = [
        { campo: 'DocumentoCliente', mensaje: 'El cliente es obligatorio.' },
        { campo: 'IdProyecto', mensaje: 'La obra es obligatoria.' },
        { campo: 'Garantia', mensaje: 'La garantía es obligatoria.' },
        { campo: 'DocumentoMecanico', mensaje: 'El mecánico es obligatorio.' },
        { campo: 'PersonaQueEntrega', mensaje: 'La persona que entrega es obligatoria.' },
        { campo: 'PersonaQueRecibe', mensaje: 'La persona que recibe es obligatoria.' },
    ];
    //Se define lógica para la validación exitosa
    const manejarValidacionExitosa = () => { };
    //...

    // Función para realizar la creación de orden de servicio
    const HandleCrearOrdenDeSerivio = async () => {
        console.log(datos.Garantia);
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                // 1. Filtrar equipos válidos (con cantidad y descripción)
                const detallesValidos = equipos.filter(
                    equipo => equipo.cantidad.trim() !== '' && equipo.descripcion.trim() !== ''
                );

                // 2. Validar que haya al menos un equipo
                if (detallesValidos.length === 0) {
                    mostrarMensaje('Debe agregar al menos un equipo válido', 'error');
                    return;
                }

                // 3. Crear objeto con datos principales y detalles
                const ordenCompleta = {
                    ...datos,
                    Detalles: detallesValidos.map(equipo => ({
                        Cantidad: Number(equipo.cantidad),
                        DescripcionEquipo: equipo.descripcion
                    }))
                };

                // 4. Enviar a la API
                await CrearOrdenDeServicio(ordenCompleta);

                mostrarMensaje('Orden de servicio creada correctamente.', 'success');
                sendMessage('orden-de-servicio-creada', {});

                // 5. Resetear formulario
                setEquipos([{ cantidad: '', descripcion: '' }]);
                setDatos({
                    NoOrdenDeServicio: '',
                    DocumentoCliente: '',
                    IdProyecto: null,
                    Garantia: null as GarantiaValue,
                    Descripcion: '',
                    Observaciones: '',
                    DocumentoMecanico: '',
                    PersonaQueEntrega: '',
                    PersonaQueRecibe: '',
                    UsuarioCreacion: documentoUsuarioActivo,
                    IdEstado: 8,
                });

            } catch (error) {
                console.error(`Error al crear la orden: ${error}`);
                mostrarMensaje(`Hubo un error al crear la orden de servicio: ${error}`, 'error');
            }
        }
    }
    // ...

    // 7. Renderizado JSX
    return (
        <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                <Typography variant="subtitle1" color="text.primary">
                    Creación de órden de servicio
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                    <Input
                        label='Orden No:'
                        value={datos.NoOrdenDeServicio}
                        onChange={handleChange}
                        // required
                        tamano='small'
                        tipo_input='text'
                        valorname='NoOrdenDeServicio'
                    />
                </Typography>
            </Box>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa/Cliente'
                            value={datos.DocumentoCliente}
                            options={clientes}
                            size='small'
                            onChange={handleChange}
                            valorname='DocumentoCliente'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Obra/Proyecto'
                            value={Number(datos.IdProyecto)}
                            options={proyectos}
                            size='small'
                            onChange={handleChange}
                            valorname='IdProyecto'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Mecánico'
                            value={datos.DocumentoMecanico}
                            options={mecanicos}
                            size='small'
                            onChange={handleChange}
                            valorname='DocumentoMecanico'
                        />
                    </Grid>
                </Grid>
                {equipos.map((equipo, index) => (
                    <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                        <Grid md={1} xs={12} mt={0.5}>
                            {index === 0 ? (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddEquipo}
                                        sx={{ mr: 1, width: { xs: '10%', md: '10%' } }}
                                    >
                                        +
                                    </Button>
                                    {/* <Button
                                        variant="contained"
                                        onClick={() => handleRemoveEquipo(index)}
                                        disabled={equipos.length === 1 && equipos[0].cantidad === '' && equipos[0].descripcion === ''}
                                    >
                                        -
                                    </Button> */}
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveEquipo(index)}
                                    sx={{ width: { xs: '10%', md: '10%' } }}
                                >
                                    Quitar
                                </Button>
                            )}
                        </Grid>

                        <Grid md={2} xs={12} mt={0.5}>
                            <Input
                                label='Cantidad'
                                value={equipo.cantidad}
                                onChange={(e) => handleChangee(index, 'cantidad', e.target.value)}
                                tamano='small'
                                tipo_input='number'
                            />
                        </Grid>

                        <Grid md={6} xs={12} mt={0.5}>
                            <Input
                                label='Descripción Equipo'
                                value={equipo.descripcion}
                                onChange={(e) => handleChangee(index, 'descripcion', e.target.value)}
                                tamano='small'
                                tipo_input='text'
                            />
                        </Grid>
                    </Grid>
                ))}
                <Grid container spacing={1}>
                    <Grid md={6} xs={12} mt={0.5} >
                        <strong>¿Aplica garantía?</strong>
                        <div>
                            <label style={{ marginRight: 16 }}>
                                <Checkbox
                                    checked={opcionGarantia === 1}
                                    onChange={() => handleGarantiaChange(1)}
                                />
                                <span>Sí</span>
                            </label>

                            <label>
                                <Checkbox
                                    checked={opcionGarantia === 0}
                                    onChange={() => handleGarantiaChange(0)}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={1} mt={1}>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Descripcion'
                            value={datos.Descripcion}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='textarea'
                            valorname='Descripcion'
                        />
                    </Grid>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Observaciones'
                            value={datos.Observaciones}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='textarea'
                            valorname='Observaciones'
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1} mt={1}>
                    <Grid md={3} xs={12} mt={0.5} >
                        <InputSelect
                            label='Entrega'
                            value={datos.PersonaQueEntrega}
                            options={profesionalesPertenecientes}
                            size='small'
                            onChange={handleChange}
                            valorname='PersonaQueEntrega'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5} >
                        <Input
                            label='Recibe'
                            value={datos.PersonaQueRecibe}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='PersonaQueRecibe'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={HandleCrearOrdenDeSerivio}>
                    Crear orden
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
    )
};