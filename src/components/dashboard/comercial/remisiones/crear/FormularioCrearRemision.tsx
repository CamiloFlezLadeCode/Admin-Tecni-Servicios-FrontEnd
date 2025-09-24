'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { useSocketIO } from '@/hooks/use-WebSocket';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelectConEstado from '@/components/dashboard/componentes_generales/formulario/SelectConEstado';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import { UserContext } from '@/contexts/user-context';
import { ConsultarCantidadDisponibleEquipo } from '@/services/comercial/remisiones/ConsultarCantidadDisponibleEquipoService';
import { ConsultarSiguienteNoRemision } from '@/services/comercial/remisiones/ConsultarSiguienteNoRemisionService';
import { CrearRemision } from '@/services/comercial/remisiones/CrearRemisionService';
import { ListarBodegueros } from '@/services/generales/ListarBodeguerosService';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarDespachadores } from '@/services/generales/ListarDespachadores';
import { VerDisponibilidadDeEquipos } from '@/services/comercial/remisiones/VerDisponibilidadDeEquiposService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import { ListarTransportadores } from '@/services/generales/ListarTranspotadoresService';
import { ListarVehiculos } from '@/services/generales/ListarVehiculosService';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import InputSelect from '../../../componentes_generales/formulario/Select';
import ModalVerItemsRemision from './ModalVerItemsRemision';
// Importar componentes de Modal de Material-UI
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { ListarEquipos } from '@/services/comercial/remisiones/ListarEquiposService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';


// Interfaces y tipos
interface Equipo {
    value: string | number;
    label: string;
    estado: 'Reparación' | 'Disponible' | 'No disponible';
}

interface ItemRemision {
    value: string | number;
    label: string;
    IdCategoria: number;
    Categoria: string;
    Cantidad: number;
    ObservacionesCliente?: string;
    Subarrendatario: string;
    NombreSubarrendatario: string;
    PrecioUnidad: number;
    PrecioTotal: number;
    IVA: number;
    PrecioTotalSinIVA: number;
}

interface DatosFormulario {
    Cliente: string;
    Proyecto: string;
    IdCategoria: number;
    Equipo: string;
    Cantidad: number;
    PrecioUnidad: number;
    PrecioTotal: number;
    IVA: number;
    PrecioTotalGeneral: number;
    Subarrendatario: string;
    Bodega: string;
    EquipoDisponible: string;
    Bodeguero: string;
    Despachador: string;
    Transportador: string;
    Vehiculo: string;
    Placa: string;
    Recibe: string;
    ObservacionesEmpresa: string;
    ObservacionesCliente: string;
    UsuarioCrecion: string | null;
    NoRemision: string;
    FechaRemision: Dayjs;
}

// Estilos para el Modal
const ModalContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[24],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
}));

export function FormularioCrearRemision(): React.JSX.Element {
    // Contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;
    const { sendMessage, messages } = useSocketIO();

    // Estados para los selects
    const [clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([]);
    const [categorias, setCategoria] = React.useState<{ value: string | number; label: string }[]>([]);
    const [subarrendatarios, setSubarrendatarios] = React.useState<{ value: string | number; label: string }[]>([]);
    const [bodegueros, setBodegueros] = React.useState<{ value: string | number; label: string }[]>([]);
    const [despachadores, setDespachadores] = React.useState<{ value: string | number; label: string }[]>([]);
    const [transportadores, setTransportadores] = React.useState<{ value: string | number; label: string }[]>([]);
    const [vehiculos, setVehiculos] = React.useState<{ value: string | number; label: string }[]>([]);
    const [proyectos, setProyectos] = React.useState<{ value: string | number; label: string }[]>([]);
    const [equipos, setEquipos] = React.useState<Equipo[]>([]);

    const OpcionPorDefecto = { value: 'SinSeleccionar', label: 'Sin seleccionar' };

    // Estados para datos del formulario
    const [datos, setDatos] = React.useState<DatosFormulario>({
        Cliente: '',
        Proyecto: '',
        IdCategoria: Number(null),
        Equipo: '',
        Cantidad: 0,
        PrecioUnidad: 0,
        PrecioTotal: 0,
        IVA: 19,
        PrecioTotalGeneral: 0,
        Subarrendatario: '0',
        Bodega: '0',
        EquipoDisponible: '',
        Bodeguero: 'SinSeleccionar',
        Despachador: 'SinSeleccionar',
        Transportador: 'SinSeleccionar',
        Vehiculo: 'SinSeleccionar',
        Placa: '',
        Recibe: '',
        ObservacionesEmpresa: '',
        ObservacionesCliente: '',
        UsuarioCrecion: documentoUsuarioActivo,
        NoRemision: '',
        FechaRemision: dayjs(),
    });

    // Estados para items y disponibilidad
    const [itemsRemision, setItemsRemision] = React.useState<ItemRemision[]>([]);
    const [cantidadDisponible, setCantidadDisponible] = React.useState(0);
    const [precioAlquiler, setPrecioAlquiler] = React.useState(0);
    const [precioVenta, setPrecioVenta] = React.useState(0);
    const [precioReparacion, setPrecioReparacion] = React.useState(0);

    // Estados para alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

    // Estado para el modal de cantidad cero
    const [modalCantidadCeroAbierto, setModalCantidadCeroAbierto] = React.useState(false);

    // Referencias
    const prevEquipoRef = React.useRef(datos.Equipo);
    const prevCantidadDisponibleRef = React.useRef(cantidadDisponible);
    const formularioRef = React.useRef<{ manejarValidacion: () => Promise<boolean> }>(null);

    // Función para verificar si el subarrendatario es TECNISERVICIOS
    const esTecniservicios = () => {
        return datos.Subarrendatario === 'ABC';
    };

    // Cargar datos iniciales
    React.useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                let [
                    clientesRes,
                    categoriasRes,
                    subarrRes,
                    bodeguerosRes,
                    despachadoresRes,
                    transportadoresRes,
                    vehiculosRes,
                    siguienteNoRemision
                ] = await Promise.all([
                    ListarClientes(),
                    ListarCategorias(),
                    ListarSubarrendatarios(),
                    ListarBodegueros(),
                    ListarDespachadores(),
                    ListarTransportadores(),
                    ListarVehiculos(),
                    ConsultarSiguienteNoRemision()
                ]);

                //Clientes
                setClientes(clientesRes);
                //Categorias
                setCategoria(categoriasRes);
                //Subarrendatarios
                let Subarrendatarios = subarrRes;
                Subarrendatarios.unshift({ value: 'ABC', label: 'TECNISERVICIOS J.F S.A.S' })
                setSubarrendatarios(Subarrendatarios);
                //Bodegueros
                bodeguerosRes.unshift(OpcionPorDefecto);
                setBodegueros(bodeguerosRes);
                //Despachadores
                despachadoresRes.unshift(OpcionPorDefecto);
                setDespachadores(despachadoresRes);
                //Trasportadores/Conductores
                transportadoresRes.unshift(OpcionPorDefecto);
                setTransportadores(transportadoresRes);
                //Vehiculos
                vehiculosRes.unshift(OpcionPorDefecto);
                setVehiculos(vehiculosRes);
                setDatos(prev => ({
                    ...prev,
                    NoRemision: siguienteNoRemision[0].SiguienteNoRemision
                }));
            } catch (err) {
                console.error('Error al cargar datos iniciales: ', err);
                mostrarMensaje('Error al cargar datos iniciales', 'error');
            }
        };

        cargarDatosIniciales();
    }, []);

    // Cargar proyectos cuando cambia el cliente
    React.useEffect(() => {
        const cargarProyectos = async () => {
            if (!datos.Cliente) return;

            try {
                const proyectosRes = await ListarProyectos({ Cliente: datos.Cliente });
                setProyectos(proyectosRes);
                setDatos(prev => ({ ...prev, Proyecto: '' }));
            } catch (error) {
                console.error('Error al cargar proyectos: ', error);
                mostrarMensaje('Error al cargar proyectos del cliente', 'error');
            }
        };

        cargarProyectos();
    }, [datos.Cliente]);

    // Cargar equipos cuando cambia la categoría o subarrendatario
    React.useEffect(() => {
        const cargarEquipos = async () => {
            if (!datos.IdCategoria) return;

            try {
                let equipos = [];

                if (datos.Subarrendatario == 'ABC') {
                    equipos = await VerDisponibilidadDeEquipos({
                        IdCategoria: datos.IdCategoria,
                        DocumentoSubarrendatario: datos.Subarrendatario
                    });
                } else {
                    equipos = await ListarEquipos({ IdCategoria: datos.IdCategoria });
                }

                setEquipos(equipos);
                setDatos(prev => ({ ...prev, Equipo: '', PrecioUnidad: 0 }));
                setCantidadDisponible(equipos.length > 0 ? equipos[0].CantidadDisponible : 0);
            } catch (error) {
                console.error('Error al cargar equipos: ', error);
                mostrarMensaje('Error al cargar equipos por categoría', 'error');
            }
        };

        cargarEquipos();
    }, [datos.IdCategoria, datos.Subarrendatario]);


    // React.useEffect(() => {
    //     const cargarEquipos = async () => {
    //         if (!datos.IdCategoria) return;

    //         try {
    //             let equipos = [];

    //             if (datos.Subarrendatario === 'ABC') {
    //                 equipos = await VerDisponibilidadDeEquipos({
    //                     IdCategoria: datos.IdCategoria,
    //                     DocumentoSubarrendatario: datos.Subarrendatario
    //                 });
    //             } else {
    //                 equipos = await ListarEquipos({
    //                     IdCategoria: datos.IdCategoria
    //                 });
    //             }

    //             setEquipos(equipos);
    //             setDatos(prev => ({ ...prev, Equipo: '', PrecioUnidad: 0 }));
    //             setCantidadDisponible(0); // 🔥 Resetear siempre
    //         } catch (error) {
    //             console.error('Error al cargar equipos: ', error);
    //             mostrarMensaje('Error al cargar equipos por categoría', 'error');
    //         }
    //     };

    //     cargarEquipos();
    // }, [datos.IdCategoria, datos.Subarrendatario]);


    // Cargar cantidad disponible cuando cambia el equipo
    // React.useEffect(() => {
    //     const cargarDisponibilidad = async () => {
    //         if (!datos.Equipo || prevEquipoRef.current === datos.Equipo) return;

    //         try {
    //             // Solo consultar disponibilidad si es TECNISERVICIOS
    //             if (esTecniservicios()) {
    //                 const [disponibilidad] = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
    //                 setCantidadDisponible(disponibilidad.CantidadDisponible);
    //                 setPrecioAlquiler(disponibilidad.PrecioAlquiler);
    //                 setPrecioVenta(disponibilidad.PrecioVenta);
    //                 setPrecioReparacion(disponibilidad.PrecioReparacion);

    //                 // Mostrar modal si la cantidad disponible es 0
    //                 if (disponibilidad.CantidadDisponible === 0) {
    //                     setModalCantidadCeroAbierto(true);
    //                 }

    //                 setDatos(prev => ({
    //                     ...prev,
    //                     PrecioUnidad: Number(disponibilidad.PrecioAlquiler) || 0,
    //                     Cantidad: 1
    //                 }));
    //             } else {
    //                 // Para subarrendatarios externos, no hay control de inventario
    //                 setCantidadDisponible(0);
    //                 setDatos(prev => ({
    //                     ...prev,
    //                     PrecioUnidad: 0,
    //                     Cantidad: 1
    //                 }));
    //             }
    //             prevEquipoRef.current = datos.Equipo;
    //         } catch (error) {
    //             console.error('Error al cargar disponibilidad: ', error);
    //             mostrarMensaje('Error al consultar disponibilidad del equipo', 'error');
    //         }
    //     };

    //     cargarDisponibilidad();
    // }, [datos.Equipo, datos.IdCategoria, datos.Subarrendatario]);
    // Cargar cantidad disponible cuando cambia el equipo
    // React.useEffect(() => {
    //     const cargarDisponibilidad = async () => {
    //         if (!datos.Equipo || prevEquipoRef.current === datos.Equipo) return;

    //         try {
    //             // Solo consultar disponibilidad si es TECNISERVICIOS
    //             if (esTecniservicios()) {
    //                 const [disponibilidad] = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
    //                 setCantidadDisponible(disponibilidad.CantidadDisponible);
    //                 setPrecioAlquiler(disponibilidad.PrecioAlquiler);
    //                 setPrecioVenta(disponibilidad.PrecioVenta);
    //                 setPrecioReparacion(disponibilidad.PrecioReparacion);

    //                 setDatos(prev => ({
    //                     ...prev,
    //                     PrecioUnidad: Number(disponibilidad.PrecioAlquiler) || 0,
    //                     Cantidad: 1
    //                 }));
    //             } else {
    //                 // Para subarrendatarios externos, no hay control de inventario
    //                 setCantidadDisponible(0);
    //                 setDatos(prev => ({
    //                     ...prev,
    //                     PrecioUnidad: 0,
    //                     Cantidad: 1
    //                 }));
    //             }
    //             prevEquipoRef.current = datos.Equipo;
    //         } catch (error) {
    //             console.error('Error al cargar disponibilidad: ', error);
    //             mostrarMensaje('Error al consultar disponibilidad del equipo', 'error');
    //         }
    //     };

    //     cargarDisponibilidad();
    // }, [datos.Equipo, datos.IdCategoria, datos.Subarrendatario]);


    // Cargar cantidad disponible cuando cambia el equipo
    React.useEffect(() => {
        const cargarDisponibilidad = async () => {
            // Si no hay equipo seleccionado o es el mismo que antes, no hacer nada
            // if (!datos.Equipo || prevEquipoRef.current === datos.Equipo) {
            if (!datos.Equipo) {
                return;
            }

            try {
                const [disponibilidad] = await ConsultarCantidadDisponibleEquipo(Number(datos.Equipo));
                setCantidadDisponible(disponibilidad.CantidadDisponible);
                setPrecioAlquiler(disponibilidad.PrecioAlquiler);
                setPrecioVenta(disponibilidad.PrecioVenta);
                setPrecioReparacion(disponibilidad.PrecioReparacion);

                // Solo consultar disponibilidad si es TECNISERVICIOS
                if (esTecniservicios()) {

                    setDatos(prev => ({
                        ...prev,
                        PrecioUnidad: Number(disponibilidad.PrecioAlquiler) || 0,
                        Cantidad: 1
                    }));
                } else {
                    // Para subarrendatarios externos, no hay control de inventario
                    setCantidadDisponible(0);
                    // Mantener el precio actual si ya fue ingresado manualmente
                    setDatos(prev => ({
                        ...prev,
                        Cantidad: prev.Cantidad || 1,
                        PrecioUnidad: Number(disponibilidad.PrecioAlquiler) || 0,
                    }));
                }

                // 🔥 ACTUALIZAR LA REFERENCIA DESPUÉS de procesar los datos
                prevEquipoRef.current = datos.Equipo;

            } catch (error) {
                console.error('Error al cargar disponibilidad: ', error);
                mostrarMensaje('Error al consultar disponibilidad del equipo', 'error');
            }
        };

        cargarDisponibilidad();
    }, [datos.Equipo, datos.Subarrendatario]); // 🔥 Remover datos.IdCategoria de las dependencias

    // Efecto separado para controlar el modal basado en la cantidad disponible
    // React.useEffect(() => {
    //     // Mostrar modal solo si es TECNISERVICIOS, hay un equipo seleccionado y la cantidad es 0
    //     setTimeout(() => {
    //         if (esTecniservicios() && datos.Equipo && cantidadDisponible === 0) {
    //             setModalCantidadCeroAbierto(true);
    //         } else {
    //             setModalCantidadCeroAbierto(false);
    //         }
    //     }, 2000)
    // }, [cantidadDisponible, datos.Equipo, datos.Subarrendatario]);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (esTecniservicios() && datos.Equipo && cantidadDisponible === 0) {
                setModalCantidadCeroAbierto(true);
            } else {
                setModalCantidadCeroAbierto(false);
            }
        }, 1000);

        return () => clearTimeout(timer); // 🔥 Limpia el timeout previo
    }, [cantidadDisponible, datos.Equipo, datos.Subarrendatario]);

    // Validar cantidad no exceda disponibilidad (solo para TECNISERVICIOS)
    React.useEffect(() => {
        if (esTecniservicios() &&
            prevCantidadDisponibleRef.current !== cantidadDisponible &&
            datos.Cantidad > cantidadDisponible) {
            mostrarMensaje('La cantidad no puede ser mayor a la disponible', 'error');
        }
        prevCantidadDisponibleRef.current = cantidadDisponible;
    }, [datos.Cantidad, cantidadDisponible]);

    // Calcular precio total
    React.useEffect(() => {
        const totalSinIVA = Number(datos.Cantidad) * Number(datos.PrecioUnidad);
        const totalConIVA = totalSinIVA * (1 + Number(datos.IVA) / 100);
        setDatos(prev => ({
            ...prev,
            PrecioTotal: parseFloat(totalConIVA.toFixed(2))
        }));
    }, [datos.Cantidad, datos.PrecioUnidad, datos.IVA]);

    // WebSocket implementation
    React.useEffect(() => {
        const UltimoMensaje = messages[messages.length - 1];
        if (!UltimoMensaje || UltimoMensaje.tipo !== 'remision-creada') return;

        const manejarMensajeRemisionCreada = async () => {
            try {
                const [siguienteNoRemision] = await ConsultarSiguienteNoRemision();
                setDatos(prev => ({ ...prev, NoRemision: siguienteNoRemision.SiguienteNoRemision }));
            } catch (error) {
                console.error('Error al consultar siguiente número de remisión:', error);
            }
        };

        manejarMensajeRemisionCreada();
    }, [messages]);

    // Manejador de cambios en el formulario
    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({
            ...prev,
            [name ?? '']: value,
            ...(name === 'Cliente' && { Proyecto: '' }),
            ...(name === 'IdCategoria' && { Equipo: '', PrecioUnidad: 0, PrecioTotal: 0 }),
            ...(name === 'Subarrendatario' && {
                Equipo: '',
                PrecioUnidad: 0,
                PrecioTotal: 0,
                IdCategoria: Number(null)
            }),
        }));
    };

    // ✅ Manejador específico para el DateTimePicker
    const handleFechaChange = (fecha: Dayjs | null) => {
        setDatos(prev => ({ ...prev, FechaRemision: fecha || dayjs() }));
    };

    // Función para mostrar mensajes de alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    // Agregar item a la remisión
    const agregarItem = () => {
        // Validaciones para TECNISERVICIOS
        if (esTecniservicios()) {
            if (datos.Cantidad > cantidadDisponible) {
                mostrarMensaje('La cantidad ingresada excede la disponible', 'error');
                return;
            }

            if (cantidadDisponible === 0) {
                mostrarMensaje('No hay disponibilidad de este equipo', 'error');
                return;
            }
        }

        if (!datos.Cantidad || datos.Cantidad <= 0) {
            mostrarMensaje('La cantidad debe ser mayor a cero', 'error');
            return;
        }

        if (!datos.Equipo) {
            mostrarMensaje('Debe seleccionar un equipo', 'error');
            return;
        }

        if (datos.PrecioUnidad < 0) {
            mostrarMensaje('El precio unidad no puede ser menor a cero', 'error');
            return;
        }

        if (datos.IVA < 0) {
            mostrarMensaje('El IVA% no puede ser menor a cero', 'error');
            return;
        }

        const equipoSeleccionado = equipos.find(e => e.value === datos.Equipo);
        const categoriaSeleccionada = categorias.find(e => e.value === datos.IdCategoria);
        const subarrendatarioSeleccionado = subarrendatarios.find(e => e.value === datos.Subarrendatario);

        if (!equipoSeleccionado) {
            mostrarMensaje('Equipo no encontrado', 'error');
            return;
        }

        // Verificar si el equipo ya fue agregado
        if (itemsRemision.some(e => e.value === equipoSeleccionado.value)) {
            mostrarMensaje('Este equipo ya fue agregado a la remisión', 'error');
            return;
        }

        // Verificar que tenemos todos los datos necesarios
        if (!categoriaSeleccionada || !subarrendatarioSeleccionado) {
            mostrarMensaje('Faltan datos requeridos para agregar el item', 'error');
            return;
        }

        // Crear nuevo item
        const nuevoItem: ItemRemision = {
            Subarrendatario: subarrendatarioSeleccionado.value.toString(),
            NombreSubarrendatario: subarrendatarioSeleccionado.label,
            value: equipoSeleccionado.value,
            label: equipoSeleccionado.label,
            IdCategoria: Number(categoriaSeleccionada.value),
            Categoria: categoriaSeleccionada.label,
            Cantidad: Number(datos.Cantidad),
            PrecioUnidad: Number(datos.PrecioUnidad),
            PrecioTotal: Number(datos.PrecioTotal),
            ObservacionesCliente: datos.ObservacionesCliente || '',
            IVA: Number(datos.IVA),
            PrecioTotalSinIVA: Number(datos.Cantidad * datos.PrecioUnidad)
        };

        // Agregar item y limpiar campos
        setItemsRemision(prev => [...prev, nuevoItem]);
        setDatos(prev => ({
            ...prev,
            Equipo: '',
            PrecioUnidad: 0,
            IVA: 19,
            PrecioTotal: 0,
            ObservacionesCliente: '',
            Cantidad: 0
        }));
        setCantidadDisponible(0);

        mostrarMensaje('Item agregado correctamente', 'success');
    };

    // Eliminar item de la remisión
    const eliminarItem = (id: string | number) => {
        setItemsRemision(prev => prev.filter(item => item.value !== id));
        mostrarMensaje('Item eliminado', 'success');
    };

    // Crear la remisión
    const handleCrearRemision = async () => {
        const esValido = await formularioRef.current?.manejarValidacion();

        if (!esValido) return;

        if (itemsRemision.length === 0) {
            mostrarMensaje('Debe agregar al menos un item', 'error');
            return;
        }

        const datosRemision = {
            NoRemision: datos.NoRemision,
            DocumentoCliente: datos.Cliente,
            IdProyecto: datos.Proyecto,
            IdBodega: null,
            DocumentoBodeguero: datos.Bodeguero,
            DocumentoDespachador: datos.Despachador,
            DocumentoTransportador: datos.Transportador,
            IdVehiculo: datos.Vehiculo === 'SinSeleccionar' ? null : datos.Vehiculo,
            PlacaVehiculoRecibe: datos.Placa,
            NombrePersonaRecibe: datos.Recibe,
            ObservacionesEmpresa: datos.ObservacionesEmpresa,
            UsuarioCreacion: datos.UsuarioCrecion,
            IdEstado: 8,
            PrecioTotalGeneralSinIVA: itemsRemision.reduce((acc, item) => acc + (item.PrecioTotalSinIVA ?? 0), 0),
            IVA: datos.IVA,
            PrecioTotalGeneralConIVA: itemsRemision.reduce((acc, item) => acc + (item.PrecioTotal ?? 0), 0),
            Detalles: itemsRemision.map(item => ({
                DocumentoSubarrendatario: item.Subarrendatario,
                IdCategoria: item.IdCategoria,
                IdEquipo: item.value,
                Cantidad: item.Cantidad,
                PrecioUnidad: item.PrecioUnidad,
                PrecioTotal: item.PrecioTotal,
                ObservacionesCliente: item.ObservacionesCliente
            })),
            FechaRemision: datos.FechaRemision.format('YYYY-MM-DD HH:mm:ss')
        };

        try {
            await CrearRemision(datosRemision);
            mostrarMensaje('Remisión creada correctamente', 'success');
            sendMessage('remision-creada', {});

            // Resetear formulario
            setDatos({
                Cliente: '',
                Proyecto: '',
                IdCategoria: Number(null),
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
                FechaRemision: dayjs(),
            });

            setItemsRemision([]);
            setCantidadDisponible(0);

            // Cargar nuevo número de remisión
            const [siguienteNoRemision] = await ConsultarSiguienteNoRemision();
            setDatos(prev => ({ ...prev, NoRemision: siguienteNoRemision.SiguienteNoRemision }));
        } catch (error) {
            console.error('Error al crear remisión: ', error);
            mostrarMensaje('Error al crear la remisión', 'error');
        }
    };

    // Reglas de validación
    const reglasValidacion = [
        { campo: 'Cliente', mensaje: 'El cliente es obligatorio' },
        { campo: 'Proyecto', mensaje: 'El proyecto es obligatorio' },
        { campo: 'Subarrendatario', mensaje: 'El subarrendatario es obligatorio' },
        { campo: 'Bodeguero', mensaje: 'El bodeguero es obligatorio' },
        { campo: 'Despachador', mensaje: 'El despachador es obligatorio' },
        // { campo: 'Transportador', mensaje: 'El conductor es obligatorio' },
        // { campo: 'Vehiculo', mensaje: 'El vehículo es obligatorio' },
    ];

    // Precio total general
    const precioTotalGeneral = itemsRemision.reduce((acc, item) => acc + (item.PrecioTotal ?? 0), 0);

    return (
        <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                <Typography variant="subtitle1" color="text.primary">
                    Creación de remisión
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                    <Input
                        label="Remisión No:"
                        value={datos.NoRemision}
                        onChange={handleChange}
                        tamano="small"
                        tipo_input="text"
                        valorname="NoRemision"
                        bloqueado
                    />
                </Typography>
            </Box>

            <Divider />

            <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <FechayHora
                            label="Fecha y hora"
                            value={datos.FechaRemision}
                            onChange={handleFechaChange}
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Empresa/Cliente"
                            value={datos.Cliente}
                            options={clientes}
                            size="small"
                            onChange={handleChange}
                            valorname="Cliente"
                            required
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Proyecto"
                            value={datos.Proyecto}
                            options={proyectos}
                            size="small"
                            onChange={handleChange}
                            valorname="Proyecto"
                            required
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Subarrendatario"
                            value={datos.Subarrendatario}
                            options={subarrendatarios}
                            size="small"
                            onChange={handleChange}
                            valorname="Subarrendatario"
                            required
                        />
                    </Grid>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Categoría"
                            value={datos.IdCategoria}
                            options={categorias}
                            size="small"
                            onChange={handleChange}
                            valorname="IdCategoria"
                            required
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelectConEstado
                            label="Equipo disponible"
                            value={datos.Equipo}
                            options={equipos}
                            size="small"
                            onChange={handleChange}
                            valorname="Equipo"
                            required
                        />
                    </Grid>

                    <Grid md={1.5} xs={12} mt={0.5}>
                        <Input
                            label="Cantidad"
                            value={datos.Cantidad}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="Cantidad"
                            required
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label="Precio unidad"
                            value={datos.PrecioUnidad}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="PrecioUnidad"
                            required
                        />
                    </Grid>

                    <Grid md={1.5} xs={12} mt={0.5}>
                        <Input
                            label="IVA %"
                            value={datos.IVA}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="number"
                            valorname="IVA"
                            required
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label="Precio total"
                            value={datos.PrecioTotal}
                            tamano="small"
                            tipo_input="number"
                            valorname="PrecioTotal"
                            bloqueado
                        />
                    </Grid>

                    {/* Mostrar cantidad disponible solo para TECNISERVICIOS */}
                    {esTecniservicios() && (
                        <Grid md={3} xs={12} mt={0.5}>
                            <Input
                                label="Cantidad disponible"
                                value={cantidadDisponible}
                                tamano="small"
                                tipo_input="number"
                                bloqueado
                            />
                        </Grid>
                    )}
                </Grid>
            </CardContent>

            <Divider />

            <CardContent sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Bodeguero"
                            value={datos.Bodeguero}
                            options={bodegueros}
                            size="small"
                            onChange={handleChange}
                            valorname="Bodeguero"
                            required
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Despachador"
                            value={datos.Despachador}
                            options={despachadores}
                            size="small"
                            onChange={handleChange}
                            valorname="Despachador"
                            required
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Conductor"
                            value={datos.Transportador}
                            options={transportadores}
                            size="small"
                            onChange={handleChange}
                            valorname="Transportador"
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label="Vehículo"
                            value={datos.Vehiculo}
                            options={vehiculos}
                            size="small"
                            onChange={handleChange}
                            valorname="Vehiculo"
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label="Recibe"
                            value={datos.Recibe}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="Recibe"
                        />
                    </Grid>

                    <Grid md={3} xs={12} mt={0.5}>
                        <Input
                            label="Placa"
                            value={datos.Placa}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="text"
                            valorname="Placa"
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <CardContent sx={{ paddingTop: '0px', paddingBottom: '10px' }}>
                <Grid container spacing={1}>
                    <Grid md={6} xs={12} mt={0.5}>
                        <Input
                            label="Observaciones Empresa"
                            value={datos.ObservacionesEmpresa}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="textarea"
                            valorname="ObservacionesEmpresa"
                        />
                    </Grid>

                    <Grid md={6} xs={12} mt={0.5}>
                        <Input
                            label="Observaciones Cliente"
                            value={datos.ObservacionesCliente}
                            onChange={handleChange}
                            tamano="small"
                            tipo_input="textarea"
                            valorname="ObservacionesCliente"
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
                <Typography>Total items: {itemsRemision.length}</Typography>

                <Button
                    variant="text"
                    onClick={agregarItem}
                    disabled={!datos.Equipo || !datos.Cantidad}
                >
                    Agregar item
                </Button>

                <ModalVerItemsRemision
                    items={itemsRemision}
                    onEliminarItem={eliminarItem}
                    precioTotalGeneral={precioTotalGeneral}
                />

                <Button
                    variant="contained"
                    onClick={handleCrearRemision}
                    disabled={itemsRemision.length === 0}
                >
                    Crear remisión
                </Button>

                <FormularioValidator
                    ref={formularioRef}
                    datos={datos}
                    reglasValidacion={reglasValidacion}
                />
            </CardActions>

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />

            {/* Modal para cantidad cero */}
            <Modal
                open={modalCantidadCeroAbierto}
                // onClose={() => setModalCantidadCeroAbierto(false)}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setModalCantidadCeroAbierto(false);
                    }
                }}
                aria-labelledby="modal-cantidad-cero"
                aria-describedby="modal-cantidad-cero-descripcion"
            >
                <ModalContent>
                    <Typography id="modal-cantidad-cero" variant="h6" component="h2" gutterBottom>
                        Equipo No Disponible
                    </Typography>
                    <Typography id="modal-cantidad-cero-descripcion" sx={{ mt: 2, mb: 3 }} style={{ textAlign: 'justify' }}>
                        El equipo seleccionado no tiene disponibilidad en este momento.
                        Por favor, seleccione otro equipo o contacte a un subarrendatario.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setModalCantidadCeroAbierto(false)}
                        fullWidth
                    >
                        Cerrar
                    </Button>
                </ModalContent>
            </Modal>
        </Card>
    );
}