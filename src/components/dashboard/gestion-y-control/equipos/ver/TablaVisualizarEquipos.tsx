'use client';

import * as React from 'react';
import {
    Card, CardContent, CardHeader, Divider, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Paper, TablePagination, Typography
} from '@mui/material';

import { TraerEquipos } from '@/services/gestionycontrol/equipos/TraerEquiposRegistradosService';
import { FormularioEditarEquipo } from '../editar/FormularioEditarEquipo';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface Client {
    Nombre: string;
    CategoriaEquipo: string;
    PrecioVenta: number;
    PrecioAlquiler: number;
    PrecioReparacion: number;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
    IdEquipo: number;
    NombreEquipo: string;
    Cantidad: number;
    Subarrendatario: string;
}

type EstadoDb = 'Disponible' | 'No disponible' | 'Reparación';
type EstadoKey = 'active' | 'inactive' | 'pending';

const estadoMap: Record<EstadoDb, EstadoKey> = {
    'Disponible': 'active',
    'No disponible': 'inactive',
    'Reparación': 'pending',
};

const Estado: Record<EstadoKey, { label: string; color: 'success' | 'error' | 'warning' }> = {
    active: { label: 'Disponible', color: 'success' },
    inactive: { label: 'No disponible', color: 'error' },
    pending: { label: 'En reparación', color: 'warning' },
};

const normalizarEstado = (estado: string): EstadoDb | null => {
    const limpio = estado.trim().toLowerCase();
    if (limpio === 'disponible') return 'Disponible';
    if (limpio === 'no disponible') return 'No disponible';
    if (limpio === 'reparación') return 'Reparación';
    return null;
};

export function TablaVisualizarEquipos(): React.JSX.Element {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [equipos, setEquipos] = React.useState<Client[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //Implementación de WebSocket
    const { sendMessage, messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);
    const CargarEquipos = async () => {
        try {
            const data = await TraerEquipos();
            setEquipos(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        CargarEquipos();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'equipo-actualizado') {
                CargarEquipos();
            }
        }
    }, [messages]);
    //...
    // React.useEffect(() => {
    //     const fetchEquipos = async () => {
    //         try {
    //             const data = await TraerEquipos();
    //             setEquipos(data);
    //         } catch (error) {
    //             console.error('❌ Error al traer los equipos:', error);
    //             setError('Error al cargar equipos');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchEquipos();
    // }, []);

    const filteredData = equipos.filter(equipo =>
        equipo.NombreEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.IdEquipo.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Card>
            {/* <CardHeader
                title="Visualización de equipos"
                sx={{ fontSize: '0.875rem', padding: '8px' }}
            /> */}
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de equipos</Typography>

            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar equipo..."
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reiniciar página al buscar
                        }}
                        // style={{ margin: '16px' }}
                        size="small"
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Id</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Categoria/Familia</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cantidad</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Subarrendatario</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Venta</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Alquiler</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Reparación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((equipo) => {
                                    const estadoDb = normalizarEstado(equipo.Estado);
                                    const estadoKey = estadoDb ? estadoMap[estadoDb] : null;

                                    return (
                                        <TableRow key={equipo.IdEquipo}>
                                            <TableCell>{equipo.IdEquipo}</TableCell>
                                            <TableCell>{equipo.NombreEquipo}</TableCell>
                                            <TableCell>{equipo.CategoriaEquipo}</TableCell>
                                            <TableCell>{equipo.Cantidad}</TableCell>
                                            <TableCell>{equipo.Subarrendatario}</TableCell>
                                            <TableCell>{equipo.PrecioVenta}</TableCell>
                                            <TableCell>{equipo.PrecioAlquiler}</TableCell>
                                            <TableCell>{equipo.PrecioReparacion}</TableCell>
                                            <TableCell>{equipo.UsuarioCreacion}</TableCell>
                                            <TableCell>{equipo.FechaCreacion}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={estadoKey ? Estado[estadoKey].label : equipo.Estado}
                                                    color={estadoKey ? Estado[estadoKey].color : 'default'}
                                                    size="small"
                                                    sx={{ width: 120, justifyContent: 'center' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormularioEditarEquipo
                                                    IdEquipo={equipo.IdEquipo}
                                                    sendMessage={sendMessage}
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
                        onPageChange={(event, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0); // Reiniciar al cambiar filas por página
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Filas por página"
                    /> */}
                </Paper>
                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0); // Reiniciar al cambiar filas por página
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Filas por página"
                />
            </CardContent>
        </Card>
    );
};