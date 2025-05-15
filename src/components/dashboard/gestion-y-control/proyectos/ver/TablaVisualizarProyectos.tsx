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
import { ConsultarProyectos } from '@/services/gestionycontrol/proyectos/ConsultarProyectosService';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    TablePagination,
    Chip
} from '@mui/material';

interface Client {
    id: number;
    name: string;
    email: string;
}

const data: Client[] = [
    { id: 1, name: 'Cliente 1', email: 'cliente1@example.com' },
    { id: 2, name: 'Cliente 2', email: 'cliente2@example.com' },
    { id: 3, name: 'Cliente 3', email: 'cliente3@example.com' },
    // Agrega más datos según sea necesario
];

interface Proyecto {
    IdProyecto: number;
    NombreProyecto: string;
    Cliente: string;
    DireccionProyecto: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoProyecto: string;
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
export function TablaVisualizarProyectos(): React.JSX.Element {
    const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
    // const filteredData = data.filter(item =>
    //     (item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    //     || (item.email.toLowerCase().includes(searchTerm.toLowerCase()))
    // );

    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    // const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);

    const [searchTerm, setSearchTerm] = React.useState<string>('');

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ConsultarProyectos();
                setProyectos(data);
                console.log(data);
            } catch (err) {
                setError('Error al cargar los mecánicos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const filteredData = proyectos.filter(proyecto =>
        proyecto.NombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.Cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Card>
            <CardHeader
                title="Visualización de proyectos"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar proyecto..."
                        onChange={e => setSearchTerm(e.target.value)}
                        // style={{ margin: '16px' }}
                        size='small'
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cliente</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Dirección</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((proyecto, index) => {
                                    const estadoKey = estadoMap[proyecto.EstadoProyecto.toLowerCase() as EstadoDb] ?? 'inactive';
                                    return (
                                        <TableRow key={proyecto.IdProyecto}>
                                            <TableCell>{proyecto.NombreProyecto}</TableCell>
                                            <TableCell>{proyecto.Cliente}</TableCell>
                                            <TableCell>{proyecto.DireccionProyecto}</TableCell>
                                            <TableCell>{proyecto.UsuarioCreacion}</TableCell>
                                            <TableCell>{proyecto.FechaCreacion}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={Estado[estadoKey].label}
                                                    color={Estado[estadoKey].color}
                                                    size="small"
                                                    sx={{ width: 90, justifyContent: 'center' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
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