'use client';

import * as React from 'react';
import {
    Box,
    Card, CardContent,
    Chip,
    Divider,
    IconButton, Modal,
    Paper,
    Table,
    TableBody, TableCell,
    TableContainer, TableHead,
    TablePagination,
    TableRow, TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ConsultarVehiculos } from '@/services/gestionycontrol/vehiculos/ConsultarVehiculosService';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr';
import { FormularioModalEditarVehiculo } from '../editar/FormularioEditarVehiculo';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface Vehiculo {
    IdVehiculo: string;
    Placa: string;
    Estado: string;
};

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

export function TablaVisualizarVehiculos(): React.JSX.Element {
    const [vehiculos, setVehiculos] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // const { messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);
    // 👇 ÚNICA instancia del socket
    const { sendMessage, messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);

    const CargarVehiculos = async () => {
        try {
            const data = await ConsultarVehiculos();
            setVehiculos(data);
        } catch (error) {
            setError(`Error al cargar los vehículos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    //Carga los vehículos al iniciar/cargar
    React.useEffect(() => {
        CargarVehiculos();
    }, []);

    //Se cargan nuevamente cuando un vehiculo es actualizado
    React.useEffect(() => {
        if (messages.length > 0) {
            const UltimoMensajeEmitdo = messages[messages.length - 1];
            if (UltimoMensajeEmitdo.tipo === 'vehiculo-actualizado') {
                CargarVehiculos();
            }
        }
    }, [messages]);

    const filteredData = vehiculos.filter(vehiculo =>
        vehiculo.Placa.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (loading) return <p>Cargando vehículos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Card>
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de vehículos</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar vehículo..."
                        onChange={e => setSearchTerm(e.target.value)}
                        // style={{ margin: '16px' }}
                        size='small'
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>IdVehículo</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Placa</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((vehiculo, index) => {
                                    const estadokey = estadoMap[vehiculo.Estado.toLowerCase() as EstadoDb] ?? 'inactive';
                                    return (
                                        <TableRow key={vehiculo.IdVehiculo}>
                                            <TableCell>{vehiculo.IdVehiculo}</TableCell>
                                            <TableCell>{vehiculo.Placa}</TableCell>
                                            <TableCell>{vehiculo.UsuarioCreacion}</TableCell>
                                            <TableCell>{vehiculo.FechaCreacion}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={Estado[estadokey].label}
                                                    color={Estado[estadokey].color}
                                                    size="small"
                                                    sx={{ width: 90, justifyContent: 'center' }}
                                                />
                                            </TableCell>
                                            <TableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <FormularioModalEditarVehiculo
                                                    IdVehiculo={vehiculo.IdVehiculo}
                                                    sendMessage={sendMessage} // 👈 pásalo como prop
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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