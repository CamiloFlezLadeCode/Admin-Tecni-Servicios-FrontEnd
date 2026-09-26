'use client';

import * as React from 'react';
import {
    Button, Card, CardActions, CardContent, CardHeader, Divider,
    FormControl, InputLabel, MenuItem, OutlinedInput, Select,
    Grid, Alert, Snackbar, TablePagination, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Paper, Typography
} from '@mui/material';

import { ConsultarMecanicosPaginado } from '@/services/gestionycontrol/mecanicos/ConsultarMecanicosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { TABLE_PADDING } from '@/styles/theme/padding-table';

interface Mecanico {
    Nombre: string;
    TipoDocumento: string;
    Documento: string;
    Correo: string;
    Direccion: string;
    Celular: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
}

type EstadoDb = 'activo' | 'inactivo';
type EstadoKey = 'active' | 'inactive';

const estadoMap: Record<EstadoDb, EstadoKey> = {
    activo: 'active',
    inactivo: 'inactive',
};

const Estado: Record<EstadoKey, { label: string; color: 'success' | 'error' }> = {
    active: { label: 'Activo', color: 'success' },
    inactive: { label: 'Inactivo', color: 'error' },
};

export function TablaVisualizarMecanicos(): React.JSX.Element {
    // Paginado y búsqueda (por nombre y documento) resueltos en el servidor
    const tabla = usePaginacionServidor<Mecanico>({
        consultar: ConsultarMecanicosPaginado,
        limiteInicial: 5,
        mensajeError: (err) => {
            console.error(err);
            return 'Error al cargar los mecánicos';
        },
    });

    const paginatedData = tabla.datos;

    return (
        <Card>
            {/* <CardHeader
                title="Visualización de mecánicos"
                sx={{ fontSize: '0.875rem', padding: '8px' }}
            /> */}
            <Typography variant='subtitle1' sx={{ padding: '5px', fontWeight: 'normal' }}>Visualización de mecánicos</Typography>

            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar mecánico..."
                        value={tabla.busqueda}
                        onChange={e => tabla.setBusqueda(e.target.value)}
                        // style={{ margin: '16px' }}
                        size='small'
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Tipo Documento</TableCell>
                                    <TableCell>Documento</TableCell>
                                    <TableCell>Correo</TableCell>
                                    <TableCell>Dirección</TableCell>
                                    <TableCell>Celular</TableCell>
                                    <TableCell>Creado Por</TableCell>
                                    <TableCell>Fecha Creación</TableCell>
                                    <TableCell>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((mecanico, index) => {
                                    const estadoKey = estadoMap[mecanico.Estado.toLowerCase() as EstadoDb] ?? 'inactive';
                                    return (
                                        <TableRow key={index}>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.Nombre}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.TipoDocumento}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.Documento}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.Correo}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.Direccion}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.Celular}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.UsuarioCreacion}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>{mecanico.FechaCreacion}</TableCell>
                                            <TableCell sx={TABLE_PADDING}>
                                                <Chip
                                                    label={Estado[estadoKey].label}
                                                    color={Estado[estadoKey].color}
                                                    size="small"
                                                    sx={{ width: 90, justifyContent: 'center' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        labelRowsPerPage="Filas por página"
                        rowsPerPageOptions={[5, 10, 25]}
                    /> */}
                </Paper>
                <TablePagination
                    component="div"
                    count={tabla.total}
                    page={tabla.pagina}
                    onPageChange={(_, newPage) => tabla.paginacionTabla.onCambiarPagina(newPage)}
                    rowsPerPage={tabla.limite}
                    onRowsPerPageChange={(event) => {
                        tabla.paginacionTabla.onCambiarLimite(parseInt(event.target.value, 10));
                    }}
                    labelRowsPerPage="Filas por página"
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </CardContent>
        </Card>
    );
};