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
import { TraerClientesPaginado } from '@/services/gestionycontrol/clientes/TraerClientesRegistrados';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
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
    const [mostrarTodasLasColumnas, setMostrarTodasLasColumnas] = React.useState(false);

    // Paginado y búsqueda (por nombre y documento) resueltos en el servidor
    const tabla = usePaginacionServidor<Client>({
        consultar: TraerClientesPaginado,
        limiteInicial: 5,
        mensajeError: (error) => {
            console.error('❌ Error al traer clientes:', error);
            return 'Error al cargar clientes';
        },
    });

    // Sólo en la primera carga: al buscar o paginar la tabla sigue montada (el
    // buscador no pierde el foco mientras llegan los resultados)
    if (tabla.cargando) {
        return <div>Cargando clientes...</div>;
    }

    if (tabla.error) {
        return <div>{tabla.error}</div>;
    }

    const paginatedData = tabla.datos;

    return (
        <Card>
            {/* <CardHeader
                title="Visualización de clientes"
                sx={{ fontSize: '0.875rem', padding: '8px' }}
            /> */}
            <Typography variant='subtitle1' sx={{ padding: '5px', fontWeight: 'normal' }}>Visualización de clientes</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar cliente..."
                        value={tabla.busqueda}
                        onChange={e => tabla.setBusqueda(e.target.value)}
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
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Tipo Documento</TableCell>
                                    <TableCell>Documento</TableCell>
                                    <TableCell>Correo</TableCell>
                                    <TableCell>Dirección</TableCell>
                                    {/* <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Teléfono</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Celular</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell> */}
                                    {mostrarTodasLasColumnas && (
                                        <>
                                            <TableCell>Teléfono</TableCell>
                                            <TableCell>Celular</TableCell>
                                            <TableCell>Creado Por</TableCell>
                                            <TableCell>Fecha Creación</TableCell>
                                        </>
                                    )}
                                    <TableCell>Estado</TableCell>
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
                    count={tabla.total}
                    page={tabla.pagina}
                    labelRowsPerPage="Filas por página"
                    onPageChange={(event, newPage) => tabla.paginacionTabla.onCambiarPagina(newPage)}
                    rowsPerPage={tabla.limite}
                    onRowsPerPageChange={(event) => {
                        tabla.paginacionTabla.onCambiarLimite(parseInt(event.target.value, 10));
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </CardContent>
        </Card>
    )
}