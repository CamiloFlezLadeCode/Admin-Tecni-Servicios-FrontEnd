'use client';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import SelectConBuscador from '@/components/dashboard/componentes_generales/formulario/SelectConBuscador';
import {
    Box,
    Button,
    Divider,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Trash, X } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

import type { OpcionesSelectNumero } from '@/types/select_options';

import type { ItemMovimiento } from './utilidades-movimiento';

/**
 * Piezas visuales compartidas por los modales de entradas y salidas de inventario.
 * Las entradas y las salidas se crearon con estilos algo distintos; `estilo` los conserva.
 */

const SX_MARCO = {
    position: 'absolute',
    top: '1%',
    left: '50%',
    transform: 'translate(-50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
} as const;

const SX_CERRAR = { position: 'absolute', top: 8, right: 8 } as const;

interface MarcoModalMovimientoProps {
    readonly estilo: 'entrada' | 'salida';
    readonly mostrarBotonNuevo: boolean;
    readonly textoBotonNuevo: string;
    readonly abierto: boolean;
    readonly onAbrir: () => void;
    readonly onCerrar: () => void;
    readonly titulo: string;
    /** Solo entradas: mensaje mientras se carga el movimiento a visualizar. */
    readonly cargando?: boolean;
    readonly children: React.ReactNode;
}

/** Botón "+ Nueva …" y el modal (no se cierra con clic fuera ni con Escape). */
export function MarcoModalMovimiento({
    estilo,
    mostrarBotonNuevo,
    textoBotonNuevo,
    abierto,
    onAbrir,
    onCerrar,
    titulo,
    cargando = false,
    children,
}: MarcoModalMovimientoProps): React.JSX.Element {
    const botonCerrar = (
        <IconButton onClick={onCerrar} sx={SX_CERRAR}>
            <X />
        </IconButton>
    );

    return (
        <>
            {mostrarBotonNuevo && (
                <Box display="flex" justifyContent="flex-end" mb={1}>
                    <Button variant="contained" onClick={onAbrir}>{textoBotonNuevo}</Button>
                </Box>
            )}

            <Modal
                open={abierto}
                onClose={(_, reason) => {
                    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
                    onCerrar();
                }}
            >
                {estilo === 'entrada' ? (
                    <Box
                        sx={{
                            ...SX_MARCO,
                            width: { xs: '95%', sm: '90%', md: '78%', lg: '78%' },
                            // En oscuro la sombra casi no se ve; el borde es lo que separa
                            // el modal del velo del backdrop (mismo criterio que MuiDialog).
                            border: '1px solid var(--mui-palette-divider)',
                            p: 3,
                        }}
                    >
                        {botonCerrar}
                        {cargando ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                <Typography>Cargando detalles de la entrada...</Typography>
                            </Box>
                        ) : (
                            <>
                                <Typography variant="subtitle1" mb={1}>{titulo}</Typography>
                                <Divider />
                                {children}
                            </>
                        )}
                    </Box>
                ) : (
                    <Paper sx={{ ...SX_MARCO, width: { xs: '90%', sm: '90%', md: '78%', lg: '78%' }, p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{titulo}</Typography>
                        {botonCerrar}
                        <Divider sx={{ mb: 2 }} />
                        {children}
                    </Paper>
                )}
            </Modal>
        </>
    );
}

/** Separador con el texto "Agregar equipos/repuestos". */
export function EncabezadoAgregarItems({ texto }: { readonly texto: string }): React.JSX.Element {
    return (
        <Grid xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>{texto}</Typography>
        </Grid>
    );
}

interface CamposAgregarItemProps {
    /** `Equipo` / `Repuesto`. */
    readonly etiqueta: string;
    readonly campoId: string;
    readonly valornameElemento?: string;
    readonly item: ItemMovimiento;
    readonly opciones: OpcionesSelectNumero[];
    readonly estados: OpcionesSelectNumero[];
    /** Nombre de la unidad de medida del ítem (se asigna sola al elegir el elemento). */
    readonly unidad: string;
    readonly onElegir: (id: number) => void;
    readonly onCambio: (e: any) => void;
    readonly onAgregar: () => void;
    readonly agregarDeshabilitado: boolean;
    /** Marca como obligatorios elemento, cantidad y estado. */
    readonly requeridos?: boolean;
}

/** Campos del ítem a agregar (elemento, cantidad, unidad, estado, observación) y botón "Agregar". */
export function CamposAgregarItem({
    etiqueta,
    campoId,
    valornameElemento = campoId,
    item,
    opciones,
    estados,
    unidad,
    onElegir,
    onCambio,
    onAgregar,
    agregarDeshabilitado,
    requeridos = false,
}: CamposAgregarItemProps): React.JSX.Element {
    return (
        <>
            <Grid xs={12} md={3}>
                <SelectConBuscador
                    label={etiqueta}
                    value={item[campoId]}
                    onChange={(e) => onElegir(Number((e as any).target?.value ?? 0))}
                    options={opciones}
                    valorname={valornameElemento}
                    required={requeridos}
                />
            </Grid>
            <Grid xs={12} md={3}>
                <Input label='Cantidad' value={item.Cantidad} onChange={onCambio} tamano='small' tipo_input='number' valorname='Cantidad' required={requeridos} />
            </Grid>
            <Grid xs={12} md={3}>
                <Input label='Unidad de medida' value={unidad} tamano='small' tipo_input='text' bloqueado />
            </Grid>
            <Grid xs={12} md={3}>
                <InputSelect label='Estado' value={item.IdEstado} onChange={onCambio} options={estados} valorname='IdEstado' required={requeridos} />
            </Grid>
            <Grid xs={12} md={3}>
                <Input label='Observación' value={item.Observacion} onChange={onCambio} tamano='small' tipo_input='text' valorname='Observacion' />
            </Grid>

            <Grid xs={12}>
                <Box display='flex' justifyContent='flex-end'>
                    <Button variant='contained' disabled={agregarDeshabilitado} onClick={onAgregar}>Agregar</Button>
                </Box>
            </Grid>
        </>
    );
}

export interface ColumnaItem {
    readonly encabezado: string;
    readonly celda: (item: ItemMovimiento, indice: number) => React.ReactNode;
}

interface TablaItemsMovimientoProps {
    readonly titulo: string;
    readonly items: ItemMovimiento[];
    readonly columnas: ColumnaItem[];
    /** Si se pasa, cada fila tiene un botón para quitar el ítem. */
    readonly onEliminar?: (indice: number) => void;
    /** `equipos`: papelera centrada. `repuestos`: ícono X alineado a la izquierda. */
    readonly variante?: 'equipos' | 'repuestos';
    readonly filasHover?: boolean;
}

/** Tabla de ítems agregados (o del movimiento que se visualiza). */
export function TablaItemsMovimiento({
    titulo,
    items,
    columnas,
    onEliminar,
    variante = 'equipos',
    filasHover = false,
}: TablaItemsMovimientoProps): React.JSX.Element {
    const centrado = variante === 'equipos' ? 'center' : undefined;
    return (
        <Box mt={2}>
            <Typography variant="subtitle2">{titulo}</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            {columnas.map((c) => <TableCell key={c.encabezado}><strong>{c.encabezado}</strong></TableCell>)}
                            {onEliminar && <TableCell align={centrado}><strong>Acciones</strong></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, indice) => (
                            // Los ítems no tienen id propio y pueden repetirse: el índice es su identidad.
                            // eslint-disable-next-line react/no-array-index-key
                            <TableRow key={indice} hover={filasHover}>
                                {columnas.map((c) => <TableCell key={c.encabezado}>{c.celda(item, indice)}</TableCell>)}
                                {onEliminar && (
                                    <TableCell align={centrado}>
                                        <IconButton size='small' color='error' onClick={() => onEliminar(indice)}>
                                            {variante === 'equipos' ? <Trash /> : <X />}
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
