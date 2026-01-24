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
    Divider
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
    MagnifyingGlass
} from '@phosphor-icons/react';
import dayjs, { Dayjs } from 'dayjs';
import { DataTable, ActionDefinition } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
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

    // Cargar clientes y proyectos al inicio
    React.useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const [resClientes, resProyectos] = await Promise.all([
                    ListarClientes(),
                    ListarProyectos(),
                ]);
                setClientes([OpcionPorDefecto, ...resClientes]);
                setProyectos([{ value: 'Todos', label: 'Todos los Proyectos' }, ...resProyectos]);
            } catch (err) {
                console.error('Error al cargar datos iniciales:', err);
            }
        };
        cargarDatosIniciales();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await VerMovimientosGenerales({
                FechaInicio: filtros.FechaInicio.toISOString(),
                FechaFin: filtros.FechaFin.toISOString(),
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
    };

    const handleFilterChange = (e: SelectChangeEvent<string | number>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, value: Dayjs | null) => {
        if (value) {
            setFiltros(prev => ({ ...prev, [name]: value }));
        }
    };

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

    const columns = [
        {
            key: 'TipoMovimiento',
            header: 'Tipo',
            render: (value: string) => {
                const info = getTipoMovimientoInfo(value);
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
            render: (value: string) => dayjs(value).format('DD/MM/YYYY')
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
            render: (value: number) => value ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value) : '-'
        },
        {
            key: 'Estado',
            header: 'Estado',
            render: (value: string) => (
                <Chip
                    label={value}
                    color={value === 'Activa' || value === 'Completo' ? 'success' : 'default'}
                    size="small"
                />
            )
        }
    ];

    const actions: ActionDefinition[] = [
        {
            label: 'Ver PDF',
            icon: <DownloadSimple />,
            onClick: handleDownloadPDF,
            color: 'primary'
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

    return (
        <Stack spacing={3}>
            <Card>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid xs={12} md={3}>
                            <InputSelect
                                label="Cliente"
                                name="Cliente"
                                value={filtros.Cliente}
                                options={clientes}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid xs={12} md={3}>
                            <InputSelect
                                label="Proyecto"
                                name="Proyecto"
                                value={filtros.Proyecto}
                                options={proyectos}
                                onChange={handleFilterChange}
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
                                sx={{ height: '56px' }}
                            >
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                        <Typography variant="overline" color="text.secondary">Total Remisiones</Typography>
                        <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.remisiones)}</Typography>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.warning.main}` }}>
                        <Typography variant="overline" color="text.secondary">Total Devoluciones</Typography>
                        <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.devoluciones)}</Typography>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.info.main}` }}>
                        <Typography variant="overline" color="text.secondary">Total Ordenes S.</Typography>
                        <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.ordenes)}</Typography>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        <Typography variant="overline">Saldo Neto Facturable</Typography>
                        <Typography variant="h6">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(resumen.remisiones - resumen.devoluciones + resumen.ordenes)}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Card>
                <DataTable
                    title="Listado de Movimientos Detallados"
                    columns={columns}
                    data={data}
                    actions={actions}
                    loading={loading}
                />
            </Card>

            {mostrarAlertas && (
                <MensajeAlerta
                    mensaje={mensajeAlerta}
                    tipo={tipoAlerta}
                    onCerrar={() => setMostrarAlertas(false)}
                />
            )}
            <MensajeDeCarga mostrar={loading} mensaje="Procesando..." />
        </Stack>
    );
}
