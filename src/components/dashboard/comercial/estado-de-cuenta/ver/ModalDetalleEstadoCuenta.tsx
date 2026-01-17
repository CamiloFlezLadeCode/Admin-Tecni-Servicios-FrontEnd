import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Chip,
    Divider,
    Stack,
    LinearProgress,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import {
    CalendarBlank,
    Clock,
    CheckCircle,
    WarningCircle,
    Buildings,
    Hash,
    Truck,
    Money,
    XCircle,
    Info
} from '@phosphor-icons/react';

// Reutilizamos la interfaz si es posible, o la definimos aquí para propósitos del componente
interface EstadoDeCuenta {
    IdDetalleRemison?: number;
    IdProyecto?: number | string;
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

interface ModalDetalleEstadoCuentaProps {
    open: boolean;
    onClose: () => void;
    data: EstadoDeCuenta | null;
}

export function ModalDetalleEstadoCuenta({ open, onClose, data }: ModalDetalleEstadoCuentaProps): JSX.Element {
    const theme = useTheme();

    if (!data) return <></>;

    const prestada = Number(data.CantidadPrestada || 0);
    const devuelta = Number(data.CantidadDevuelta || 0);
    const pendiente = Number(data.CantidadPendiente || 0);

    // Calcular porcentaje de devolución
    const porcentajeDevolucion = prestada > 0 ? Math.min(100, (devuelta / prestada) * 100) : 0;

    const getEstadoColor = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case 'completo': return theme.palette.success.main;
            case 'pendiente': return theme.palette.warning.main;
            case 'cancelada': return theme.palette.error.main;
            case 'en proceso': return theme.palette.info.main;
            default: return theme.palette.text.secondary;
        }
    };

    const estadoColor = getEstadoColor(data.EstadoDevolucion);
    const handleDialogClose = (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            disableEscapeKeyDown
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header con gradiente suave basado en el estado */}
            <Box sx={{
                p: 3,
                background: `linear-gradient(135deg, ${estadoColor}15 0%, ${theme.palette.background.paper} 100%)`,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Chip
                                label={data.EstadoDevolucion}
                                sx={{
                                    bgcolor: estadoColor,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    height: 24
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                ID: {data.IdDetalleRemison}
                            </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {data.Equipo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Categoría: {data.Categoria}
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="overline" display="block" color="text.secondary">
                            Remisión No.
                        </Typography>
                        <Typography variant="h4" fontFamily="monospace" color="primary.main">
                            {data.NoRemision}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Sección de Progreso */}
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" fontWeight="bold">Progreso de Devolución</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {devuelta} / {prestada} Unidades
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={porcentajeDevolucion}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        bgcolor: theme.palette.grey[200],
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: estadoColor,
                                            borderRadius: 5
                                        }
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
                                    {porcentajeDevolucion.toFixed(1)}% Completado
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Tarjetas de Cantidades */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">Cantidad Prestada</Typography>
                            <Typography variant="h4" sx={{ my: 1 }}>{prestada}</Typography>
                            <Truck size={24} color={theme.palette.info.main} weight="duotone" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, textAlign: 'center', bgcolor: `${theme.palette.success.main}08` }}>
                            <Typography variant="overline" color="success.main">Cantidad Devuelta</Typography>
                            <Typography variant="h4" color="success.main" sx={{ my: 1 }}>{devuelta}</Typography>
                            <CheckCircle size={24} color={theme.palette.success.main} weight="duotone" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, textAlign: 'center', bgcolor: pendiente > 0 ? `${theme.palette.warning.main}08` : undefined }}>
                            <Typography variant="overline" color={pendiente > 0 ? "warning.main" : "text.secondary"}>Pendiente en Obra</Typography>
                            <Typography variant="h4" color={pendiente > 0 ? "warning.main" : "text.primary"} sx={{ my: 1 }}>{pendiente}</Typography>
                            <WarningCircle size={24} color={pendiente > 0 ? theme.palette.warning.main : theme.palette.text.secondary} weight="duotone" />
                        </Box>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Información de Fechas y Proyecto */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarBlank size={20} /> Cronología
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                    <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', my: 0.5 }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">Fecha de Remisión (Préstamo)</Typography>
                                    <Typography variant="body1">{data.FechaRemision}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Clock size={20} color={theme.palette.text.secondary} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">Tiempo Transcurrido</Typography>
                                    <Typography variant="body1">{data.TiempoPrestamo}</Typography>
                                </Box>
                            </Box>

                            {data.FechaUltimaDevolucion && (
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Última Devolución Registrada</Typography>
                                        <Typography variant="body1">{data.FechaUltimaDevolucion}</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Buildings size={20} /> Ubicación y Cliente
                        </Typography>
                        <Card variant="outlined">
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Cliente</Typography>
                                        <Typography variant="body2" fontWeight="bold">{data.Cliente}</Typography>
                                        <Typography variant="caption" color="text.secondary">NIT/CC: {data.DocumentoCliente}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Proyecto / Obra</Typography>
                                        <Typography variant="body2" fontWeight="bold">{data.Proyecto}</Typography>
                                        {/* <Typography variant="caption" color="text.secondary">ID Proyecto: {data.IdProyecto}</Typography> */}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Información Financiera (Opcional, si hay datos) */}
                    {(Number(data.ValorPendiente) > 0 || Number(data.PrecioUnitario) > 0) && (
                        <>
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Money size={20} /> Detalles Financieros
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Precio Unitario</Typography>
                                        <Typography variant="body1">
                                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(data.PrecioUnitario))}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Valor Pendiente Total</Typography>
                                        <Typography variant="body1" fontWeight="bold" color={Number(data.ValorPendiente) > 0 ? "error.main" : "text.primary"}>
                                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(data.ValorPendiente))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )}

                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: theme.palette.background.default }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
