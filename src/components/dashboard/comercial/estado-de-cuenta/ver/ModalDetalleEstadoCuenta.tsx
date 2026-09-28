import React from 'react';
import {
    Dialog,
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
    Alert
} from '@mui/material';
import {
    CalendarBlank,
    Clock,
    CheckCircle,
    WarningCircle,
    Buildings,
    Truck,
    Money,
    ArrowUDownLeft
} from '@phosphor-icons/react';

import {
    type EstadoDeCuenta,
    REGLA_DIAS_COBRADOS,
    devolucionesOrdenadas,
    formatoMoneda,
    tieneDevolucionAnteriorARemision
} from './estado-de-cuenta';

interface ModalDetalleEstadoCuentaProps {
    open: boolean;
    onClose: () => void;
    data: EstadoDeCuenta | null;
}

const unidades = (n: number) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`;
const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`;

export function ModalDetalleEstadoCuenta({ open, onClose, data }: ModalDetalleEstadoCuentaProps): JSX.Element {
    if (!data) return <></>;

    const prestada = Number(data.CantidadPrestada || 0);
    const devuelta = Number(data.CantidadDevuelta || 0);
    const pendiente = Number(data.CantidadPendiente || 0);
    const precio = Number(data.PrecioUnitario || 0);
    const iva = Number(data.IVA || 0);
    const devoluciones = devolucionesOrdenadas(data);
    const diasEnObra = data.DiasCobradosEnObra === null ? null : Number(data.DiasCobradosEnObra);
    const hayDevolucionAnterior = tieneDevolucionAnteriorARemision(data);

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

    // Desglose del cobro: una línea por grupo de unidades con los mismos días.
    const desglose = [
        ...devoluciones.map((d) => ({
            clave: `dev-${d.NoDevolucion}-${d.FechaOrden}`,
            texto: `${unidades(Number(d.Cantidad))} devuelta${Number(d.Cantidad) === 1 ? '' : 's'} en la devolución ${d.NoDevolucion} × ${dias(Number(d.DiasCobrados))}`,
            unidadesDia: Number(d.Cantidad) * Number(d.DiasCobrados),
        })),
        ...(pendiente > 0 && diasEnObra !== null
            ? [{
                clave: 'en-obra',
                texto: `${unidades(pendiente)} en obra × ${dias(diasEnObra)} (hasta hoy)`,
                unidadesDia: pendiente * diasEnObra,
            }]
            : []),
    ];

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
                                Renglón de remisión: {data.IdDetalleRemision}
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
                                    <Typography variant="body2" fontWeight="bold">
                                        Tiempo Transcurrido {pendiente > 0 ? '(hasta hoy)' : '(hasta la última devolución)'}
                                    </Typography>
                                    <Typography variant="body1">{data.TiempoPrestamo}</Typography>
                                </Box>
                            </Box>

                            {devoluciones.map((d) => (
                                <Box key={`${d.NoDevolucion}-${d.FechaOrden}`} sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <ArrowUDownLeft size={16} /> Devolución No. {d.NoDevolucion}
                                        </Typography>
                                        <Typography variant="body1">{d.Fecha}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {unidades(Number(d.Cantidad))} · se cobran {dias(Number(d.DiasCobrados))}
                                        </Typography>
                                        {Boolean(Number(d.AnteriorARemision)) && (
                                            <Typography variant="caption" color="warning.main" display="block">
                                                Registrada con una hora anterior a la de la remisión.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        {hayDevolucionAnterior && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Una devolución de este equipo quedó registrada con fecha y hora anteriores a las de la remisión.
                                El tiempo transcurrido se muestra en 0 y se cobra el mínimo de 1 día. Conviene revisar y
                                corregir la fecha de esa devolución.
                            </Alert>
                        )}
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
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Cobro del alquiler: misma fórmula que movimientos generales */}
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Money size={20} /> Cobro del alquiler
                        </Typography>

                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="caption" color="text.secondary">Días cobrados</Typography>
                                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                    {desglose.length ? desglose.map((linea) => (
                                        <Stack key={linea.clave} direction="row" justifyContent="space-between" spacing={2}>
                                            <Typography variant="body2">{linea.texto}</Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                                {linea.unidadesDia} unid.·día
                                            </Typography>
                                        </Stack>
                                    )) : (
                                        <Typography variant="body2">—</Typography>
                                    )}
                                    <Divider />
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" fontWeight="bold">Total unidades·día cobradas</Typography>
                                        <Typography variant="body2" fontWeight="bold">{Number(data.UnidadesDiaCobradas)}</Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Precio por unidad y día</Typography>
                                <Typography variant="body1">{formatoMoneda(precio, 2)}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Alquiler (sin IVA)</Typography>
                                <Typography variant="body1">{formatoMoneda(data.ValorAlquiler, 2)}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="caption" color="text.secondary">IVA ({iva}%)</Typography>
                                <Typography variant="body1">
                                    {formatoMoneda(Number(data.ValorAlquilerConIVA) - Number(data.ValorAlquiler), 2)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Alquiler causado (con IVA)</Typography>
                                <Typography variant="body1" fontWeight="bold">{formatoMoneda(data.ValorAlquilerConIVA, 2)}</Typography>
                            </Grid>
                            {pendiente > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="warning.main">
                                        Mientras sigan {unidades(pendiente)} en obra, este renglón suma {formatoMoneda(data.CausacionDiariaConIVA, 2)} (con IVA) por cada día más.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>

                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                            Alquiler = precio por unidad y día × unidades·día cobradas, más IVA. {REGLA_DIAS_COBRADOS} El
                            transporte se cobra por remisión y por devolución (sin IVA), así que no se incluye en este renglón:
                            aparece en el total del estado de cuenta.
                        </Typography>
                    </Grid>

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
