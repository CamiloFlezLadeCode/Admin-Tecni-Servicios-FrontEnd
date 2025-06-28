'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes
import { TraerClientes } from '@/services/gestionycontrol/clientes/TraerClientesRegistrados';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import { Typography } from '@mui/material';
import { TABLE_PADDING } from '@/styles/theme/padding-table';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
} from '@mui/material';

interface Client {
    id: number;
    name: string;
    email: string;
    Nombre: string;
    DocumentoUsuario: string;
    IdUsuario: number;
    TipoDocumento: string;
    Documento: string;
    Correo: string;
    Direccion: string;
    Telefono: string;
    Celular: string;
    CreadoPor: string;
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



export function TablaVisualizarCientes(): React.JSX.Element {
    const [clientes, setClientes] = React.useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [mostrarTodasLasColumnas, setMostrarTodasLasColumnas] = React.useState(false);


    // Función para traer los clientes al cargar
    React.useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await TraerClientes();
                setClientes(data);
            } catch (error) {
                console.error('❌ Error al traer clientes:', error);
                setError('Error al cargar clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    // Filtrar
    const filteredData = clientes.filter(item =>
        (item.Nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.Documento.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div>Cargando clientes...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Card>
            {/* <CardHeader
                title="Visualización de clientes"
                sx={{ fontSize: '0.875rem', padding: '8px' }}
            /> */}
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de clientes</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar cliente..."
                        onChange={e => setSearchTerm(e.target.value)}
                        // style={{ margin: '16px' }}
                        size="small"
                    />
                    <Button
                        onClick={() => setMostrarTodasLasColumnas(!mostrarTodasLasColumnas)}
                        variant="text"
                    // sx={{ margin: '16px' }}
                    >
                        {mostrarTodasLasColumnas ? 'Mostrar menos columnas' : 'Mostrar más columnas'}
                    </Button>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Tipo Documento</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Documento</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Correo</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Dirección</TableCell>
                                    {/* <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Teléfono</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Celular</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell> */}
                                    {mostrarTodasLasColumnas && (
                                        <>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Teléfono</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Celular</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                        </>
                                    )}
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map(item => (
                                    <TableRow key={item.Documento}>
                                        <TableCell sx={TABLE_PADDING}>{item.Nombre}</TableCell>
                                        <TableCell sx={TABLE_PADDING}>{item.TipoDocumento}</TableCell>
                                        <TableCell sx={TABLE_PADDING}>{item.Documento}</TableCell>
                                        <TableCell sx={TABLE_PADDING}>{item.Correo}</TableCell>
                                        <TableCell sx={TABLE_PADDING}>{item.Direccion}</TableCell>
                                        {mostrarTodasLasColumnas && (
                                            <>
                                                <TableCell sx={TABLE_PADDING}>{item.Telefono}</TableCell>
                                                <TableCell sx={TABLE_PADDING}>{item.Celular}</TableCell>
                                                <TableCell sx={TABLE_PADDING}>{item.CreadoPor}</TableCell>
                                                <TableCell sx={TABLE_PADDING}>{item.FechaCreacion}</TableCell>
                                            </>
                                        )}
                                        <TableCell sx={TABLE_PADDING}>
                                            <Chip
                                                label={Estado[estadoMap[item.Estado.toLowerCase() as EstadoDb]]?.label || item.Estado}
                                                color={Estado[estadoMap[item.Estado.toLowerCase() as EstadoDb]]?.color || 'default'}
                                                size="small"
                                                sx={{ width: 100, justifyContent: 'center' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    labelRowsPerPage="Filas por página"
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </CardContent>
        </Card>
    )
}