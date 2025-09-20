// 'use client';

// import * as React from 'react';
// import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';

// // 1. INTERFACES Ó TYPES
// interface DatosOrdenDeServicio {
//     IdOrdenDeServicio: number | null;
//     NoOrdenDeServicio: string;
//     Cliente: string;
//     Proyecto: string;
//     Mecanico: string;
//     CreadoPor: string;
//     FechaCreacion: string;
//     EstadoOrdenDeServicio: string;
// }

// // 2. COMPONENTE PRINCIPAL
// export function TablaVisualizarOrdenesDeServicio(): React.JSX.Element {
//     // 3. HOOKS DE REACT Y OTROS HOOKS DE LIBRERÍAS

//     // 4. ESTADOS
//     const [datos, setDatos] = React.useState<DatosOrdenDeServicio>({
//         IdOrdenDeServicio: null,
//         NoOrdenDeServicio: '',
//         Cliente: '',
//         Proyecto: '',
//         Mecanico: '',
//         CreadoPor: '',
//         FechaCreacion: '',
//         EstadoOrdenDeServicio: '',
//     });

//     // 5. USEEFFECT PARA CARGA INICIAL Y SOCKETS
//     React.useEffect(() => {
//         CargarTodasLasOrdenesDeServicio();
//     }, []);

//     // 6. FUNCIONES DEL COMPONENTE
//     const CargarTodasLasOrdenesDeServicio = async () => {
//         try {
//             const OrdenesDeServicio = await VerTodasLasOrdenesDeServicio();
//             setDatos(OrdenesDeServicio);
//             console.log(datos);
//         } catch (error) {
//             console.error(`Error al describir la acción: ${error}`);
//         }
//     }

//     // 7. RENDERIZADO JSX
//     return (
//         <>
//             <h4>TABLA PARA VISUALIZAR ÓRDENES DE SERVICIO</h4>
//         </>
//     );
// }


// CASIIIIIIIIII ASDFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
// 'use client';

// import * as React from 'react';
// import {
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     Skeleton,
//     IconButton,
//     Tooltip
// } from '@mui/material';
// import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
// import {
//     ArrowsClockwise as RefreshIcon,
//     Eye as VisibilityIcon
// } from '@phosphor-icons/react'

// interface OrdenDeServicio {
//     IdOrdenDeServicio: number;
//     NoOrdenDeServicio: string;
//     Cliente: string;
//     Proyecto: string;
//     Mecanico: string;
//     CreadoPor: string;
//     FechaCreacion: string;
//     EstadoOrdenDeServicio: string;
// }

// export function TablaVisualizarOrdenesDeServicio(): React.JSX.Element {
//     const [ordenes, setOrdenes] = React.useState<OrdenDeServicio[]>([]);
//     const [loading, setLoading] = React.useState<boolean>(true);
//     const [error, setError] = React.useState<string | null>(null);

//     const CargarTodasLasOrdenesDeServicio = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const data = await VerTodasLasOrdenesDeServicio();
//             setOrdenes(data);
//         } catch (err) {
//             console.error('Error al cargar órdenes:', err);
//             setError('No se pudieron cargar las órdenes de servicio');
//         } finally {
//             setLoading(false);
//         }
//     };

//     React.useEffect(() => {
//         CargarTodasLasOrdenesDeServicio();
//     }, []);

//     const handleVerDetalle = (id: number) => {
//         // Lógica para ver detalle de la orden
//         console.log('Ver orden:', id);
//     };

//     const handleRefresh = () => {
//         CargarTodasLasOrdenesDeServicio();
//     };

//     return (
//         <Box sx={{ width: '100%' }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                 <Typography variant="h5" component="h2">
//                     Órdenes de Servicio
//                 </Typography>
//                 <Tooltip title="Actualizar lista">
//                     <IconButton onClick={handleRefresh} color="primary">
//                         <RefreshIcon />
//                     </IconButton>
//                 </Tooltip>
//             </Box>

//             <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//                 <TableContainer sx={{ maxHeight: 600 }}>
//                     <Table stickyHeader aria-label="tabla de órdenes de servicio">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>N° Orden</TableCell>
//                                 <TableCell>Cliente</TableCell>
//                                 <TableCell>Proyecto</TableCell>
//                                 <TableCell>Mecánico</TableCell>
//                                 <TableCell>Fecha Creación</TableCell>
//                                 <TableCell>Estado</TableCell>
//                                 <TableCell>Acciones</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {loading ? (
//                                 Array.from({ length: 5 }).map((_, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell colSpan={7}>
//                                             <Skeleton animation="wave" height={40} />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : error ? (
//                                 <TableRow>
//                                     <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
//                                         {error}
//                                     </TableCell>
//                                 </TableRow>
//                             ) : ordenes.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={7} align="center">
//                                         No se encontraron órdenes de servicio
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 ordenes.map((orden) => (
//                                     <TableRow hover key={orden.IdOrdenDeServicio}>
//                                         <TableCell>{orden.NoOrdenDeServicio}</TableCell>
//                                         <TableCell>{orden.Cliente}</TableCell>
//                                         <TableCell>{orden.Proyecto}</TableCell>
//                                         <TableCell>{orden.Mecanico}</TableCell>
//                                         <TableCell>
//                                             {new Date(orden.FechaCreacion).toLocaleDateString()}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Box
//                                                 component="span"
//                                                 sx={{
//                                                     p: '4px 8px',
//                                                     borderRadius: '4px',
//                                                     backgroundColor:
//                                                         orden.EstadoOrdenDeServicio === 'Completado' ? 'success.light' :
//                                                             orden.EstadoOrdenDeServicio === 'Pendiente' ? 'warning.light' :
//                                                                 'error.light',
//                                                     color: 'common.white'
//                                                 }}
//                                             >
//                                                 {orden.EstadoOrdenDeServicio}
//                                             </Box>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Tooltip title="Ver detalle">
//                                                 <IconButton
//                                                     onClick={() => handleVerDetalle(orden.IdOrdenDeServicio)}
//                                                     color="primary"
//                                                 >
//                                                     <VisibilityIcon />
//                                                 </IconButton>
//                                             </Tooltip>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// }




// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// 'use client';

// import * as React from 'react';
// import {
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     Skeleton,
//     IconButton,
//     Tooltip,
//     TextField,
//     InputAdornment,
//     TablePagination,
//     Chip,
//     Card,
//     CardContent
// } from '@mui/material';
// import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
// import {
//     ArrowsClockwise as RefreshIcon,
//     Eye as VisibilityIcon,
//     MagnifyingGlass as SearchIcon,
//     Funnel as FilterIcon
// } from '@phosphor-icons/react';
// import { TABLE_PADDING } from '@/styles/theme/padding-table';

// interface OrdenDeServicio {
//     IdOrdenDeServicio: number;
//     NoOrdenDeServicio: string;
//     Cliente: string;
//     Proyecto: string;
//     Mecanico: string;
//     CreadoPor: string;
//     FechaCreacion: string;
//     EstadoOrdenDeServicio: string;
// }

// export function TablaVisualizarOrdenesDeServicio(): React.JSX.Element {
//     const [ordenes, setOrdenes] = React.useState<OrdenDeServicio[]>([]);
//     const [filteredData, setFilteredData] = React.useState<OrdenDeServicio[]>([]);
//     const [loading, setLoading] = React.useState<boolean>(true);
//     const [error, setError] = React.useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);

//     const CargarTodasLasOrdenesDeServicio = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const data = await VerTodasLasOrdenesDeServicio();
//             setOrdenes(data);
//             setFilteredData(data);
//         } catch (err) {
//             console.error('Error al cargar órdenes:', err);
//             setError('No se pudieron cargar las órdenes de servicio');
//         } finally {
//             setLoading(false);
//         }
//     };

//     React.useEffect(() => {
//         CargarTodasLasOrdenesDeServicio();
//     }, []);

//     React.useEffect(() => {
//         const filtered = ordenes.filter(orden =>
//             Object.values(orden).some(
//                 value =>
//                     value &&
//                     value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//             ));
//         setFilteredData(filtered);
//         setPage(0); // Resetear a la primera página al buscar
//     }, [searchTerm, ordenes]);

//     const handleVerDetalle = (id: number) => {
//         console.log('Ver orden:', id);
//     };

//     const handleRefresh = () => {
//         CargarTodasLasOrdenesDeServicio();
//         setSearchTerm('');
//     };

//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const getEstadoColor = (estado: string) => {
//         switch (estado) {
//             case 'Completado': return 'success';
//             case 'Pendiente': return 'warning';
//             case 'Cancelado': return 'error';
//             case 'En Proceso': return 'info';
//             case 'Creado': return 'info';
//             default: return 'default';
//         }
//     };

//     return (
//         <Card>
//             <CardContent>
//                 <Box sx={{ width: '100%' }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                         {/* <Typography variant="h5" component="h2">
//                     Órdenes de Servicio
//                 </Typography> */}
//                         <Box display="flex" alignItems="center" gap={2}>
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 placeholder="Buscar órdenes..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <SearchIcon size={20} />
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                                 sx={{ width: 300 }}
//                             />
//                             {/* <Tooltip title="Actualizar lista">
//                                 <IconButton onClick={handleRefresh} color="primary">
//                                     <RefreshIcon size={24} />
//                                 </IconButton>
//                             </Tooltip> */}
//                         </Box>
//                     </Box>

//                     <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
//                         <TableContainer sx={{ maxHeight: 600 }}>
//                             <Table stickyHeader aria-label="tabla de órdenes de servicio">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>N° Orden</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>Cliente</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>Proyecto</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>Mecánico</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>Fecha Creación</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>Creado Por</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }}>Estado</TableCell>
//                                         <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important' }} align="center">Acciones</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading ? (
//                                         Array.from({ length: rowsPerPage }).map((_, index) => (
//                                             <TableRow key={index}>
//                                                 {Array.from({ length: 7 }).map((_, cellIndex) => (
//                                                     <TableCell key={cellIndex}>
//                                                         <Skeleton animation="wave" height={40} />
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         ))
//                                     ) : error ? (
//                                         <TableRow>
//                                             <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
//                                                 {error}
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : filteredData.length === 0 ? (
//                                         <TableRow>
//                                             <TableCell colSpan={7} align="center">
//                                                 No se encontraron órdenes de servicio
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : (
//                                         filteredData
//                                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                             .map((orden) => (
//                                                 <TableRow hover key={orden.IdOrdenDeServicio}>
//                                                     <TableCell sx={TABLE_PADDING}>{orden.NoOrdenDeServicio}</TableCell>
//                                                     <TableCell sx={TABLE_PADDING}>{orden.Cliente}</TableCell>
//                                                     <TableCell sx={TABLE_PADDING}>{orden.Proyecto}</TableCell>
//                                                     <TableCell sx={TABLE_PADDING}>{orden.Mecanico}</TableCell>
//                                                     <TableCell sx={TABLE_PADDING}>{orden.FechaCreacion}</TableCell>
//                                                     <TableCell sx={TABLE_PADDING}>{orden.CreadoPor}</TableCell>
//                                                     <TableCell sx={TABLE_PADDING}>
//                                                         <Chip
//                                                             label={orden.EstadoOrdenDeServicio}
//                                                             color={getEstadoColor(orden.EstadoOrdenDeServicio)}
//                                                             size="small"
//                                                             sx={{ color: 'white', minWidth: 100 }}
//                                                         />
//                                                     </TableCell>
//                                                     <TableCell align="center" sx={TABLE_PADDING}>
//                                                         <Tooltip title="Ver detalle">
//                                                             <IconButton
//                                                                 onClick={() => handleVerDetalle(orden.IdOrdenDeServicio)}
//                                                                 color="primary"
//                                                             >
//                                                                 <VisibilityIcon size={20} />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                         <TablePagination
//                             rowsPerPageOptions={[5, 10, 25]}
//                             component="div"
//                             count={filteredData.length}
//                             rowsPerPage={rowsPerPage}
//                             page={page}
//                             onPageChange={handleChangePage}
//                             onRowsPerPageChange={handleChangeRowsPerPage}
//                             labelRowsPerPage="Filas por página:"
//                             labelDisplayedRows={({ from, to, count }) =>
//                                 `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
//                             }
//                             sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
//                         />
//                     </Paper>

//                     {!loading && !error && filteredData.length > 0 && (
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                             Mostrando {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredData.length)} de {filteredData.length} órdenes
//                         </Typography>
//                     )}
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// }




// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 'use client';
// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
// import { Chip } from '@mui/material';
// import * as React from 'react';
// import { BotonEliminarOrdenDeServicio } from '../acciones/EliminarOrdenDeServicio';
// import { VerGenerarPDFOrdenDeServicio } from '../acciones/VerGenerarPDFOrdenDeServicio';
// import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';

// interface OrdenDeServicio {
//     IdOrdenDeServicio: number;
//     NoOrdenDeServicio: string;
//     Cliente: string;
//     Proyecto: string;
//     Mecanico: string;
//     CreadoPor: string;
//     FechaCreacion: string;
//     EstadoOrdenDeServicio: string;
// }

// export function TablaVisualizarOrdenesDeServicio() {
//     const [data, setData] = React.useState<OrdenDeServicio[]>([]);
//     const [loading, setLoading] = React.useState(true);
//     const [error, setError] = React.useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = React.useState('');
//     // Estados para alertas
//     const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
//     const [mensajeAlerta, setMensajeAlerta] = React.useState('');
//     const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');



//     const { sendMessage, messages } = useSocketIO();

//     React.useEffect(() => {
//         const cargarDatos = async () => {
//             try {
//                 setLoading(true);
//                 const response = await VerTodasLasOrdenesDeServicio();
//                 setData(response);
//             } catch (err) {
//                 setError('Error al cargar las órdenes de servicio');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         cargarDatos();
//     }, []);

//     React.useEffect(() => {
//         if (messages.length > 0) {
//             const ultimomensajes = messages[messages.length - 1];
//             if (ultimomensajes.tipo === 'orden-de-servicio-creada' || ultimomensajes.tipo === 'orden-de-servicio-eliminada') {
//                 handleRefresh();
//             }
//         }
//     }, [messages]);

//     const columns = [
//         {
//             key: 'NoOrdenDeServicio',
//             header: 'N° Orden',
//             width: '120px'
//         },
//         {
//             key: 'Cliente',
//             header: 'Cliente'
//         },
//         {
//             key: 'Proyecto',
//             header: 'Proyecto'
//         },
//         {
//             key: 'Mecanico',
//             header: 'Mecánico'
//         },
//         {
//             key: 'FechaCreacion',
//             header: 'Fecha Creación',
//             // render: (row: OrdenDeServicio) => new Date(row.FechaCreacion).toLocaleDateString()

//         },
//         {
//             key: 'CreadoPor',
//             header: 'Creado Por'
//         },
//         {
//             key: 'EstadoOrdenDeServicio',
//             header: 'Estado',
//             render: (row: OrdenDeServicio) => (
//                 <Chip
//                     label={row.EstadoOrdenDeServicio}
//                     color={getEstadoColor(row.EstadoOrdenDeServicio)}
//                     size="small"
//                     sx={{ color: 'white', minWidth: 100 }}
//                 />
//             )
//         }
//     ];

//     // const actions = [
//     //     {
//     //         icon: <Eye size={20} />,
//     //         tooltip: 'Ver detalle',
//     //         onClick: (row: OrdenDeServicio) => console.log('Ver orden:', row.IdOrdenDeServicio),
//     //         color: 'error'
//     //     },
//     //     {
//     //         icon: <PencilSimple size={20} />,
//     //         tooltip: 'Editar',
//     //         onClick: (row: OrdenDeServicio) => console.log('Editar orden:', row.IdOrdenDeServicio),
//     //         color: 'info',
//     //         hidden: (row: OrdenDeServicio) => row.EstadoOrdenDeServicio === 'Completado'
//     //     }
//     // ];

//     const actions: ActionDefinition<OrdenDeServicio>[] = [
//         // {
//         //     icon: <Eye size={20} />,
//         //     tooltip: 'Ver detalle',
//         //     onClick: (row) => console.log('Ver orden:', row.IdOrdenDeServicio),
//         //     color: 'error'
//         // },
//         // {
//         //     icon: <PencilSimple size={20} />,
//         //     tooltip: 'Editar',
//         //     onClick: (row) => console.log('Editar orden:', row.IdOrdenDeServicio),
//         //     color: 'primary',
//         //     hidden: (row) => row.EstadoOrdenDeServicio === 'Completado'
//         // },
//         {
//             render: (row) => (
//                 <VerGenerarPDFOrdenDeServicio
//                     // data={row}
//                     IdOrdenDeServicio={row.IdOrdenDeServicio}
//                 // onComplete={() => console.log('PDF generado para', row.IdOrdenDeServicio)}
//                 />
//             ),
//             tooltip: 'Imprimir orden de servicio'
//         },
//         // {
//         //     render: (row: OrdenDeServicio) => (
//         //         <BotonEliminarOrdenDeServicio
//         //             IdOrdenDeServicio={row.IdOrdenDeServicio}
//         //             NoOrdenDeServicio={row.NoOrdenDeServicio}
//         //             sendMessage={sendMessage}
//         //             mostrarMensaje={mostrarMensaje}
//         //         />
//         //     ),
//         //     tooltip: 'Eliminar orden de servicio'
//         // }
//     ];



//     const getEstadoColor = (estado: string) => {
//         switch (estado) {
//             case 'Completado': return 'success';
//             case 'Pendiente': return 'warning';
//             case 'Cancelado': return 'error';
//             case 'En Proceso': return 'info';
//             case 'Creado': return 'info';
//             default: return 'default';
//         }
//     };

//     const handleRefresh = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             setSearchTerm('');
//             const response = await VerTodasLasOrdenesDeServicio();
//             setData(response);
//         } catch (err) {
//             setError('Error al actualizar las órdenes');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Función para mostrar mensajes de alerta
//     const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
//         setMensajeAlerta(mensaje);
//         setTipoAlerta(tipo);
//         setMostrarAlertas(true);
//     };

//     return (
//         <>
//             <DataTable<OrdenDeServicio>
//                 data={data}
//                 columns={columns}
//                 actions={actions}
//                 loading={loading}
//                 error={error}
//                 searchTerm={searchTerm}
//                 onSearchChange={setSearchTerm}
//                 onRefresh={handleRefresh}
//                 emptyMessage="No se encontraron órdenes de servicio"
//                 rowKey={(row) => row.IdOrdenDeServicio}
//                 placeHolderBuscador="Buscar órdenes..."
//             />

//             <MensajeAlerta
//                 open={mostrarAlertas}
//                 tipo={tipoAlerta}
//                 mensaje={mensajeAlerta}
//                 onClose={() => setMostrarAlertas(false)}
//             />

//             <MensajeDeCarga
//                 Mensaje={mensajeDeCarga}
//                 MostrarMensaje={mostrarMensajeDeCarga}
//             />
//         </>
//     );
// }





'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { VerTodasLasOrdenesDeServicio } from '@/services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService';
import { Chip } from '@mui/material';
import * as React from 'react';
import { BotonEliminarOrdenDeServicio } from '../acciones/EliminarOrdenDeServicio';
import { VerGenerarPDFOrdenDeServicio } from '../acciones/VerGenerarPDFOrdenDeServicio';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';

interface OrdenDeServicio {
    IdOrdenDeServicio: number;
    NoOrdenDeServicio: string;
    Cliente: string;
    Proyecto: string;
    Mecanico: string;
    CreadoPor: string;
    FechaCreacion: string;
    EstadoOrdenDeServicio: string;
}

export function TablaVisualizarOrdenesDeServicio() {
    const [data, setData] = React.useState<OrdenDeServicio[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    
    // Estados para alertas - MOVIDOS AL PRINCIPAL
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    
    // Estados para mensaje de carga - MOVIDOS AL PRINCIPAL
    const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);
    const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');

    const { sendMessage, messages } = useSocketIO();

    React.useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const response = await VerTodasLasOrdenesDeServicio();
                setData(response);
            } catch (err) {
                setError('Error al cargar las órdenes de servicio');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'orden-de-servicio-creada' || ultimomensajes.tipo === 'orden-de-servicio-eliminada') {
                handleRefresh();
            }
        }
    }, [messages]);

    const columns = [
        {
            key: 'NoOrdenDeServicio',
            header: 'N° Orden',
            width: '120px'
        },
        {
            key: 'Cliente',
            header: 'Cliente'
        },
        {
            key: 'Proyecto',
            header: 'Proyecto'
        },
        {
            key: 'Mecanico',
            header: 'Mecánico'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación',
        },
        {
            key: 'CreadoPor',
            header: 'Creado Por'
        },
        {
            key: 'EstadoOrdenDeServicio',
            header: 'Estado',
            render: (row: OrdenDeServicio) => (
                <Chip
                    label={row.EstadoOrdenDeServicio}
                    color={getEstadoColor(row.EstadoOrdenDeServicio)}
                    size="small"
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        }
    ];

    // Función para mostrar mensajes de alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    // Función para mostrar/ocultar carga
    const manejarCarga = (mostrar: boolean, mensaje: string = '') => {
        setMostrarMensajeDeCarga(mostrar);
        setMensajeDeCarga(mensaje);
    };

    const actions: ActionDefinition<OrdenDeServicio>[] = [
        {
            render: (row) => (
                <VerGenerarPDFOrdenDeServicio
                    IdOrdenDeServicio={row.IdOrdenDeServicio}
                    onMostrarCarga={manejarCarga} // Pasar función callback
                    onMostrarMensaje={mostrarMensaje} // Pasar función callback
                />
            ),
            tooltip: 'Imprimir orden de servicio'
        },
        // ... otras acciones
    ];

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Completado': return 'success';
            case 'Pendiente': return 'warning';
            case 'Cancelado': return 'error';
            case 'En Proceso': return 'info';
            case 'Creado': return 'info';
            default: return 'default';
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await VerTodasLasOrdenesDeServicio();
            setData(response);
        } catch (err) {
            setError('Error al actualizar las órdenes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<OrdenDeServicio>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron órdenes de servicio"
                rowKey={(row) => row.IdOrdenDeServicio}
                placeHolderBuscador="Buscar órdenes..."
            />

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />

            <MensajeDeCarga
                Mensaje={mensajeDeCarga}
                MostrarMensaje={mostrarMensajeDeCarga}
            />
        </>
    );
}