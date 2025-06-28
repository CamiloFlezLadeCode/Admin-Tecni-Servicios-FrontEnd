'use client';

import * as React from 'react';
import {
    Button, Card, CardActions, CardContent, CardHeader, Divider,
    FormControl, InputLabel, MenuItem, OutlinedInput, Select,
    Grid, Alert, Snackbar, TablePagination, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Paper, Typography
} from '@mui/material';

import { ConsultarMecanicos } from '@/services/gestionycontrol/mecanicos/ConsultarMecanicosService';
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
    const [mecanicos, setMecanicos] = React.useState<Mecanico[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ConsultarMecanicos();
                setMecanicos(data);
                // console.log(data);
            } catch (err) {
                setError('Error al cargar los mecánicos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = mecanicos.filter(mecanico =>
        mecanico.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mecanico.Documento.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Card>
            {/* <CardHeader
                title="Visualización de mecánicos"
                sx={{ fontSize: '0.875rem', padding: '8px' }}
            /> */}
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de mecánicos</Typography>

            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar mecánico..."
                        onChange={e => setSearchTerm(e.target.value)}
                        // style={{ margin: '16px' }}
                        size='small'
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Tipo Documento</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Documento</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Correo</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Dirección</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Celular</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
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
                />
            </CardContent>
        </Card>
    );
};