// 'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

// import { ConsultarRepuestos } from '@/services/gestionycontrol/repuestos/ConsultarRepuestosService';
// import {
//     Chip, Paper, Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead, TablePagination, TableRow,
//     TextField, Typography
// } from '@mui/material';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Divider from '@mui/material/Divider';
// import * as React from 'react';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { FormularioEditarRepuesto } from '../editar/FormularioEditarRepuesto';
// import { Loader, ErrorDisplay } from '@/components/dashboard/componentes_generales/mensajedecarga/Loader';
// import { TABLE_PADDING } from '@/styles/theme/padding-table';

// interface Client {
//     id: number;
//     name: string;
//     email: string;
// }

// const data: Client[] = [
//     { id: 1, name: 'Cliente 1', email: 'cliente1@example.com' },
//     { id: 2, name: 'Cliente 2', email: 'cliente2@example.com' },
//     { id: 3, name: 'Cliente 3', email: 'cliente3@example.com' },
//     // Agrega más datos según sea necesario
// ];

// // Se implemente la configuración para los colores de los estados de los repuestos
// type EstadoDb = 'Disponible' | 'No disponible' | 'Reparación';
// type EstadoKey = 'active' | 'inactive' | 'pending';

// const estadoMap: Record<EstadoDb, EstadoKey> = {
//     'Disponible': 'active',
//     'No disponible': 'inactive',
//     'Reparación': 'pending',
// };

// const Estado: Record<EstadoKey, { label: string; color: 'success' | 'error' | 'warning' }> = {
//     active: { label: 'Disponible', color: 'success' },
//     inactive: { label: 'No disponible', color: 'error' },
//     pending: { label: 'En reparación', color: 'warning' },
// };

// // const normalizarEstado = (EstadoRepuesto: string): EstadoDb | null => {
// //     const limpio = EstadoRepuesto.trim().toLowerCase();
// //     if (limpio === 'disponible') return 'Disponible';
// //     if (limpio === 'no disponible') return 'No disponible';
// //     if (limpio === 'reparación') return 'Reparación';
// //     return null;
// // };
// const normalizarEstado = (EstadoRepuesto: string | null | undefined): EstadoDb | null => {
//     if (!EstadoRepuesto || typeof EstadoRepuesto !== 'string') return null;

//     const limpio = EstadoRepuesto.trim().toLowerCase();

//     if (limpio === 'disponible') return 'Disponible';
//     if (limpio === 'no disponible') return 'No disponible';
//     if (limpio === 'reparación') return 'Reparación';

//     return null;
// };

// // ...
// export function TablaVisualizarProyectos(): React.JSX.Element {
//     // Se maneja el estado para almacenar todos los repuestos que vienen de la bd
//     const [repuestos, setRepuestos] = React.useState<any[]>([]);
//     // ...

//     // Se declara el estado para error y Cargando...
//     const [cargando, setCargando] = React.useState(true);
//     const [error, setError] = React.useState<string | null>(null);
//     // ...

//     // Funcionalidad para cargar los repuestos
//     const HandleCargarRepuestos = async () => {
//         try {
//             setError(null);
//             // await new Promise((resolve) => setTimeout(resolve, 2000));
//             const Repuestos = await ConsultarRepuestos();
//             setRepuestos(Repuestos);
//         } catch (error) {
//             setError(`Error al cargar los repuestos: ${error}`);
//         } finally {
//             setCargando(false);
//         }
//     }
//     // ...

//     // Se ejecuta la función para mostrar los repuestos al cargar la página
//     React.useEffect(() => {
//         HandleCargarRepuestos();
//     }, []);
//     // ...

//     // Implementacion de WebSocket
//     const { sendMessage, messages } = useSocketIO();
//     React.useEffect(() => {
//         if (messages.length > 0) {
//             const ultimomensajes = messages[messages.length - 1];
//             if (ultimomensajes.tipo === 'repuesto-creado' || ultimomensajes.tipo === 'repuesto-actualizado') {
//                 HandleCargarRepuestos();
//             }
//         }
//     }, [messages]);
//     // ...

//     // Se declaran los estados para las funciones y componentes de la tabla
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(5);
//     // ...

//     // Se maneja el filtro y el paginado de la tabla
//     // const filteredData = repuestos.filter(repuesto => {
//     //     repuesto.NombreRepuesto.toLowerCase().includes(searchTerm.toLowerCase())
//     // });
//     const filteredData = repuestos.filter(repuestos =>
//         repuestos.NombreRepuesto.toLowerCase().includes(searchTerm.toLocaleLowerCase())
//     );
//     const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//     // ...

//     // Se maneja el texto de carga y de error
//     if (cargando) return <Loader />;
//     if (error) return <ErrorDisplay message={error} />;
//     // ...
//     return (
//         <Card>
//             {/* <CardHeader
//                 title="Visualización de proyectos"
//                 sx={{
//                     fontSize: '0.875rem', // Tamaño de fuente más pequeño
//                     padding: '8px', // Espaciado interno más pequeño
//                 }}
//             /> */}
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de repuestos</Typography>

//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Paper>
//                     <TextField
//                         variant="outlined"
//                         placeholder="Buscar repuesto..."
//                         onChange={e => setSearchTerm(e.target.value)}
//                         // style={{ margin: '16px' }}
//                         size='small'
//                     />
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Id</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cantidad</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {paginatedData.map((repuesto, index) => {
//                                     const estadoDb = normalizarEstado(repuesto.EstadoRepuesto);
//                                     const estadoKey = estadoDb ? estadoMap[estadoDb] : null;
//                                     return (
//                                         <TableRow key={repuesto.IdRepuesto}>
//                                             <TableCell sx={TABLE_PADDING}>{repuesto.IdRepuesto}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{repuesto.NombreRepuesto}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{repuesto.CantidadRepuesto}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{repuesto.UsuarioCreacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{repuesto.FechaCreacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>
//                                                 <Chip
//                                                     label={estadoKey ? Estado[estadoKey].label : repuesto.EstadoRepuesto}
//                                                     color={estadoKey ? Estado[estadoKey].color : 'default'}
//                                                     size="small"
//                                                     sx={{ width: 120, justifyContent: 'center' }}
//                                                 />
//                                             </TableCell>
//                                             <TableCell sx={TABLE_PADDING}>
//                                                 <FormularioEditarRepuesto
//                                                     IdRepuesto={repuesto.IdRepuesto}
//                                                     sendMessage={sendMessage}
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     )
//                                 })}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
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
//     )
// }

'use client';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarRepuestos } from '@/services/gestionycontrol/repuestos/ConsultarRepuestosService';
import { Chip } from '@mui/material';
import * as React from 'react';
import { FormularioEditarRepuesto } from '../editar/FormularioEditarRepuesto';

interface Repuesto {
    EstadoRepuesto: string;
    IdRepuesto: number;
    NombreRepuesto: string;
    CantidadRepuesto: number;
    UsuarioCreacion: string;
    FechaCreacion: string;
}

// Se implemente la configuración para los colores de los estados de los repuestos
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

// const normalizarEstado = (EstadoRepuesto: string): EstadoDb | null => {
//     const limpio = EstadoRepuesto.trim().toLowerCase();
//     if (limpio === 'disponible') return 'Disponible';
//     if (limpio === 'no disponible') return 'No disponible';
//     if (limpio === 'reparación') return 'Reparación';
//     return null;
// };
const normalizarEstado = (EstadoRepuesto: string | null | undefined): EstadoDb | null => {
    if (!EstadoRepuesto || typeof EstadoRepuesto !== 'string') return null;

    const limpio = EstadoRepuesto.trim().toLowerCase();

    if (limpio === 'disponible') return 'Disponible';
    if (limpio === 'no disponible') return 'No disponible';
    if (limpio === 'reparación') return 'Reparación';

    return null;
};

export function TablaVisualizarProyectos(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();
    const [data, setData] = React.useState<Repuesto[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);
    //             const response = await ConsultarRepuestos();
    //             setData(response);
    //         } catch (err) {
    //             setError(`Error al cargar los repuestos: ${err}`);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    const CargarRepuestos = async () => {
        try {
            setError(null);
            const data = await ConsultarRepuestos();
            setData(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        CargarRepuestos();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];
            if (ultimoMensaje.tipo === 'repuesto-creado' || ultimoMensaje.tipo === 'repuesto-actualizado') {
                CargarRepuestos();
            }
        }
    }, [messages]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await ConsultarRepuestos();
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'IdRepuesto',
            header: 'Id'
        },
        {
            key: 'NombreRepuesto',
            header: 'Nombre'
        },
        {
            key: 'CantidadRepuesto',
            header: 'Cantidad'
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
            key: 'EstadoRepuesto',
            header: 'Estado',
            render: (row: Repuesto) => {
                const estadoDb = normalizarEstado(row.EstadoRepuesto);
                const estadoKey = estadoDb ? estadoMap[estadoDb] : null;
                return (
                    <Chip
                        label={estadoKey ? Estado[estadoKey].label : row.EstadoRepuesto}
                        color={estadoKey ? Estado[estadoKey].color : 'default'}
                        size="small"
                        sx={{ width: 120, justifyContent: 'center' }}
                    />
                )
            }
        },
    ]

    const actions: ActionDefinition<Repuesto>[] = [
        {
            render: (row: Repuesto) => (
                <FormularioEditarRepuesto
                    IdRepuesto={row.IdRepuesto}
                    sendMessage={sendMessage}
                />
            ),
            tooltip: 'Editar repuesto'
        }
    ]
    return (
        <DataTable<Repuesto>
            data={data}
            columns={columns}
            actions={actions}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            emptyMessage="No se encontraron repuestos"
            rowKey={(row) => row.IdRepuesto}
            placeHolderBuscador='Buscar repuestos...'
        />
    )
}