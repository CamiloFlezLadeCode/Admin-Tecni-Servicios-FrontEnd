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
    CardContent
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
    if (!data) return <></>;

    const prestada = Number(data.CantidadPrestada || 0);
    const devuelta = Number(data.CantidadDevuelta || 0);
    const pendiente = Number(data.CantidadPendiente || 0);

    // Calcular porcentaje de devolución
    const porcentajeDevolucion = prestada > 0 ? Math.min(100, (devuelta / prestada) * 100) : 0;

    /**
     * Devuelve el TOKEN del estado, no un color ya resuelto.
     *
     * Antes esto retornaba `theme.palette.success.main`, que con
     * CssVarsProvider se evalúa una sola vez contra el esquema por defecto:
     * el color quedaba congelado en modo claro y no cambiaba al alternar.
     * Devolviendo el nombre del token, el color lo resuelve el CSS en cada
     * modo.
     */
    const getEstadoToken = (estado: string): 'success' | 'warning' | 'error' | 'info' | null => {
        switch (estado?.toLowerCase()) {
            case 'completo': return 'success';
            case 'pendiente': return 'warning';
            case 'cancelada': return 'error';
            case 'en proceso': return 'info';
            default: return null;
        }
    };

    const estadoToken = getEstadoToken(data.EstadoDevolucion);
    // Color pleno del estado (texto de énfasis, barra de progreso, iconos).
    const estadoColor = estadoToken
        ? `var(--mui-palette-${estadoToken}-main)`
        : 'var(--mui-palette-text-secondary)';
    // Canal RGB del mismo estado, para construir tintes translúcidos.
    const estadoCanal = estadoToken
        ? `var(--mui-palette-${estadoToken}-mainChannel)`
        : 'var(--mui-palette-text-secondaryChannel)';
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
                // El tinte se arma con el canal RGB. Antes se concatenaba `15`
                // al valor del color para simular un alpha en hex; eso sólo
                // funciona si el color es un hex de 6 dígitos, y producía un
                // valor inválido en cuanto el token era una variable CSS.
                background: `linear-gradient(135deg, rgba(${estadoCanal} / 0.10) 0%, var(--mui-palette-background-paper) 100%)`,
                borderBottom: '1px solid var(--mui-palette-divider)'
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Chip
                                label={data.EstadoDevolucion}
                                sx={{
                                    // Mismo criterio que el resto de chips de estado:
                                    // tinte al 12% con texto del color pleno. Un relleno
                                    // sólido con texto blanco deslumbra en modo oscuro.
                                    bgcolor: `rgba(${estadoCanal} / 0.12)`,
                                    color: estadoColor,
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
                                        // `grey[200]` es un gris claro fijo: en modo oscuro
                                        // la pista quedaba casi blanca. `level2` sube o baja
                                        // con la superficie.
                                        bgcolor: 'var(--mui-palette-background-level2)',
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
                        <Box sx={{ p: 2, border: '1px solid var(--mui-palette-divider)', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">Cantidad Prestada</Typography>
                            <Typography variant="h4" sx={{ my: 1 }}>{prestada}</Typography>
                            <Truck size={24} color="var(--mui-palette-info-main)" weight="duotone" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, border: '1px solid var(--mui-palette-divider)', borderRadius: 2, textAlign: 'center', bgcolor: 'rgba(var(--mui-palette-success-mainChannel) / 0.08)' }}>
                            <Typography variant="overline" color="success.main">Cantidad Devuelta</Typography>
                            <Typography variant="h4" color="success.main" sx={{ my: 1 }}>{devuelta}</Typography>
                            <CheckCircle size={24} color="var(--mui-palette-success-main)" weight="duotone" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, border: '1px solid var(--mui-palette-divider)', borderRadius: 2, textAlign: 'center', bgcolor: pendiente > 0 ? 'rgba(var(--mui-palette-warning-mainChannel) / 0.08)' : undefined }}>
                            <Typography variant="overline" color={pendiente > 0 ? "warning.main" : "text.secondary"}>Pendiente en Obra</Typography>
                            <Typography variant="h4" color={pendiente > 0 ? "warning.main" : "text.primary"} sx={{ my: 1 }}>{pendiente}</Typography>
                            <WarningCircle size={24} color={pendiente > 0 ? 'var(--mui-palette-warning-main)' : 'var(--mui-palette-text-secondary)'} weight="duotone" />
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
                                    <Clock size={20} color="var(--mui-palette-text-secondary)" />
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

            <DialogActions sx={{ p: 3, bgcolor: 'var(--mui-palette-background-default)' }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
