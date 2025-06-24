'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelectConEstado from '@/components/dashboard/componentes_generales/formulario/SelectConEstado';
import { UserContext } from '@/contexts/user-context';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import ListarEquipos from '@/services/generales/ListarEquiposService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import InputSelect from '../../../componentes_generales/formulario/Select';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { Typography } from '@mui/material';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarBodegueros } from '@/services/generales/ListarBodeguerosService';
import { ListarDespachadores } from '@/services/generales/ListarDespachadores';
import { ListarTransportadores } from '@/services/generales/ListarTranspotadoresService';
import { ListarVehiculos } from '@/services/generales/ListarVehiculosService';
import FamiliaEquipos from '@/services/generales/ListarFamiliaEquipoService';
import { DateSchema } from 'yup';
import ModalVerItemsRemision from './ModalVerItemsRemision';
import {
    PencilSimple,
    Trash,
    X,
    Info
} from '@phosphor-icons/react/dist/ssr';
import { width } from '@mui/system';
import { CrearRemision } from '@/services/comercial/remisiones/CrearRemisionService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ConsultarCantidadDisponibleEquipo } from '@/services/comercial/remisiones/ConsultarCantidadDisponibleEquipoService';
import { ConsultarSiguienteNoRemision } from '@/services/comercial/remisiones/ConsultarSiguienteNoRemisionService';

const Bodegas = [
    { value: '1', label: 'Bodega #1' },
    { value: '2', label: 'Bodega #2' },
    { value: '3', label: 'Bodega #3' },
]

//Interface para equipo
interface Equipo {
    value: string | number,
    label: string,
    estado: 'Reparación' | 'Disponible' | 'No disponible',
}
interface Option {
    value: string
    label: React.ReactNode
}

//Se mapean los colores para los estados
const estadoColor: Record<Equipo['estado'], string> = {
    Disponible: '#4caf50',    // verde
    "No disponible": '#f44336', // rojo
    Reparación: '#ff9800',    // amarillo
}

interface EquipoEstadoOption {
    value: string | number;
    label: string;
    estado: 'Disponible' | 'No disponible' | 'Reparación';
}

type Items = {
    value: string | number;
    label: string;
    Categoria?: string;
    Cantidad?: number;
    observaciones?: string;
    ObservacionesCliente?: string; // 👈 Agregado aquí
    Subarrendatario?: string;
    PrecioUnidad?: number;
    PrecioTotal?: number;
    IVA?: number;
    PrecioTotalSinIVA?: number;
};


export function FormularioCrearRemision(): React.JSX.Element {
    //Consumir el contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;


    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

    //Llenado para el select de clientes
    const [clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    //Llenado para el select de categorías
    const [categorias, setCategoria] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    // //Llenado para el select de los subarrendatarios
    const [subarrendatarios, setSubarrendatarios] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    //Llenado para el select de los bodegueros
    const [bodegueros, setBodegueros] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    //Llenado para el select de los despachadores
    const [despachadores, setDespachadores] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    //Llenado para el select de los transportadores
    const [transportadores, setTransportadores] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    //Llenado para el select de los vehículos
    const [vehiculos, setVehiculos] = React.useState<{ value: string | number; label: string }[]>([]);
    //...
    //Llenado de todos los selects al cargar/renderizar componente
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    clientesRes,
                    categoriasRes,
                    subarrRes,
                    bodeguerosRes,
                    despachadoresRes,
                    transportadoresRes,
                    vehiculosRes
                ] = await Promise.all([
                    ListarClientes(),
                    ListarCategorias(),
                    ListarSubarrendatarios(),
                    ListarBodegueros(),
                    ListarDespachadores(),
                    ListarTransportadores(),
                    ListarVehiculos()
                ]);
                setClientes(clientesRes);
                setCategoria(categoriasRes);
                setSubarrendatarios(subarrRes);
                setBodegueros(bodeguerosRes);
                setDespachadores(despachadoresRes);
                setTransportadores(transportadoresRes);
                setVehiculos(vehiculosRes);
            } catch (err) {
                console.error('Error al cargar datos: ', err);
            }
        };

        fetchData();
    }, []);
    //...

    //Para el llenado del siguiente No Remisión
    const CargarSiguienteNoRemision = async () => {
        try {
            const SiguienteNoRemision = await ConsultarSiguienteNoRemision();
            setDatos(prev => ({ ...prev, NoRemision: SiguienteNoRemision[0].SiguienteNoRemision }));
        } catch (error) {
            console.error(`Error al cargar el siguiente No Resolución. ${error}`);
        }
    };
    React.useEffect(() => {
        CargarSiguienteNoRemision();
    }, []);
    //...

    //Se maneja el estado para todos los campos del formulario
    const [datos, setDatos] = React.useState({
        Cliente: '',
        Proyecto: '',
        Categoria: '',
        Equipo: '',
        Cantidad: 1,
        PrecioUnidad: 0,
        PrecioTotal: 0,
        IVA: 19,
        PrecioTotalGeneral: 0,
        Subarrendatario: '',
        Bodega: '',
        EquipoDisponible: '',
        Bodeguero: '',
        Despachador: '',
        Transportador: '',
        Vehiculo: '',
        Placa: '',
        Recibe: '',
        ObservacionesEmpresa: '',
        ObservacionesCliente: '',
        UsuarioCrecion: documentoUsuarioActivo,
        NoRemision: '',
    });


    //Llenado del select de proyectos
    const [proyectos, setProyectos] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.Cliente
            };
            const ProyectosDelCliente = await ListarProyectos(DocumentoCliente);
            setProyectos(ProyectosDelCliente);
        } catch (error) {
            console.error('Error al listar los proyectos del cliente: ', error);
        }
    };

    React.useEffect(() => {
        const FetchDataCargarProyectosDelCliente = async () => {
            CargarProyectosDelCliente();
        };
        FetchDataCargarProyectosDelCliente();
    }, [datos.Cliente])

    //Llenado para el select de los equipos
    const [equipos, setEquipos] = React.useState<Equipo[]>([])
    const CargarEquiposPorCategoria = async () => {
        try {
            const ValorCategoria = { IdCategoria: datos.Categoria };
            const EquiposPorCategoria: Equipo[] = await ListarEquipos(ValorCategoria);

            // Mapear directamente sin JSX
            const opciones: EquipoEstadoOption[] = EquiposPorCategoria.map(equipo => ({
                value: equipo.value,
                label: equipo.label,  // solo string
                estado: equipo.estado,
            }));

            setEquipos(opciones);
        } catch (error) {
            console.error('Error al listar los equipos: ', error);
        }
    };
    React.useEffect(() => {
        const FetchDataCargarEquiposPorCategoria = async () => {
            CargarEquiposPorCategoria();
        };
        FetchDataCargarEquiposPorCategoria();
    }, [datos.Categoria]);

    //Para consultar la cantidad disponible del equipo seleccionado
    const [cantidaddisponible, setCantidadDisponible] = React.useState(0);
    const prevEquipoRef = React.useRef(datos.Equipo); // Referencia para almacenar el valor anterior

    //Se manejan los estados para los 3 tipos de precios
    const [precioAlquiler, setPrecioAlquiler] = React.useState(0);
    const [precioVenta, setPrecioVenta] = React.useState(0);
    const [precioReparacion, setPrecioReparacion] = React.useState(0);
    // ...
    const CargarCantidadDisponibleEquipo = async () => {
        try {
            const CantidadDisponibleEquipo = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
            setCantidadDisponible(CantidadDisponibleEquipo[0].CantidadDisponible);

            //Se asignan los precios
            //alquiler
            const PrecioAlquiler = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
            setPrecioAlquiler(PrecioAlquiler[0].PrecioAlquiler);
            setDatos(prev => ({ ...prev, PrecioUnidad: Number(PrecioAlquiler[0].PrecioAlquiler) ?? 0 }));
            //venta
            const PrecioVenta = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
            setPrecioVenta(PrecioVenta[0].PrecioVenta);
            // setDatos(prev => ({ ...prev, PrecioUnidad: PrecioVenta[0].PrecioVenta }));
            //reparación
            const PrecioReparacion = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
            setPrecioReparacion(PrecioReparacion[0].PrecioReparacion);
            // setDatos(prev => ({ ...prev, PrecioUnidad: PrecioReparacion[0].PrecioReparacion }));
            // ...
        } catch (error) {
            console.error(`Error al consultar la cantidad disponible del equipo. ${error}`);
        }
    };

    React.useEffect(() => {
        // Verificar si el valor de datos.Equipo ha cambiado
        if (prevEquipoRef.current !== datos.Equipo) {
            CargarCantidadDisponibleEquipo();
            prevEquipoRef.current = datos.Equipo; // Actualizar la referencia con el nuevo valor
        }
        setDatos(prev => ({ ...prev, Cantidad: 1 }));
    }, [datos.Equipo]);
    //...

    //Para mostrar error cuando la cantidad supera a la cantidad disponible
    const prevCantidadDisponibleRef = React.useRef(cantidaddisponible);
    React.useEffect(() => {
        if (prevCantidadDisponibleRef.current !== cantidaddisponible) {
            if (datos.Cantidad > cantidaddisponible) {
                mostrarMensaje('La cantidad no puede ser mayor a la cantidad disponible', 'error');
                return;
            }
        }
    }, [datos.Cantidad, cantidaddisponible]);
    //...

    //Función para manejar el cambio en todos los campos del formulario
    const handleChange = async (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
        const { name, value } = e.target;
        setDatos((prevDatos) => ({
            ...prevDatos,
            [name ?? '']: value,
            // Si cambia Cliente limpiar proyecto seleccionado
            ...(name === 'Cliente' ? { Proyecto: '' } : {}),
            ...(name === 'Categoria' ? { Equipo: '' } : {}),
        }));
    };

    //Para calcular el precio total
    React.useEffect(() => {
        const total = BigInt(datos.Cantidad) * BigInt(datos.PrecioUnidad);
        // setDatos(prev => ({ ...prev, PrecioTotal: Number(total) }));
        const IVACapturado = Number(datos.IVA);
        const TotalConIVAIncluido = Number(total) * (1 + IVACapturado / 100);
        // Redondear a 2 decimales
        const PrecioTotalConDosDecimales = parseFloat(TotalConIVAIncluido.toFixed(2));
        setDatos(prev => ({ ...prev, PrecioTotal: Number(PrecioTotalConDosDecimales) }));
    }, [datos.Cantidad, datos.PrecioUnidad, datos.IVA]);
    // const CalcularPrecioTotalItem = () => {
    //     let PrecioTotal = (datos.Cantidad * datos.PrecioUnidad);
    //     setDatos(prev => ({
    //         ...prev,
    //         PrecioTotal
    //     }));
    // };
    //     const handleChangeCantidad = (valor: number) => {
    //     const nuevoPrecioTotal = valor * datos.PrecioUnidad;
    //     setDatos(prev => ({
    //         ...prev,
    //         Cantidad: valor,
    //         PrecioTotal: nuevoPrecioTotal
    //     }));
    // };

    // const handleChangePrecioUnidad = (valor: number) => {
    //     const nuevoPrecioTotal = datos.Cantidad * valor;
    //     setDatos(prev => ({
    //         ...prev,
    //         PrecioUnidad: valor,
    //         PrecioTotal: nuevoPrecioTotal
    //     }));
    // };
    //...
    //Para agregar items
    const [itemsRemision, setItemsRemision] = React.useState<Items[]>([]);
    const precioTotalGeneral = itemsRemision.reduce((acc, item) => acc + (item.PrecioTotal ?? 0), 0);
    const agregarItem = () => {
        const equipoSeleccionado = equipos.find(e => e.value === datos.Equipo);
        const categoriaSeleccionada = categorias.find(e => e.value === datos.Categoria);
        const subarrendatarioSeleccionado = subarrendatarios.find(e => e.value === datos.Subarrendatario);
        if (equipoSeleccionado && datos.Equipo) {
            const yaExiste = itemsRemision.some(e => e.value === equipoSeleccionado.value);
            if (!yaExiste) {
                const nuevoItem: Items = {
                    Subarrendatario: subarrendatarioSeleccionado?.label ?? '-',
                    value: equipoSeleccionado.value,
                    label: equipoSeleccionado.label,
                    Categoria: categoriaSeleccionada?.label ?? '-',        // <- Asegúrate que exista en tu state
                    Cantidad: datos.Cantidad,          // <- Idem
                    PrecioUnidad: datos.PrecioUnidad,
                    PrecioTotal: datos.PrecioTotal,
                    ObservacionesCliente: datos.ObservacionesCliente, // <- Idem
                    IVA: datos.IVA,
                    PrecioTotalSinIVA: Number(datos.Cantidad * datos.PrecioUnidad)
                };
                setItemsRemision(prev => [...prev, nuevoItem]);
                setDatos((prev) => ({
                    ...prev,
                    Categoria: '',
                    Equipo: '',
                    PrecioUnidad: 0,
                    IVA: 19,
                    PrecioTotal: 0,
                    ObservacionesCliente: ''
                }));
                setCantidadDisponible(0);
                mostrarMensaje('Item agregado correctamente a la remisión', 'success');
            }
        }
    };


    const eliminarItem = (id: string | number) => {
        setItemsRemision(prev => prev.filter(item => item.value !== id));
    };

    //...

    //Se capturan los datos a enviar
    const DatosRemision = {
        // Datos generales
        NoRemision: datos.NoRemision,
        DocumentoCliente: datos.Cliente,
        IdProyecto: datos.Proyecto,
        // IdBodega: datos.Bodega,
        IdBodega: null,
        DocumentoBodeguero: datos.Bodeguero,
        DocumentoDespachador: datos.Despachador,
        DocumentoTransportador: datos.Transportador,
        IdVehiculo: datos.Vehiculo,
        PlacaVehiculoRecibe: datos.Placa,
        NombrePersonaRecibe: datos.Recibe,
        ObservacionesEmpresa: datos.ObservacionesEmpresa,
        UsuarioCreacion: datos.UsuarioCrecion,
        IdEstado: 8,
        PrecioTotalGeneralSinIVA: itemsRemision.reduce((acc, item) => acc + (item.PrecioTotalSinIVA ?? 0), 0),
        IVA: datos.IVA,
        PrecioTotalGeneralConIVA: itemsRemision.reduce((acc, item) => acc + (item.PrecioTotal ?? 0), 0),
        // Aquí es lo importante:
        Detalles: itemsRemision.map(item => ({
            DocumentoSubarrendatario: datos.Subarrendatario,
            IdCategoria: datos.Categoria,
            IdEquipo: item.value,
            Cantidad: item.Cantidad,
            PrecioUnidad: item.PrecioUnidad,
            PrecioTotal: item.PrecioTotal,
            ObservacionesCliente: item.ObservacionesCliente
        }))
    };
    //...

    //Estados para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    //...

    //Función para abrir la alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //....

    //Se definen las reglas con su respectivo mensaje de alerta
    const reglasValidacion = [
        { campo: 'Cliente', mensaje: 'El cliente es obligatorio.' },
        { campo: 'Proyecto', mensaje: 'El proyecto es obligatorio.' },
        { campo: 'Subarrendatario', mensaje: 'El subarrendatario es obligatorio.' },
        { campo: 'Bodeguero', mensaje: 'El bodeguero es obligatorio.' },
        { campo: 'Despachador', mensaje: 'El despachador es obligatorio.' },
        { campo: 'Transportador', mensaje: 'El transportador es obligatorio.' },
        { campo: 'Vehiculo', mensaje: 'El vehículo es obligatorio.' },
        // { campo: '', mensaje: '' },
    ]
    //...

    //Se define lógica para la validación exitosa
    const manejarValidacionExitosa = () => {
        // Lógica para manejar la validación exitosa
        console.log("Validación exitosa. Procesar datos...", datos);

    };
    //...

    //Se crea referencia para el formulario validador
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);
    //...
    //Función para crear la remisión
    const handleCrearCliente = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();
        if (esValido) {
            try {
                await CrearRemision(DatosRemision);
                mostrarMensaje('Remisión creada correctamente', 'success');
                //Se limpia el formulario
                setDatos({
                    Cliente: '',
                    Proyecto: '',
                    Categoria: '',
                    Equipo: '',
                    Cantidad: 1,
                    PrecioUnidad: 0,
                    PrecioTotal: 0,
                    IVA: 19,
                    PrecioTotalGeneral: 0,
                    Subarrendatario: '',
                    Bodega: '',
                    EquipoDisponible: '',
                    Bodeguero: '',
                    Despachador: '',
                    Transportador: '',
                    Vehiculo: '',
                    Placa: '',
                    Recibe: '',
                    ObservacionesEmpresa: '',
                    ObservacionesCliente: '',
                    UsuarioCrecion: documentoUsuarioActivo,
                    NoRemision: '',
                });
                //...

                //Se retiran los items almacenados
                setItemsRemision([]);
                //...

                //Se limpia la cantidad disponible
                setCantidadDisponible(0);
                //...

                //Se llama la función para mostrar el siguiente No Remisión
                CargarSiguienteNoRemision();
                //...
            } catch (error) {
                mostrarMensaje(`Error al crear la remisión: ${error}`, 'error');
                console.error(`Error al crear la remisión. Error: ${error}`);
            }
        }
    };
    //...
    return (
        <Card>
            {/* <CardHeader
                title="Creación de remisión" size="small"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            /> */}
            {/* <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Creación de remisión</Typography> */}
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                <Typography variant="subtitle1" color="text.primary">
                    Creación de remisión
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                    <Input
                        label='Remisión No:'
                        value={datos.NoRemision}
                        onChange={handleChange}
                        // required
                        tamano='small'
                        tipo_input='text'
                        valorname='NoRemision'
                    />
                </Typography>
            </Box>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa/Cliente'
                            value={datos.Cliente}
                            options={clientes}
                            size='small'
                            onChange={handleChange}
                            valorname='Cliente'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Proyecto'
                            value={datos.Proyecto}
                            options={proyectos}
                            size='small'
                            onChange={handleChange}
                            valorname='Proyecto'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Subarrendatario'
                            value={datos.Subarrendatario}
                            options={subarrendatarios}
                            size='small'
                            onChange={handleChange}
                            valorname='Subarrendatario'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Categoría'
                            value={datos.Categoria}
                            options={categorias}
                            size='small'
                            onChange={handleChange}
                            valorname='Categoria'
                        />
                    </Grid>
                    {/* <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Equipo'
                            value={datos.Equipo}
                            options={equipos}
                            size='small'
                            onChange={handleChange}
                            valorname='Equipo'
                        />
                    </Grid> */}
                    {/* <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Familia"
                            value={datos.Categoria}
                            options={FamiliaEquipos}
                            size='small'
                            onChange={handleChange}
                            valorname='Categoria'
                        />
                    </Grid> */}
                    {/* <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Bodega'
                            value={datos.Bodega}
                            options={Bodegas}
                            size='small'
                            onChange={handleChange}
                            valorname="Bodega"
                        />
                    </Grid> */}
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelectConEstado
                            label="Equipo disponible"
                            value={datos.Equipo}
                            options={equipos} // array de tipo EquipoEstadoOption[]
                            size="small"
                            onChange={handleChange}
                            valorname="Equipo"
                        // required
                        />
                    </Grid>
                    <Grid md={1.5} xs={12} mt={0.5}>
                        <Input
                            label='Cantidad'
                            value={datos.Cantidad}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='Cantidad'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Precio unidad'
                            value={datos.PrecioUnidad}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='PrecioUnidad'
                        />
                    </Grid>
                    <Grid md={1.5} xs={12} mt={0.5}>
                        <Input
                            label='IVA %'
                            value={datos.IVA}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='IVA'
                            bloqueado={false}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Precio total'
                            value={datos.PrecioTotal}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='number'
                            valorname='PrecioTotal'
                            bloqueado={true}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Cantidad disponible'
                            value={cantidaddisponible}
                            tamano='small'
                            tipo_input='number'
                            bloqueado={true}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Bodeguero'
                            value={datos.Bodeguero}
                            options={bodegueros}
                            size='small'
                            onChange={handleChange}
                            valorname='Bodeguero'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Despachador'
                            value={datos.Despachador}
                            options={despachadores}
                            size='small'
                            onChange={handleChange}
                            valorname='Despachador'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Transportador'
                            value={datos.Transportador}
                            options={transportadores}
                            size='small'
                            onChange={handleChange}
                            valorname='Transportador'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Vehículo'
                            value={datos.Vehiculo}
                            options={vehiculos}
                            size='small'
                            onChange={handleChange}
                            valorname='Vehiculo'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Recibe'
                            value={datos.Recibe}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Recibe'
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label='Placa'
                            value={datos.Placa}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='text'
                            valorname='Placa'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent style={{ paddingTop: '0px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Observaciones Empresa'
                            value={datos.ObservacionesEmpresa}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='textarea'
                            valorname='ObservacionesEmpresa'
                        />
                    </Grid>
                    <Grid md={6} xs={12} mt={0.5} >
                        <Input
                            label='Observaciones Cliente'
                            value={datos.ObservacionesCliente}
                            onChange={handleChange}
                            // required
                            tamano='small'
                            tipo_input='textarea'
                            valorname='ObservacionesCliente'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Typography>Total items: {itemsRemision.length}</Typography>
                <Button variant="text" onClick={agregarItem}>
                    Agregar item
                </Button>
                <ModalVerItemsRemision
                    items={itemsRemision}
                    onEliminarItem={eliminarItem}
                    precioTotalGeneral={precioTotalGeneral}
                />
                <Button variant="contained" onClick={handleCrearCliente}>
                    Crear remisión
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