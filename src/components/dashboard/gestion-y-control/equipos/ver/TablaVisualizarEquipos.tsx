// 'use client';

// import * as React from 'react';
// import {
//     Card, CardContent, CardHeader, Divider, Chip,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     TextField, Paper, TablePagination, Typography
// } from '@mui/material';

// import { TraerEquipos } from '@/services/gestionycontrol/equipos/TraerEquiposRegistradosService';
// import { FormularioEditarEquipo } from '../editar/FormularioEditarEquipo';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { Loader, ErrorDisplay } from '@/components/dashboard/componentes_generales/mensajedecarga/Loader';
// import { TABLE_PADDING } from '@/styles/theme/padding-table';

// interface Client {
//     Nombre: string;
//     CategoriaEquipo: string;
//     PrecioVenta: number;
//     PrecioAlquiler: number;
//     PrecioReparacion: number;
//     UsuarioCreacion: string;
//     FechaCreacion: string;
//     Estado: string;
//     IdEquipo: number;
//     NombreEquipo: string;
//     Cantidad: number;
//     Subarrendatario: string;
// }

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

// const normalizarEstado = (estado: string): EstadoDb | null => {
//     const limpio = estado.trim().toLowerCase();
//     if (limpio === 'disponible') return 'Disponible';
//     if (limpio === 'no disponible') return 'No disponible';
//     if (limpio === 'reparación') return 'Reparación';
//     return null;
// };

// export function TablaVisualizarEquipos(): React.JSX.Element {
//     const [cargando, setCargando] = React.useState(true);
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [equipos, setEquipos] = React.useState<Client[]>([]);
//     const [error, setError] = React.useState<string | null>(null);

//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(5);

//     //Implementación de WebSocket
//     const { sendMessage, messages } = useSocketIO();
//     const CargarEquipos = async () => {
//         try {
//             setError(null);
//             // await new Promise((resolve) => setTimeout(resolve, 6000));
//             const data = await TraerEquipos();
//             setEquipos(data);
//         } catch (error) {
//             setError(`Error al cargar los equipos: ${error}`);
//         } finally {
//             setCargando(false);
//         }
//     };

//     React.useEffect(() => {
//         CargarEquipos();
//     }, []);

//     React.useEffect(() => {
//         if (messages.length > 0) {
//             const ultimomensajes = messages[messages.length - 1];
//             if (ultimomensajes.tipo === 'equipo-actualizado' || ultimomensajes.tipo === 'equipo-creado') {
//                 CargarEquipos();
//             }
//         }
//     }, [messages]);
//     //...
//     // React.useEffect(() => {
//     //     const fetchEquipos = async () => {
//     //         try {
//     //             const data = await TraerEquipos();
//     //             setEquipos(data);
//     //         } catch (error) {
//     //             console.error('❌ Error al traer los equipos:', error);
//     //             setError('Error al cargar equipos');
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchEquipos();
//     // }, []);

//     const filteredData = equipos.filter(equipo =>
//         equipo.NombreEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         equipo.IdEquipo.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const paginatedData = filteredData.slice(
//         page * rowsPerPage,
//         page * rowsPerPage + rowsPerPage
//     );

//     if (cargando) return <Loader />;
//     if (error) return <ErrorDisplay message={error} />;

//     return (
//         <Card>
//             {/* <CardHeader
//                 title="Visualización de equipos"
//                 sx={{ fontSize: '0.875rem', padding: '8px' }}
//             /> */}
//             <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de equipos</Typography>

//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Paper>
//                     <TextField
//                         variant="outlined"
//                         placeholder="Buscar equipo..."
//                         onChange={e => {
//                             setSearchTerm(e.target.value);
//                             setPage(0); // Reiniciar página al buscar
//                         }}
//                         // style={{ margin: '16px' }}
//                         size="small"
//                     />
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Id</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Categoria/Familia</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cantidad</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Subarrendatario</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Venta</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Alquiler</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Reparación</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {paginatedData.map((equipo) => {
//                                     const estadoDb = normalizarEstado(equipo.Estado);
//                                     const estadoKey = estadoDb ? estadoMap[estadoDb] : null;

//                                     return (
//                                         <TableRow key={equipo.IdEquipo}>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.IdEquipo}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.NombreEquipo}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.CategoriaEquipo}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.Cantidad}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.Subarrendatario}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.PrecioVenta}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.PrecioAlquiler}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.PrecioReparacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.UsuarioCreacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>{equipo.FechaCreacion}</TableCell>
//                                             <TableCell sx={TABLE_PADDING}>
//                                                 <Chip
//                                                     label={estadoKey ? Estado[estadoKey].label : equipo.Estado}
//                                                     color={estadoKey ? Estado[estadoKey].color : 'default'}
//                                                     size="small"
//                                                     sx={{ width: 120, justifyContent: 'center' }}
//                                                 />
//                                             </TableCell>
//                                             <TableCell sx={TABLE_PADDING}>
//                                                 <FormularioEditarEquipo
//                                                     IdEquipo={equipo.IdEquipo}
//                                                     sendMessage={sendMessage}
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     );
//                                 })}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                     {/* <TablePagination
//                         component="div"
//                         count={filteredData.length}
//                         page={page}
//                         onPageChange={(event, newPage) => setPage(newPage)}
//                         rowsPerPage={rowsPerPage}
//                         onRowsPerPageChange={(event) => {
//                             setRowsPerPage(parseInt(event.target.value, 10));
//                             setPage(0); // Reiniciar al cambiar filas por página
//                         }}
//                         rowsPerPageOptions={[5, 10, 25]}
//                         labelRowsPerPage="Filas por página"
//                     /> */}
//                 </Paper>
//                 <TablePagination
//                     component="div"
//                     count={filteredData.length}
//                     page={page}
//                     onPageChange={(event, newPage) => setPage(newPage)}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={(event) => {
//                         setRowsPerPage(parseInt(event.target.value, 10));
//                         setPage(0); // Reiniciar al cambiar filas por página
//                     }}
//                     rowsPerPageOptions={[5, 10, 25]}
//                     labelRowsPerPage="Filas por página"
//                 />
//             </CardContent>
//         </Card>
//     );
// };


'use client';

import * as React from 'react';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { TraerEquipos } from '@/services/gestionycontrol/equipos/TraerEquiposRegistradosService';
import { FormularioEditarEquipo } from '../editar/FormularioEditarEquipo';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { Card, CardContent, Typography, Divider, Chip } from '@mui/material';
import { TABLE_PADDING } from '@/styles/theme/padding-table';

interface Equipo {
    IdEquipo: number;
    NombreEquipo: string;
    CategoriaEquipo: string;
    Cantidad: number;
    Subarrendatario: string;
    PrecioVenta: number;
    PrecioAlquiler: number;
    PrecioReparacion: number;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
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

// 1. Definir tipos para los mensajes
type TipoMensaje =
    | 'equipo-actualizado'
    | 'equipo-creado'
    | 'remision-creada'
    | 'devolucion-creada'
    | 'remision-anulada';

interface Mensaje {
    tipo: TipoMensaje;
    // otras propiedades que puedan tener tus mensajes
    [key: string]: any;
}

// 2. Definir el tipo para las acciones
type Acciones = {
    [key in TipoMensaje]: () => Promise<void>;
};

export function TablaVisualizarEquipos(): React.JSX.Element {
    const [data, setData] = React.useState<Equipo[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { sendMessage, messages } = useSocketIO();
    //Estados para el manejo de las notificaciones/alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    //...


    //Función para abrir la alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    //....

    const cargarEquipos = async () => {
        try {
            setError(null);
            const data = await TraerEquipos();
            setData(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        cargarEquipos();
    }, []);

    // React.useEffect(() => {
    //     if (messages.length > 0) {
    //         const ultimoMensaje = messages[messages.length - 1];
    //         if (ultimoMensaje.tipo === 'equipo-actualizado' || ultimoMensaje.tipo === 'equipo-creado') {
    //             cargarEquipos();
    //         }
    //     }
    // }, [messages]);

    React.useEffect(() => {
        const manejarEventosDeActualizacion = async () => {
            if (messages.length === 0) return;

            const ultimoMensaje = messages[messages.length - 1] as Mensaje;

            // 3. Verificación de tipo segura
            if (!ultimoMensaje || !ultimoMensaje.tipo) return;

            try {
                const acciones: Acciones = {
                    'equipo-actualizado': cargarEquipos,
                    'equipo-creado': cargarEquipos,
                    // 'remision-creada': async () => {
                    //   await cargarEquipos();
                    //   const [siguienteNoRemision] = await ConsultarSiguienteNoRemision();
                    //   setDatos(prev => ({ ...prev, NoRemision: siguienteNoRemision.SiguienteNoRemision }));
                    // },
                    'remision-creada': cargarEquipos,
                    'devolucion-creada': cargarEquipos,
                    'remision-anulada': cargarEquipos
                };

                // Verificar que el tipo es una clave válida
                if (ultimoMensaje.tipo in acciones) {
                    await acciones[ultimoMensaje.tipo]();

                    const notificaciones: Record<TipoMensaje, string> = {
                        'equipo-actualizado': 'Equipo actualizado correctamente',
                        'equipo-creado': 'Nuevo equipo creado exitosamente',
                        'remision-creada': 'Remisión generada con éxito',
                        'devolucion-creada': 'Devolución registrada correctamente',
                        'remision-anulada': 'Remisión anulada exitosamente'
                    };

                    mostrarMensaje(notificaciones[ultimoMensaje.tipo], 'success');
                    setMostrarAlertas(false);
                }
            } catch (error) {
                console.error(`Error al procesar ${ultimoMensaje.tipo}:`, error);
                mostrarMensaje(`Error al procesar ${ultimoMensaje.tipo}`, 'error');
            }
        };

        manejarEventosDeActualizacion();
    }, [messages, cargarEquipos, mostrarMensaje]);

    const columns = [
        // {
        //     key: 'IdEquipo',
        //     header: 'ID',
        //     width: '80px'
        // },
        {
            key: 'TipoDeEquipo',
            header: 'Pertenencia'
        },
        {
            key: 'Subarrendatario',
            header: 'Subarrendatario'
        },
        {
            key: 'BodegaUbicacion',
            header: 'Bodega'
        },
        {
            key: 'NombreEquipo',
            header: 'Nombre'
        },
        {
            key: 'CategoriaEquipo',
            header: 'Categoría'
        },
        {
            key: 'Cantidad',
            header: 'Cantidad Total',
            align: 'right' as const
        },
        {
            key: 'CantidadDisponible',
            header: 'Cantidad Disponible',
            align: 'right' as const
        },
        {
            key: 'PrecioVenta',
            header: 'Precio Venta',
            // render: (row: Equipo) => row.PrecioVenta.toLocaleString(),
            align: 'right' as const
        },
        {
            key: 'PrecioAlquiler',
            header: 'Precio Alquiler',
            // render: (row: Equipo) => row.PrecioAlquiler.toLocaleString(),
            align: 'right' as const
        },
        {
            key: 'PrecioReparacion',
            header: 'Precio Reparación',
            // render: (row: Equipo) => row.PrecioReparacion.toLocaleString(),
            align: 'right' as const
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
            key: 'Estado',
            header: 'Estado',
            render: (row: Equipo) => {
                const estadoDb = normalizarEstado(row.Estado);
                const estadoKey = estadoDb ? estadoMap[estadoDb] : null;

                return (
                    <Chip
                        label={estadoKey ? Estado[estadoKey].label : row.Estado}
                        color={estadoKey ? Estado[estadoKey].color : 'default'}
                        size="small"
                        sx={{ width: 120, justifyContent: 'center' }}
                    />
                );
            }
        }
    ];

    const actions = [
        {
            render: (row: Equipo) => (
                <FormularioEditarEquipo
                    IdEquipo={row.IdEquipo}
                    sendMessage={sendMessage}
                />
            ),
            tooltip: 'Editar equipo'
        }
    ];

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            await cargarEquipos();
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<Equipo>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron equipos"
                rowKey={(row) => row.IdEquipo}
                placeHolderBuscador='Buscar equipos...'
            />

            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </>
    );
}