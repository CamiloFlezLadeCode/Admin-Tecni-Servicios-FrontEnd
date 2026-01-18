'use client';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import InputSelectConEstado from '@/components/dashboard/componentes_generales/formulario/SelectConEstado';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { UserContext } from '@/contexts/user-context';
import { EmpresaAnfitriona, OpcionPorDefectoNumber, ParametroBuscarBodegasAlquiler } from '@/lib/constants/option-default';
import { OrdenarSubarrendatarios } from '@/lib/order/orders';
import { MostrarItemsRemision } from '@/services/comercial/devoluciones/MostrarItemsRemisionService';
import { ActualizarRemision } from '@/services/comercial/remisiones/ActualizarRemisionService';
import { ConsultarCantidadDisponibleEquipo } from '@/services/comercial/remisiones/ConsultarCantidadDisponibleEquipoService';
import { ConsultarRemisionPorId } from '@/services/comercial/remisiones/ConsultarRemisionPorIdService';
import { ListarEquipos } from '@/services/comercial/remisiones/ListarEquiposService';
import { VerDisponibilidadDeEquipos } from '@/services/comercial/remisiones/VerDisponibilidadDeEquiposService';
import { ListarCategorias } from '@/services/generales/ListarCategoriasServices';
import { ListarSubarrendatarios } from '@/services/generales/ListarSubarrendatariosService';
import {
    Box,
    Button,
    Card,
    CardActions,
    Divider,
    IconButton,
    Modal,
    Paper,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple, Plus, Trash, Truck, X } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

interface ItemRemision {
    IdDetalleRemision?: number;
    value: string | number;
    label: string;
    IdCategoria: number;
    Categoria: string;
    Cantidad: number;
    CantidadDisponible?: number;
    ObservacionesCliente?: string;
    Subarrendatario: string;
    NombreSubarrendatario: string;
    PrecioUnidad: number;
    PrecioTotal: number;
    IVA: number;
    PrecioTotalSinIVA: number;
}

interface EditarRemisionProps {
    readonly IdRemision: number;
    readonly onSuccess: () => void;
    readonly onMostrarMensaje: (mensaje: string, tipo: 'success' | 'error' | 'warning') => void;
}

export function EditarRemision({ IdRemision, onSuccess, onMostrarMensaje }: EditarRemisionProps): React.JSX.Element {
    // Contexto del usuario
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [categorias, setCategorias] = React.useState<{ value: string | number; label: string }[]>([]);
    const [subarrendatarios, setSubarrendatarios] = React.useState<{ value: string | number; label: string }[]>([]);
    const [equipos, setEquipos] = React.useState<any[]>([]);

    const [datosGenerales, setDatosGenerales] = React.useState({
        NoRemision: '',
        ObservacionesEmpresa: '',
        IVA: 0,
        IncluyeTransporte: 0,
        ValorTransporte: 0
    });

    const [items, setItems] = React.useState<ItemRemision[]>([]);
    const [cantidadesOriginales, setCantidadesOriginales] = React.useState<{ [key: string | number]: number }>({});

    // Estados para nuevo item
    const [nuevoItem, setNuevoItem] = React.useState({
        Subarrendatario: EmpresaAnfitriona.value,
        IdCategoria: OpcionPorDefectoNumber.value,
        Equipo: '',
        Cantidad: 1,
        PrecioUnidad: 0,
        IVA: 19,
        ObservacionesCliente: ''
    });

    const [cantidadDisponible, setCantidadDisponible] = React.useState(0);
    const [cargandoDisponibilidad, setCargandoDisponibilidad] = React.useState(false);

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        try {
            const [
                remisionRes,
                itemsRes,
                categoriasRes,
                subRes
            ] = await Promise.all([
                ConsultarRemisionPorId(IdRemision),
                MostrarItemsRemision(IdRemision),
                ListarCategorias(),
                ListarSubarrendatarios()
            ]);

            const remision = Array.isArray(remisionRes) ? remisionRes[0] : remisionRes;

            setDatosGenerales({
                NoRemision: remision.NoRemision,
                ObservacionesEmpresa: remision.ObservacionesInternasEmpresa || remision.ObservacionesEmpresa || '',
                IVA: remision.IVA || 19,
                IncluyeTransporte: Number(remision.IncluyeTransporte) || 0,
                ValorTransporte: Number(remision.ValorTransporte) || 0
            });

            // Usar Detalles de la remisión si existen, si no usar itemsRes
            const itemsRaw = remision.Detalles || itemsRes || [];

            // Guardar cantidades originales para el cálculo de disponibilidad (Stock + Cantidad Actual)
            // IMPORTANTE: Solo sumar cantidades de la Empresa Anfitriona para el stock propio
            const originales: { [key: string | number]: number } = {};
            itemsRaw.forEach((item: any) => {
                if (item.IdEquipo !== 0 && (item.DocumentoSubarrendatario === EmpresaAnfitriona.value || item.Subarrendatario === EmpresaAnfitriona.value)) {
                    originales[item.IdEquipo] = (originales[item.IdEquipo] || 0) + item.Cantidad;
                }
            });
            setCantidadesOriginales(originales);

            // Mapear items de la API a la interfaz ItemRemision
            const mappedItems = await Promise.all(itemsRaw.map(async (item: any) => {
                const isAnfitriona = item.DocumentoSubarrendatario === EmpresaAnfitriona.value;
                let stock = 0;
                if (isAnfitriona && item.IdEquipo !== 0) {
                    try {
                        const [dispo] = await ConsultarCantidadDisponibleEquipo(Number(item.IdEquipo));
                        // Disponibilidad real = Stock en bodega + Lo que ya tiene esta remisión
                        stock = dispo.CantidadDisponible + (originales[item.IdEquipo] || 0);
                    } catch (e) {
                        console.error('Error cargando stock para item:', item.IdEquipo, e);
                    }
                }

                return {
                    IdDetalleRemision: item.IdDetalleRemision,
                    value: item.IdEquipo,
                    label: (item.IdEquipo === 0 || item.NombreEquipo === 'Transporte') ? 'Transporte' : (item.NombreEquipo || item.Equipo),
                    IdCategoria: item.IdCategoria || 0,
                    Categoria: item.NombreCategoria || item.Categoria || ((item.IdEquipo === 0 || item.NombreEquipo === 'Transporte') ? 'Servicio' : ''),
                    Cantidad: item.Cantidad,
                    CantidadDisponible: stock,
                    PrecioUnidad: Number(item.PrecioUnidad),
                    PrecioTotal: Number(item.PrecioTotal),
                    IVA: (item.IdEquipo === 0 || item.NombreEquipo === 'Transporte') ? 0 : (Number(item.IVA) || 0),
                    PrecioTotalSinIVA: Number(item.PrecioTotalSinIVA),
                    Subarrendatario: item.DocumentoSubarrendatario || '',
                    NombreSubarrendatario: item.NombreSubarrendatario || 'N/A',
                    ObservacionesCliente: item.ObservacionesCliente || ''
                };
            }));
            setItems(mappedItems);

            setCategorias(categoriasRes);
            setSubarrendatarios(await OrdenarSubarrendatarios({ AllSubarrendatarios: subRes }));

        } catch (error) {
            onMostrarMensaje(`Error al cargar la remisión: ${error}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setOpen(false);

        // Reiniciar todos los estados a sus valores iniciales
        setDatosGenerales({
            NoRemision: '',
            ObservacionesEmpresa: '',
            IVA: 0,
            IncluyeTransporte: 0,
            ValorTransporte: 0
        });

        setItems([]);
        setCantidadesOriginales({});
        setEquipos([]);
        setCantidadDisponible(0);

        setNuevoItem({
            Subarrendatario: EmpresaAnfitriona.value,
            IdCategoria: OpcionPorDefectoNumber.value,
            Equipo: '',
            Cantidad: 1,
            PrecioUnidad: 0,
            IVA: 19,
            ObservacionesCliente: ''
        });
    };

    const handleChangeGenerales = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => {
        const { name, value } = e.target;
        const newValue = value;

        setDatosGenerales(prev => ({ ...prev, [name]: newValue }));

        // Si cambia el IVA general, actualizar todos los items (excepto transporte)
        if (name === 'IVA') {
            const nuevoIVA = Number(newValue) || 0;
            setItems(prevItems => prevItems.map(item => {
                if (item.value === 0 || item.label === 'Transporte') {
                    return item;
                }
                const precioTotalSinIVA = item.Cantidad * item.PrecioUnidad;
                return {
                    ...item,
                    IVA: nuevoIVA,
                    PrecioTotalSinIVA: precioTotalSinIVA,
                    PrecioTotal: precioTotalSinIVA * (1 + nuevoIVA / 100)
                };
            }));
        }
    };

    const handleChangeNuevoItem = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => {
        setNuevoItem(prev => ({ ...prev, Cantidad: 1 }))
        const { name, value } = e.target;
        setNuevoItem(prev => ({ ...prev, [name]: value }));
    };

    // Cargar equipos cuando cambia categoría o subarrendatario en el nuevo item
    React.useEffect(() => {
        const cargarEquipos = async () => {
            if (!nuevoItem.IdCategoria || nuevoItem.IdCategoria === OpcionPorDefectoNumber.value) {
                setEquipos([]);
                setNuevoItem(prev => ({ ...prev, Equipo: '' }));
                setCantidadDisponible(0);
                return;
            }

            // Reiniciar equipo y disponibilidad al cambiar categoría o subarrendatario
            setNuevoItem(prev => ({ ...prev, Equipo: '' }));
            setCantidadDisponible(0);

            try {
                let equiposRes = [];
                if (nuevoItem.Subarrendatario === EmpresaAnfitriona.value) {
                    equiposRes = await VerDisponibilidadDeEquipos({
                        IdCategoria: nuevoItem.IdCategoria,
                        DocumentoSubarrendatario: nuevoItem.Subarrendatario
                    });
                } else {
                    equiposRes = await ListarEquipos({
                        IdCategoria: nuevoItem.IdCategoria,
                        IdTipoBodega: ParametroBuscarBodegasAlquiler.value
                    });
                }
                setEquipos(equiposRes);
            } catch (error) {
                console.error(error);
            }
        };
        if (open) cargarEquipos();
    }, [nuevoItem.IdCategoria, nuevoItem.Subarrendatario, open]);

    // Cargar disponibilidad cuando cambia el equipo
    React.useEffect(() => {
        const cargarDisponibilidad = async () => {
            if (!nuevoItem.Equipo) {
                setCantidadDisponible(0);
                return;
            }
            setCargandoDisponibilidad(true);
            try {
                const [disponibilidad] = await ConsultarCantidadDisponibleEquipo(Number(nuevoItem.Equipo));
                // Disponibilidad real = Stock en bodega + Cantidad original en esta remisión
                const stockMasOriginal = disponibilidad.CantidadDisponible + (cantidadesOriginales[nuevoItem.Equipo] || 0);
                setCantidadDisponible(stockMasOriginal);
                setNuevoItem(prev => ({
                    ...prev,
                    PrecioUnidad: disponibilidad.PrecioAlquiler || 0,
                    Cantidad: 1
                }));
            } catch (error) {
                console.error(error);
                setCantidadDisponible(0);
            } finally {
                // Pequeña espera para evitar el flash del bug visual
                setTimeout(() => {
                    setCargandoDisponibilidad(false);
                }, 300);
            }
        };
        if (open) cargarDisponibilidad();
    }, [nuevoItem.Equipo, open]);

    const agregarItem = () => {
        if (!nuevoItem.Equipo || nuevoItem.Cantidad <= 0) {
            onMostrarMensaje('Complete los datos del item', 'error');
            return;
        }

        // Validar disponibilidad si es empresa anfitriona
        if (nuevoItem.Subarrendatario === EmpresaAnfitriona.value && nuevoItem.Cantidad > cantidadDisponible) {
            onMostrarMensaje(`La cantidad solicitada (${nuevoItem.Cantidad}) supera la disponibilidad actual (${cantidadDisponible})`, 'error');
            return;
        }

        const equipoSel = equipos.find(e => e.value === nuevoItem.Equipo);
        const catSel = categorias.find(c => c.value === nuevoItem.IdCategoria);
        const subSel = subarrendatarios.find(s => s.value === nuevoItem.Subarrendatario);

        const precioTotalSinIVA = nuevoItem.Cantidad * nuevoItem.PrecioUnidad;
        const ivaGeneral = Number(datosGenerales.IVA) || 0;
        const precioTotal = precioTotalSinIVA * (1 + (ivaGeneral / 100));

        const item: ItemRemision = {
            value: nuevoItem.Equipo,
            label: equipoSel?.label || '',
            IdCategoria: Number(nuevoItem.IdCategoria),
            Categoria: catSel?.label || '',
            Cantidad: Number(nuevoItem.Cantidad),
            CantidadDisponible: nuevoItem.Subarrendatario === EmpresaAnfitriona.value ? cantidadDisponible : 0,
            PrecioUnidad: Number(nuevoItem.PrecioUnidad),
            IVA: ivaGeneral,
            PrecioTotal: precioTotal,
            PrecioTotalSinIVA: precioTotalSinIVA,
            Subarrendatario: nuevoItem.Subarrendatario.toString(),
            NombreSubarrendatario: subSel?.label || '',
            ObservacionesCliente: nuevoItem.ObservacionesCliente
        };

        setItems(prev => [...prev, item]);
        setNuevoItem({
            Subarrendatario: EmpresaAnfitriona.value,
            IdCategoria: OpcionPorDefectoNumber.value,
            Equipo: '',
            Cantidad: 1,
            PrecioUnidad: 0,
            IVA: 19,
            ObservacionesCliente: ''
        });
    };

    const eliminarItem = (index: number) => {
        const itemAEliminar = items[index];
        if (itemAEliminar.value === 0 || itemAEliminar.label === 'Transporte') {
            setDatosGenerales(prev => ({ ...prev, IncluyeTransporte: 0, ValorTransporte: 0 }));
        }
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const agregarTransporte = () => {
        if (items.some(item => item.value === 0 || item.label === 'Transporte')) {
            onMostrarMensaje('La remisión ya incluye un servicio de transporte', 'error');
            return;
        }

        const itemTransporte: ItemRemision = {
            value: 0,
            label: 'Transporte',
            IdCategoria: 0,
            Categoria: 'Servicio',
            Cantidad: 1,
            PrecioUnidad: 0,
            IVA: 0,
            PrecioTotal: 0,
            PrecioTotalSinIVA: 0,
            Subarrendatario: '',
            NombreSubarrendatario: 'N/A',
            ObservacionesCliente: 'Item de transporte'
        };

        setItems(prev => [...prev, itemTransporte]);
        setDatosGenerales(prev => ({ ...prev, IncluyeTransporte: 1, ValorTransporte: 0 }));
    };

    const handleEditItemChange = (index: number, field: string, value: any) => {
        setItems(prev => {
            const newItems = [...prev];
            const item = { ...newItems[index] };

            // Validar si la cantidad excede la disponibilidad (solo para Empresa Anfitriona)
            if (field === 'Cantidad' && item.Subarrendatario === EmpresaAnfitriona.value && item.value !== 0) {
                const nuevaCantidad = Number(value) || 0;
                const disponible = item.CantidadDisponible || 0;
                if (nuevaCantidad > disponible) {
                    onMostrarMensaje(`La cantidad (${nuevaCantidad}) supera la disponibilidad (${disponible})`, 'error');
                    return prev; // No aplicar el cambio
                }
            }

            (item as any)[field] = value;

            // Recalcular totales si cambia cantidad o precio
            if (field === 'Cantidad' || field === 'PrecioUnidad') {
                const esTransporte = item.value === 0 || item.label === 'Transporte';
                const ivaAplicable = esTransporte ? 0 : (Number(datosGenerales.IVA) || 0);

                const precioTotalSinIVA = (Number(item.Cantidad) || 0) * (Number(item.PrecioUnidad) || 0);
                item.PrecioTotalSinIVA = precioTotalSinIVA;
                item.IVA = ivaAplicable;
                item.PrecioTotal = precioTotalSinIVA * (1 + (ivaAplicable / 100));

                // Sincronizar ValorTransporte si el item editado es el de transporte
                if (esTransporte) {
                    setDatosGenerales(prevGen => ({ ...prevGen, ValorTransporte: Number(item.PrecioUnidad) }));
                }
            }

            newItems[index] = item;
            return newItems;
        });
    };

    const handleGuardar = async () => {
        if (items.length === 0) {
            onMostrarMensaje('La remisión debe tener al menos un item', 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                IdRemision,
                ObservacionesEmpresa: datosGenerales.ObservacionesEmpresa,
                IVA: datosGenerales.IVA,
                IncluyeTransporte: datosGenerales.IncluyeTransporte,
                ValorTransporte: datosGenerales.ValorTransporte,
                PrecioTotalGeneralSinIVA: items.reduce((acc, item) => acc + Number(item.PrecioTotalSinIVA), 0),
                PrecioTotalGeneralConIVA: items.reduce((acc, item) => acc + Number(item.PrecioTotal), 0),
                Detalles: items.map(item => ({
                    IdDetalleRemision: item.IdDetalleRemision,
                    IdEquipo: item.value,
                    Cantidad: item.Cantidad,
                    PrecioUnidad: item.PrecioUnidad,
                    IVA: item.IVA,
                    PrecioTotal: item.PrecioTotal,
                    PrecioTotalSinIVA: item.PrecioTotalSinIVA,
                    DocumentoSubarrendatario: item.Subarrendatario || null,
                    IdCategoria: item.IdCategoria,
                    ObservacionesCliente: item.ObservacionesCliente
                })),
                UsuarioQueActualiza: documentoUsuarioActivo
            };

            const response = await ActualizarRemision(payload);
            if (response.status === 200) {
                onMostrarMensaje('Remisión actualizada con éxito', 'success');
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 1500);
            } else if (response.status === 204) {
                onMostrarMensaje('No se realizó ningún cambio', 'warning');
            }

        } catch (error) {
            onMostrarMensaje(`Error al actualizar la remisión: ${error}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="Editar remisión">
                <IconButton size="small" color="primary" onClick={handleOpen}>
                    <PencilSimple size={20} weight="bold" />
                </IconButton>
            </Tooltip>

            <Modal
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose();
                    }
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 1200,
                    maxHeight: '95vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflowY: 'auto'
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">Editar Remisión: {datosGenerales.NoRemision}</Typography>
                        <IconButton onClick={handleClose} disabled={loading}>
                            <X size={24} />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                        <Grid xs={12} md={1.5}>
                            <Input
                                label="IVA General %"
                                value={datosGenerales.IVA}
                                onChange={handleChangeGenerales}
                                valorname="IVA"
                                tipo_input="number"
                                tamano="small"
                            />
                        </Grid>
                        <Grid xs={12} md={7.5}>
                            <Input
                                label="Observaciones Empresa"
                                value={datosGenerales.ObservacionesEmpresa}
                                onChange={handleChangeGenerales}
                                valorname="ObservacionesEmpresa"
                                tipo_input="text"
                                tamano="small"
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 4, mb: 2 }}>
                        <Typography variant="h6">Agregar / Editar Items</Typography>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<Truck />}
                            onClick={agregarTransporte}
                            disabled={items.some(item => item.value === 0)}
                        >
                            Agregar Transporte
                        </Button>
                    </Box>
                    <Card variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid xs={12} md={nuevoItem.Subarrendatario === EmpresaAnfitriona.value ? 2.2 : 3}>
                                <InputSelect
                                    label="Subarrendatario"
                                    value={nuevoItem.Subarrendatario}
                                    options={subarrendatarios}
                                    onChange={handleChangeNuevoItem}
                                    valorname="Subarrendatario"
                                />
                            </Grid>
                            <Grid xs={12} md={nuevoItem.Subarrendatario === EmpresaAnfitriona.value ? 2.2 : 3}>
                                <InputSelect
                                    label="Categoría"
                                    value={nuevoItem.IdCategoria}
                                    options={categorias}
                                    onChange={handleChangeNuevoItem}
                                    valorname="IdCategoria"
                                />
                            </Grid>
                            <Grid xs={12} md={nuevoItem.Subarrendatario === EmpresaAnfitriona.value ? 2.2 : 3}>
                                <InputSelectConEstado
                                    label="Equipo"
                                    value={nuevoItem.Equipo}
                                    options={equipos}
                                    onChange={handleChangeNuevoItem}
                                    valorname="Equipo"
                                />
                            </Grid>
                            <Grid xs={6} md={2}>
                                <Input
                                    label="Cantidad"
                                    value={nuevoItem.Cantidad}
                                    onChange={handleChangeNuevoItem}
                                    valorname="Cantidad"
                                    tipo_input="number"
                                    tamano="small"
                                    error={!cargandoDisponibilidad && nuevoItem.Subarrendatario === EmpresaAnfitriona.value && nuevoItem.Equipo !== '' && nuevoItem.Equipo !== OpcionPorDefectoNumber.value.toString() && nuevoItem.Cantidad > cantidadDisponible}
                                    helperText={!cargandoDisponibilidad && nuevoItem.Subarrendatario === EmpresaAnfitriona.value && nuevoItem.Equipo !== '' && nuevoItem.Equipo !== OpcionPorDefectoNumber.value.toString() && nuevoItem.Cantidad > cantidadDisponible ? 'Excede disponible' : ''}
                                />
                            </Grid>
                            {nuevoItem.Subarrendatario === EmpresaAnfitriona.value && (
                                <Grid xs={6} md={1.2}>
                                    <Input
                                        label="Disponible"
                                        value={cantidadDisponible}
                                        tipo_input="number"
                                        tamano="small"
                                        bloqueado={true}
                                    />
                                </Grid>
                            )}
                            <Grid xs={6} md={nuevoItem.Subarrendatario === EmpresaAnfitriona.value ? 1.5 : 1.5}>
                                <Input
                                    label="Precio Unit."
                                    value={nuevoItem.PrecioUnidad}
                                    onChange={handleChangeNuevoItem}
                                    valorname="PrecioUnidad"
                                    tipo_input="number"
                                    tamano="small"
                                />
                            </Grid>
                            <Grid xs={12} md={10}>
                                <Input
                                    label="Observaciones Item (Opcional)"
                                    value={nuevoItem.ObservacionesCliente}
                                    onChange={handleChangeNuevoItem}
                                    valorname="ObservacionesCliente"
                                    tipo_input="text"
                                    tamano="small"
                                />
                            </Grid>
                            <Grid xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<Plus />}
                                    onClick={agregarItem}
                                    sx={{ height: '40px' }}
                                >
                                    Agregar
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>

                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#eee' }}>
                                <TableRow>
                                    <TableCell>Equipo</TableCell>
                                    <TableCell>Subarrendatario</TableCell>
                                    <TableCell align="right">Cant.</TableCell>
                                    {items.some(item => item.Subarrendatario === EmpresaAnfitriona.value && item.value !== 0) && (
                                        <TableCell align="right">Cant. Dispo.</TableCell>
                                    )}
                                    <TableCell align="right">Precio Unit.</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={item.IdDetalleRemision}>
                                        <TableCell>{item.label}</TableCell>
                                        <TableCell>{item.NombreSubarrendatario}</TableCell>
                                        <TableCell align="right" sx={{ width: '130px' }}>
                                            <Input
                                                value={item.Cantidad}
                                                onChange={(e) => handleEditItemChange(index, 'Cantidad', Number(e.target.value))}
                                                tipo_input="number"
                                                tamano="small"
                                                label=""
                                            />
                                        </TableCell>
                                        {items.some(i => i.Subarrendatario === EmpresaAnfitriona.value && i.value !== 0) && (
                                            <TableCell align="right" sx={{ width: '130px' }}>
                                                {item.Subarrendatario === EmpresaAnfitriona.value && item.value !== 0 ? (
                                                    <Input
                                                        value={item.CantidadDisponible || 0}
                                                        tipo_input="number"
                                                        tamano="small"
                                                        label=""
                                                        bloqueado={true}
                                                    />
                                                ) : '-'}
                                            </TableCell>
                                        )}
                                        <TableCell align="right" sx={{ width: '150px' }}>
                                            <Input
                                                value={item.PrecioUnidad}
                                                onChange={(e) => handleEditItemChange(index, 'PrecioUnidad', Number(e.target.value))}
                                                tipo_input="number"
                                                tamano="small"
                                                label=''
                                            />
                                        </TableCell>
                                        <TableCell align="right">${item.PrecioTotal.toLocaleString()}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="error" onClick={() => eliminarItem(index)}>
                                                <Trash size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={items.some(i => i.Subarrendatario === EmpresaAnfitriona.value && i.value !== 0) ? 7 : 6} align="center" sx={{ py: 3 }}>
                                            No hay items en la remisión
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">Total sin IVA</Typography>
                            <Typography variant="h6">${items.reduce((acc, item) => acc + item.PrecioTotalSinIVA, 0).toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" color="text.secondary">Total con IVA</Typography>
                            <Typography variant="h5" color="primary.main">${items.reduce((acc, item) => acc + item.PrecioTotal, 0).toLocaleString()}</Typography>
                        </Box>
                    </Box>

                    <CardActions sx={{ justifyContent: 'flex-end', mt: 4, px: 0 }}>
                        <Button variant="outlined" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleGuardar} disabled={loading}>
                            Guardar Cambios
                        </Button>
                    </CardActions>
                </Box>
            </Modal>

            <MensajeDeCarga MostrarMensaje={loading} Mensaje="Procesando..." />
        </>
    );
}
