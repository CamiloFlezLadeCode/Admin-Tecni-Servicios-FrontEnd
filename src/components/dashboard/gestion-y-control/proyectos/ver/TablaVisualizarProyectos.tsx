// 'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

// import * as React from 'react';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
// import Divider from '@mui/material/Divider';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Select from '@mui/material/Select';
// import Grid from '@mui/material/Unstable_Grid2';
// import Alert from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes
// import { ConsultarProyectos } from '@/services/gestionycontrol/proyectos/ConsultarProyectosService';
// import { Typography } from '@mui/material';
// import { Loader, ErrorDisplay } from '@/components/dashboard/componentes_generales/mensajedecarga/Loader';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Paper,
//     TablePagination,
//     Chip
// } from '@mui/material';
// import { ModalFormularioEditarProyecto } from '../editar/ModalFormularioEditarProyecto';
// import { TABLE_PADDING } from '@/styles/theme/padding-table';

// interface Client {
//     id: number;
//     name: string;
//     email: string;
// }

// interface Proyecto {
//     IdProyecto: number;
//     NombreProyecto: string;
//     Cliente: string;
//     DireccionProyecto: string;
//     UsuarioCreacion: string;
//     FechaCreacion: string;
//     EstadoProyecto: string;
// };

// type EstadoDb = 'activo' | 'inactivo';
// type EstadoKey = 'active' | 'inactive';

// const estadoMap: Record<EstadoDb, EstadoKey> = {
//     activo: 'active',
//     inactivo: 'inactive',
// };

// const Estado: Record<EstadoKey, { label: string; color: 'success' | 'error' }> = {
//     active: { label: 'Activo', color: 'success' },
//     inactive: { label: 'Inactivo', color: 'error' },
// };
// export function TablaVisualizarProyectos(): React.JSX.Element {
//     const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
//     // const filteredData = data.filter(item =>
//     //     (item.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     //     || (item.email.toLowerCase().includes(searchTerm.toLowerCase()))
//     // );

//     const [error, setError] = React.useState<string | null>(null);
//     const [cargando, setCargando] = React.useState(true);
//     // const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);

//     const [searchTerm, setSearchTerm] = React.useState<string>('');

//     const [page, setPage] = React.useState(0);

//     const [rowsPerPage, setRowsPerPage] = React.useState(5);

//     //Implementación de WebSocket
//     const { sendMessage, messages } = useSocketIO();

//     React.useEffect(() => {
//         CargarProyectos();
//     }, []);

//     React.useEffect(() => {
//         if (messages.length > 0) {
//             const ultimomensajes = messages[messages.length - 1];
//             if (ultimomensajes.tipo === 'proyecto-actualizado' || ultimomensajes.tipo === 'proyecto-creado') {
//                 CargarProyectos();
//             }
//         }
//     }, [messages]);

//     const CargarProyectos = async () => {
//         try {
//             setError(null);
//             // await new Promise((resolve) => setTimeout(resolve, 2000));
//             const data = await ConsultarProyectos();
//             setProyectos(data);
//         } catch (err) {
//             setError('Error al cargar los mecánicos');
//             console.error(err);
//         } finally {
//             setCargando(false);
//         }
//     };


//     const filteredData = proyectos.filter(proyecto =>
//         proyecto.NombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         proyecto.Cliente.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     if (cargando) return <Loader />;
//     if (error) return <ErrorDisplay message={error} />;

//     return (
//         <Card>
//             {/* <CardHeader
//                 title="Visualización de proyectos"
//                 sx={{
//                     fontSize: '0.875rem', // Tamaño de fuente más pequeño
//                     padding: '8px', // Espaciado interno más pequeño
//                 }}
//             /> */}
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de proyectos</Typography>

//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Paper>
//                     <TextField
//                         variant="outlined"
//                         placeholder="Buscar proyecto..."
//                         onChange={e => setSearchTerm(e.target.value)}
//                         // style={{ margin: '16px' }}
//                         size='small'
//                     />
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cliente</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Dirección</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {paginatedData.map((proyecto, index) => {
//                                     const estadoKey = estadoMap[proyecto.EstadoProyecto.toLowerCase() as EstadoDb] ?? 'inactive';
//                                     return (
//                                         <TableRow key={proyecto.IdProyecto}>
//                                             <TableCell sx={TABLE_PADDING}>{proyecto.NombreProyecto}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{proyecto.Cliente}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{proyecto.DireccionProyecto}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{proyecto.UsuarioCreacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{proyecto.FechaCreacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>
//                                                 <Chip
//                                                     label={Estado[estadoKey].label}
//                                                     color={Estado[estadoKey].color}
//                                                     size="small"
//                                                     sx={{ width: 90, justifyContent: 'center' }}
//                                                 />
//                                             </TableCell>
//                                             <TableCell sx={TABLE_PADDING}>
//                                                 <ModalFormularioEditarProyecto
//                                                     // ProyectoAEditar={proyecto.IdProyecto}
//                                                     ProyectoAEditar={
//                                                         { IdProyecto: proyecto.IdProyecto }
//                                                     }
//                                                     sendMessage={sendMessage}
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     )
//                                 })}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                     {/* <TablePagination
//                         component="div"
//                         count={filteredData.length}
//                         page={page}
//                         onPageChange={(_, newPage) => setPage(newPage)}
//                         rowsPerPage={rowsPerPage}
//                         onRowsPerPageChange={(event) => {
//                             setRowsPerPage(parseInt(event.target.value, 10));
//                             setPage(0);
//                         }}
//                         labelRowsPerPage="Filas por página"
//                         rowsPerPageOptions={[5, 10, 25]}
//                     /> */}
//                 </Paper>
//                 <TablePagination
//                     component="div"
//                     count={filteredData.length}
//                     page={page}
//                     onPageChange={(_, newPage) => setPage(newPage)}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={(event) => {
//                         setRowsPerPage(parseInt(event.target.value, 10));
//                         setPage(0);
//                     }}
//                     labelRowsPerPage="Filas por página"
//                     rowsPerPageOptions={[5, 10, 25]}
//                 />
//             </CardContent>
//         </Card>
//     );
// };

'use client';

import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarProyectos } from '@/services/gestionycontrol/proyectos/ConsultarProyectosService';
import { Chip } from '@mui/material';
import * as React from 'react';
import { ModalFormularioEditarProyecto } from '../editar/ModalFormularioEditarProyecto';

interface Proyecto {
    IdProyecto: number;
    NombreProyecto: string;
    Cliente: string;
    DireccionProyecto: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    EstadoProyecto: string;
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

export function TablaVisualizarProyectos(): React.JSX.Element {
    const [data, setData] = React.useState<Proyecto[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { sendMessage, messages } = useSocketIO();

    const cargarProyectos = async () => {
        try {
            setError(null);
            const data = await ConsultarProyectos();
            setData(data);
        } catch (error) {
            setError('Error al cargar los proyectos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        cargarProyectos();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];
            if (ultimoMensaje.tipo === 'proyecto-actualizado' || ultimoMensaje.tipo === 'proyecto-creado') {
                cargarProyectos();
            }
        }
    }, [messages]);

    const columns = [
        {
            key: 'NombreProyecto',
            header: 'Nombre'
        },
        {
            key: 'Cliente',
            header: 'Cliente'
        },
        {
            key: 'DireccionProyecto',
            header: 'Dirección'
        },
        {
            key: 'UsuarioCreacion',
            header: 'Creado Por'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación'
        },
        {
            key: 'EstadoProyecto',
            header: 'Estado',
            render: (row: Proyecto) => {
                const estadoKey = estadoMap[row.EstadoProyecto.toLowerCase() as EstadoDb] ?? 'inactive';
                return (
                    <Chip
                        label={Estado[estadoKey].label}
                        color={Estado[estadoKey].color}
                        size="small"
                        sx={{ width: 90, justifyContent: 'center' }}
                    />
                );
            }
        }
    ];

    const actions = [
        {
            render: (row: Proyecto) => (
                <ModalFormularioEditarProyecto
                    ProyectoAEditar={{ IdProyecto: row.IdProyecto }}
                    sendMessage={sendMessage}
                />
            ),
            tooltip: 'Editar proyecto'
        }
    ];

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            await cargarProyectos();
        } catch (err) {
            setError('Error al actualizar proyectos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DataTable<Proyecto>
            data={data}
            columns={columns}
            actions={actions}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            emptyMessage="No se encontraron proyectos"
            rowKey={(row) => row.IdProyecto}
            placeHolderBuscador='Buscar proyectos...'
        />
    );
}