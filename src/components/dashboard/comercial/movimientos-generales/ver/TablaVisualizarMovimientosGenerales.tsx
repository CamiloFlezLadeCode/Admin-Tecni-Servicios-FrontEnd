'use client';

import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    useTheme,
    Button,
    SelectChangeEvent,
    Paper,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Calendar,
    Funnel,
    FileText,
    ArrowCircleRight,
    ArrowCircleLeft,
    Wrench,
    DownloadSimple,
    MagnifyingGlass,
    MicrosoftExcelLogo,
    Eraser
} from '@phosphor-icons/react';
import dayjs, { Dayjs } from 'dayjs';
import { DataTable, ActionDefinition, ColumnDefinition } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { VerMovimientosGenerales, MovimientoGeneral } from '@/services/comercial/movimientos_generales/VerMovimientosGeneralesService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import { VisualizarPDFRemision } from '@/services/comercial/remisiones/ObtenerPDFRemisionService';
import { ObtenerPDFDevolucion } from '@/services/comercial/devoluciones/ObtenerPDFDevolucionService';
import { ObtenerPDFOrdenDeServicio } from '@/services/comercial/ordenes_de_servicio/ObtenerPDFOrdenDeServicioService';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { OpcionPorDefecto } from '@/lib/constants/option-default';
import FechayHora from '@/components/dashboard/componentes_generales/formulario/DateTimePicker';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

export function TablaVisualizarMovimientosGenerales(): React.JSX.Element {
    const theme = useTheme();
    const [data, setData] = React.useState<MovimientoGeneral[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Estados para alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'info' | 'error' | 'warning'>('success');

    // Filtros
    const [clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([]);
    const [proyectos, setProyectos] = React.useState<{ value: string | number; label: string }[]>([]);
    const [filtros, setFiltros] = React.useState({
        Cliente: OpcionPorDefecto.value,
        Proyecto: 'Todos',
        FechaInicio: dayjs().startOf('month'),
        FechaFin: dayjs().endOf('month'),
    });

    // Cargar clientes al inicio
    React.useEffect(() => {
        const cargarClientes = async () => {
            try {
                const resClientes = await ListarClientes();
                setClientes([OpcionPorDefecto, ...resClientes]);
            } catch (err) {
                console.error('Error al cargar clientes:', err);
            }
        };
        cargarClientes();
    }, []);

    // Cargar proyectos cuando cambie el cliente
    React.useEffect(() => {
        const cargarProyectos = async () => {
            try {
                const params = filtros.Cliente !== OpcionPorDefecto.value ? { Cliente: filtros.Cliente } : undefined;
                const resProyectos = await ListarProyectos(params);
                setProyectos([{ value: 'Todos', label: 'Todos los Proyectos' }, ...resProyectos]);
                // Si el proyecto actual no está en la nueva lista, resetear a 'Todos'
                if (filtros.Proyecto !== 'Todos' && !resProyectos.find((p: any) => p.value === filtros.Proyecto)) {
                    setFiltros(prev => ({ ...prev, Proyecto: 'Todos' }));
                }
            } catch (err) {
                console.error('Error al cargar proyectos:', err);
                setProyectos([{ value: 'Todos', label: 'Todos los Proyectos' }]);
            }
        };
        cargarProyectos();
    }, [filtros.Cliente]);

    const handleClearFilters = () => {
        setFiltros({
            Cliente: OpcionPorDefecto.value,
            Proyecto: 'Todos',
            FechaInicio: dayjs().startOf('month'),
            FechaFin: dayjs().endOf('month'),
        });
        setData([]);
    };

    const exportToCSV = () => {
        if (data.length === 0) return;

        const headers = ['Tipo', 'No. Documento', 'Fecha', 'Cliente', 'Proyecto', 'Valor Total', 'Estado'];
        const csvRows = [
            headers.join(','),
            ...data.map(row => [
                row.TipoMovimiento,
                row.NoMovimiento,
                dayjs(row.Fecha).format('DD/MM/YYYY'),
                `"${row.Cliente}"`,
                `"${row.Proyecto}"`,
                row.Total || 0,
                row.Estado
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Movimientos_${dayjs().format('YYYY-MM-DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchData = React.useCallback(async () => {
        // No ejecutar si el rango de fechas es inválido
        if (filtros.FechaFin.isBefore(filtros.FechaInicio)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await VerMovimientosGenerales({
                FechaInicio: filtros.FechaInicio.format('YYYY-MM-DD'),
                FechaFin: filtros.FechaFin.format('YYYY-MM-DD'),
                DocumentoCliente: filtros.Cliente !== OpcionPorDefecto.value ? String(filtros.Cliente) : undefined,
                IdProyecto: filtros.Proyecto !== 'Todos' ? filtros.Proyecto : undefined,
            });
            setData(response);
        } catch (err: any) {
            setMensajeAlerta(err.message || 'Error al cargar los movimientos');
            setTipoAlerta('error');
            setMostrarAlertas(true);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    // Cargar movimientos automáticamente cuando cambien los filtros
    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e: SelectChangeEvent<string | number>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, value: Dayjs | null) => {
        if (value) {
            setFiltros(prev => ({ ...prev, [name]: value }));

            // Validaciones visuales inmediatas
            if (name === 'FechaInicio' && value.isAfter(filtros.FechaFin)) {
                setMensajeAlerta('Atención: La fecha de inicio es posterior a la fecha fin');
                setTipoAlerta('warning');
                setMostrarAlertas(true);
            } else if (name === 'FechaFin' && value.isBefore(filtros.FechaInicio)) {
                setMensajeAlerta('Atención: La fecha fin es anterior a la fecha de inicio');
                setTipoAlerta('warning');
                setMostrarAlertas(true);
            }
        }
    };

    // Validación de rango de fechas para bloquear el botón
    const rangoFechasInvalido = filtros.FechaFin.isBefore(filtros.FechaInicio);

    const getTipoMovimientoInfo = (tipo: string) => {
        switch (tipo) {
            case 'REMISION':
                return {
                    label: 'Remisión',
                    color: 'primary' as const,
                    icon: <ArrowCircleRight size={18} weight="fill" />
                };
            case 'DEVOLUCION':
                return {
                    label: 'Devolución',
                    color: 'warning' as const,
                    icon: <ArrowCircleLeft size={18} weight="fill" />
                };
            case 'ORDEN_DE_SERVICIO':
                return {
                    label: 'Orden de Servicio',
                    color: 'info' as const,
                    icon: <Wrench size={18} weight="fill" />
                };
            default:
                return {
                    label: tipo,
                    color: 'default' as const,
                    icon: <FileText size={18} weight="fill" />
                };
        }
    };

    const handleDownloadPDF = async (row: MovimientoGeneral) => {
        try {
            setLoading(true);
            let blob: Blob;
            let filename = `${row.TipoMovimiento}_${row.NoMovimiento}.pdf`;

            switch (row.TipoMovimiento) {
                case 'REMISION':
                    blob = await VisualizarPDFRemision(row.IdMovimiento);
                    break;
                case 'DEVOLUCION':
                    blob = await ObtenerPDFDevolucion(row.IdMovimiento);
                    break;
                case 'ORDEN_DE_SERVICIO':
                    blob = await ObtenerPDFOrdenDeServicio(row.IdMovimiento);
                    break;
                default:
                    throw new Error('Tipo de movimiento no soportado para PDF');
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setMensajeAlerta('PDF generado correctamente');
            setTipoAlerta('success');
            setMostrarAlertas(true);
        } catch (err: any) {
            setMensajeAlerta(`Error al generar el PDF: ${err.message}`);
            setTipoAlerta('error');
            setMostrarAlertas(true);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnDefinition<MovimientoGeneral>[] = [
        {
            key: 'TipoMovimiento',
            header: 'Tipo',
            render: (row) => {
                const info = getTipoMovimientoInfo(row.TipoMovimiento);
                return (
                    <Chip
                        icon={info.icon}
                        label={info.label}
                        color={info.color}
                        variant="outlined"
                        size="small"
                    />
                );
            }
        },
        {
            key: 'NoMovimiento',
            header: 'No. Documento',
        },
        {
            key: 'Fecha',
            header: 'Fecha',
            render: (row) => dayjs(row.Fecha).format('DD/MM/YYYY')
        },
        {
            key: 'Cliente',
            header: 'Cliente',
        },
        {
            key: 'Proyecto',
            header: 'Proyecto',
        },
        {
            key: 'Total',
            header: 'Valor Total',
            render: (row) => row.Total ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(row.Total) : '-'
        },
        {
            key: 'Estado',
            header: 'Estado',
            render: (row) => (
                <Chip
                    label={row.Estado}
                    color={row.Estado === 'Activa' || row.Estado === 'Completo' ? 'success' : 'default'}
                    size="small"
                />
            )
        }
    ];

    const actions: ActionDefinition<MovimientoGeneral>[] = [
        {
            render: (row: MovimientoGeneral) => (
                <IconButton
                    size="small"
                    onClick={() => handleDownloadPDF(row)}
                    color="secondary"
                >
                    <DownloadSimple size={20} weight='bold' />
                </IconButton>
            )
        }
    ];

    // Resumen para facturación
    const resumen = React.useMemo(() => {
        return data.reduce((acc, curr) => {
            const val = Number(curr.Total || 0);
            if (curr.TipoMovimiento === 'REMISION') acc.remisiones += val;
            if (curr.TipoMovimiento === 'DEVOLUCION') acc.devoluciones += val;
            if (curr.TipoMovimiento === 'ORDEN_DE_SERVICIO') acc.ordenes += val;
            acc.total += val;
            return acc;
        }, { remisiones: 0, devoluciones: 0, ordenes: 0, total: 0 });
    }, [data]);

    // Obtener nombre del cliente seleccionado para el título
    const nombreCliente = React.useMemo(() => {
        const cliente = clientes.find(c => c.value === filtros.Cliente);
        return cliente && cliente.value !== OpcionPorDefecto.value ? cliente.label : 'Todos los Clientes';
    }, [filtros.Cliente, clientes]);

    return (
        <Stack spacing={3}>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Filtros de Búsqueda</Typography>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    startIcon={<Eraser />}
                                    onClick={handleClearFilters}
                                    color="inherit"
                                >
                                    Limpiar
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<MicrosoftExcelLogo />}
                                    onClick={exportToCSV}
                                    disabled={data.length === 0}
                                    color="success"
                                >
                                    Exportar CSV
                                </Button>
                            </Stack>
                        </Stack>
                        <Grid container spacing={2} alignItems="center">
                            <Grid xs={12} md={3}>
                                <InputSelect
                                    label="Cliente"
                                    value={filtros.Cliente}
                                    options={clientes}
                                    onChange={handleFilterChange}
                                    valorname="Cliente"
                                />
                            </Grid>
                            <Grid xs={12} md={3}>
                                <InputSelect
                                    label="Proyecto"
                                    value={filtros.Proyecto}
                                    options={proyectos}
                                    onChange={handleFilterChange}
                                    valorname="Proyecto"
                                />
                            </Grid>
                            <Grid xs={12} md={2.5}>
                                <FechayHora
                                    label="Fecha Inicio"
                                    value={filtros.FechaInicio}
                                    onChange={(val) => handleDateChange('FechaInicio', val)}
                                />
                            </Grid>
                            <Grid xs={12} md={2.5}>
                                <FechayHora
                                    label="Fecha Fin"
                                    value={filtros.FechaFin}
                                    onChange={(val) => handleDateChange('FechaFin', val)}
                                />
                            </Grid>
                            <Grid xs={12} md={1}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<MagnifyingGlass />}
                                    onClick={fetchData}
                                    disabled={loading || rangoFechasInvalido}
                                    sx={{ height: '56px' }}
                                >
                                    {loading ? 'Buscando...' : 'Buscar'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>

            <Box>
                <Typography variant="h5" gutterBottom sx={{ px: 1 }}>
                    Resumen de Cobro: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{nombreCliente}</Box>
                </Typography>
                <Grid container spacing={3}>
                    <Grid xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                            <Typography variant="overline" color="text.secondary">Total Remisiones (+)</Typography>
                            <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.remisiones)}</Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.warning.main}` }}>
                            <Typography variant="overline" color="text.secondary">Total Devoluciones (+)</Typography>
                            <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.devoluciones)}</Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.info.main}` }}>
                            <Typography variant="overline" color="text.secondary">Total Ordenes S. (+)</Typography>
                            <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.ordenes)}</Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                        <Paper elevation={4} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                            <Typography variant="overline" sx={{ opacity: 0.9 }}>Saldo Neto Facturable (=)</Typography>
                            <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.remisiones + resumen.devoluciones + resumen.ordenes)}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Card>
                <DataTable<MovimientoGeneral>
                    columns={columns}
                    data={data}
                    actions={actions}
                    loading={loading}
                    placeHolderBuscador="Buscar por número de documento o cliente..."
                />
            </Card>

            {mostrarAlertas && (
                <MensajeAlerta
                    open={mostrarAlertas}
                    mensaje={mensajeAlerta}
                    tipo={tipoAlerta}
                    onClose={() => setMostrarAlertas(false)}
                />
            )}
            <MensajeDeCarga MostrarMensaje={loading} Mensaje="Procesando..." />
        </Stack>
    );
}
