'use client';
import { useEffect, useState, useMemo } from 'react';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import {
    Chip,
    SelectChangeEvent,
    Card,
    CardContent,
    Box,
    Typography,
    Stack,
    Button,
    Divider,
    useTheme,
    Paper
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FilePdf, Buildings, Wrench, CheckCircle, Clock } from '@phosphor-icons/react';
import { VerEstadoDeCuentaCliente } from '@/services/comercial/estado_de_cuenta/VerEstadoDeCuentaClienteService';
import { ListarClientes } from '@/services/generales/ListarClientesService';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { OpcionPorDefecto } from '@/lib/constants/option-default';
import dayjs from 'dayjs';
import { PDFDocument, StandardFonts, rgb, PDFPage, degrees } from 'pdf-lib';
import { GenerarPDF } from '@/utils/pdf/generarPDF';
import page from '@/app/page';

interface EstadoDeCuenta {
    IdDetalleRemison?: number;
    Cliente: string;
    DocumentoCliente: string;
    NoRemision: string;
    FechaRemision: string;
    FechaUltimaDevolucion?: string;
    Proyecto: string;
    Categoria: string;
    Equipo: string;
    CantidadPrestada: number | string;
    CantidadDevuelta: number | string;
    CantidadPendiente: number | string;
    TiempoPrestamo: string;
    EstadoDevolucion: string;
    ValorPendiente: number | string;
    PrecioUnitario: number | string;
}

export function TablaVisualizarEstadoDeCuenta(): JSX.Element {
    const theme = useTheme();
    const [data, setData] = useState<EstadoDeCuenta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientes, setClientes] = useState<{ value: string | number; label: string }[]>([]);

    // Filtros
    const [datos, setDatos] = useState({
        Cliente: OpcionPorDefecto.value,
        Proyecto: 'Todos',
        Equipo: 'Todos'
    });

    // Opciones dinámicas para filtros
    const [opcionesProyectos, setOpcionesProyectos] = useState<{ value: string | number; label: string }[]>([]);
    const [opcionesEquipos, setOpcionesEquipos] = useState<{ value: string | number; label: string }[]>([]);

    useEffect(() => {
        const CargarClientes = async () => {
            try {
                const respuesta = await ListarClientes();
                respuesta.unshift(OpcionPorDefecto);
                setClientes(respuesta);
            } catch (error) {
                console.error(`Error al listar los clientes: ${error}`);
            }
        };
        CargarClientes();
    }, []);

    // Cargar data principal al seleccionar cliente
    useEffect(() => {
        if (datos.Cliente !== OpcionPorDefecto.value) {
            handleRefresh();
        } else {
            setData([]);
            setOpcionesProyectos([]);
            setOpcionesEquipos([]);
        }
    }, [datos.Cliente]);

    // Actualizar opciones de filtros basadas en la data cargada
    useEffect(() => {
        if (data.length > 0) {
            // Extraer proyectos únicos
            const proyectosUnicos = Array.from(new Set(data.map(item => item.Proyecto).filter(Boolean))).sort();
            setOpcionesProyectos([
                { value: 'Todos', label: 'Todos los Proyectos' },
                ...proyectosUnicos.map(p => ({ value: p, label: p }))
            ]);

            // Extraer equipos únicos
            const equiposUnicos = Array.from(new Set(data.map(item => item.Equipo).filter(Boolean))).sort();
            setOpcionesEquipos([
                { value: 'Todos', label: 'Todos los Equipos' },
                ...equiposUnicos.map(e => ({ value: e, label: e }))
            ]);
        }
    }, [data]);

    const handleChange = (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const handleRefresh = async () => {
        if (datos.Cliente === OpcionPorDefecto.value) return;

        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            // Resetear filtros secundarios al cambiar cliente
            setDatos(prev => ({ ...prev, Proyecto: 'Todos', Equipo: 'Todos' }));

            const response = await VerEstadoDeCuentaCliente(datos.Cliente);
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtrado de datos en memoria
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchProyecto = datos.Proyecto === 'Todos' || item.Proyecto === datos.Proyecto;
            const matchEquipo = datos.Equipo === 'Todos' || item.Equipo === datos.Equipo;
            return matchProyecto && matchEquipo;
        });
    }, [data, datos.Proyecto, datos.Equipo]);

    // Cálculos para las Cards de Resumen
    const resumen = useMemo(() => {
        return filteredData.reduce((acc, curr) => ({
            totalPrestado: acc.totalPrestado + Number(curr.CantidadPrestada || 0),
            totalDevuelto: acc.totalDevuelto + Number(curr.CantidadDevuelta || 0),
            totalPendiente: acc.totalPendiente + Number(curr.CantidadPendiente || 0),
            valorPendiente: acc.valorPendiente + Number(curr.ValorPendiente || 0)
        }), { totalPrestado: 0, totalDevuelto: 0, totalPendiente: 0, valorPendiente: 0 });
    }, [filteredData]);

    const getEstadoColor = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case 'completo': return 'success';
            case 'pendiente': return 'warning';
            case 'cancelada': return 'error';
            case 'en proceso': return 'info';
            case 'creado': return 'info';
            default: return 'default';
        }
    };

    const handleDownloadPDF = (tipo: 'cliente' | 'interno') => {
        // Aquí iría la llamada al servicio de descarga del PDF
        console.log(`Descargando PDF ${tipo}...`);
        alert(`Generando reporte versión ${tipo.toUpperCase()}. Esta funcionalidad conectará con el backend.`);
    };

    const generatePDF = async () => {
        // console.log("HOlaaa")
        // const pdfDoc = await PDFDocument.create();
        // const page = pdfDoc.addPage();
        // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        // page.drawText(clientes.find(c => c.value === datos.Cliente)?.label || '', {
        //     x: 50,
        //     y: page.getHeight() - 70,
        //     size: 15,
        //     font,
        //     color: rgb(0, 0, 0),
        // });
        // // const pdfBytes = await pdfDoc.save();
        // // const pdfBytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
        // const pdfBytes = new Uint8Array(await pdfDoc.save());
        // // Descargar
        // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        // const link = document.createElement('a');
        // // link.href = URL.createObjectURL(blob);
        // // link.download = 'mi-documento.pdf';
        // // link.click();


        // const iframe = document.createElement('iframe');
        // iframe.style.display = 'none';
        // iframe.src = URL.createObjectURL(blob);
        // document.body.appendChild(iframe);

        // iframe.onload = () => {
        //     iframe.contentWindow?.focus();
        //     iframe.contentWindow?.print();

        //     // setTimeout(() => {
        //     //   URL.revokeObjectURL(blobURL);
        //     //   document.body.removeChild(iframe);
        //     // }, 1000);
        // };

       

    }
    
    const columns = [
        {
            key: 'NoRemision',
            header: 'Remisión',
            render: (row: EstadoDeCuenta) => (
                <Typography variant="body2" fontWeight="bold">{row.NoRemision}</Typography>
            )
        },
        {
            key: 'FechaRemision',
            header: 'Fecha Préstamo',
            render: (row: EstadoDeCuenta) => (
                <Typography variant="body2">{row.FechaRemision}</Typography>
            )
        },
        {
            key: 'Proyecto',
            header: 'Proyecto',
            render: (row: EstadoDeCuenta) => (
                <Box sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.Proyecto}>
                    {row.Proyecto}
                </Box>
            )
        },
        {
            key: 'Equipo',
            header: 'Equipo',
            render: (row: EstadoDeCuenta) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>{row.Equipo}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.Categoria}</Typography>
                </Box>
            )
        },
        {
            key: 'Cantidades',
            header: 'Estado Cantidades',
            render: (row: EstadoDeCuenta) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`Prest: ${row.CantidadPrestada}`} size="small" variant="outlined" />
                    <Chip label={`Dev: ${row.CantidadDevuelta}`} size="small" variant="outlined" color="success" />
                    <Chip label={`Pend: ${row.CantidadPendiente}`} size="small" color={Number(row.CantidadPendiente) > 0 ? "warning" : "default"} />
                </Stack>
            )
        },
        {
            key: 'TiempoPrestamo',
            header: 'Tiempo',
            render: (row: EstadoDeCuenta) => (
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Clock size={16} />
                    <Typography variant="body2">{row.TiempoPrestamo}</Typography>
                </Stack>
            )
        },
        {
            key: 'EstadoDevolucion',
            header: 'Estado',
            render: (row: EstadoDeCuenta) => (
                <Chip
                    label={row.EstadoDevolucion}
                    color={getEstadoColor(row.EstadoDevolucion)}
                    size="small"
                    sx={{ color: 'white', minWidth: 80, fontWeight: 'bold' }}
                />
            )
        }
    ];

    const actions: ActionDefinition<EstadoDeCuenta>[] = [
        {
            render: (row: EstadoDeCuenta) => (
                <Button size="small" variant="text">Ver Detalle</Button>
            ),
            tooltip: 'Ver Detalle Completo'
        }
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Panel de Filtros y Acciones */}
            <Card sx={{ mb: 3, overflow: 'visible' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid md={4} xs={12}>
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
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Filtrar por Proyecto"
                                value={datos.Proyecto}
                                options={opcionesProyectos}
                                size="small"
                                onChange={handleChange}
                                valorname="Proyecto"
                            // disabled={!datos.Cliente || datos.Cliente === OpcionPorDefecto.value}
                            />
                        </Grid>
                        <Grid md={3} xs={12}>
                            <InputSelect
                                label="Filtrar por Equipo"
                                value={datos.Equipo}
                                options={opcionesEquipos}
                                size="small"
                                onChange={handleChange}
                                valorname="Equipo"
                            // disabled={!datos.Cliente || datos.Cliente === OpcionPorDefecto.value}
                            />
                        </Grid>
                        <Grid md={2} xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleRefresh}
                                disabled={!datos.Cliente || datos.Cliente === OpcionPorDefecto.value}
                            >
                                Actualizar
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Resumen de Métricas */}
            {datos.Cliente && datos.Cliente !== OpcionPorDefecto.value && (
                <Box mb={3}>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={3}>
                            <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Total en Obra</Typography>
                                            <Typography variant="h4">{resumen.totalPendiente}</Typography>
                                        </Box>
                                        <Buildings size={32} weight="duotone" style={{ opacity: 0.5 }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Card>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Total Entregado</Typography>
                                            <Typography variant="h4" color="success.main">{resumen.totalDevuelto}</Typography>
                                        </Box>
                                        <CheckCircle size={32} weight="duotone" color={theme.palette.success.main} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Card>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Total Prestado</Typography>
                                            <Typography variant="h4">{resumen.totalPrestado}</Typography>
                                        </Box>
                                        <Wrench size={32} weight="duotone" color={theme.palette.info.main} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, p: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilePdf />}
                                    size="small"
                                    fullWidth
                                    // onClick={() => handleDownloadPDF('cliente')}
                                    onClick={() => generatePDF()}
                                >
                                    Informe Cliente
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<FilePdf />}
                                    size="small"
                                    fullWidth
                                    onClick={() => handleDownloadPDF('interno')}
                                >
                                    Informe Interno
                                </Button>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Tabla de Datos */}
            {datos.Cliente && datos.Cliente !== OpcionPorDefecto.value && (
                <Paper sx={{ overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6">Detalle de Movimientos</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Historial completo de equipos entregados, en obra y devoluciones.
                        </Typography>
                    </Box>
                    <DataTable<EstadoDeCuenta>
                        data={filteredData}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onRefresh={handleRefresh}
                        emptyMessage="No se encontraron registros para los filtros seleccionados"
                        rowKey={(row) => row.IdDetalleRemison ?? Math.random()}
                        placeHolderBuscador='Buscar por equipo, remisión o proyecto...'
                    />
                </Paper>
            )}
        </Box>
    );
};
