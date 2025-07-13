// 'use client';

// import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
// import { useSocketIO } from '@/hooks/use-WebSocket';
// import { ConsultarVehiculos } from '@/services/gestionycontrol/vehiculos/ConsultarVehiculosService';
// import {
//     Card, CardContent,
//     Chip,
//     Divider,
//     Paper,
//     Table,
//     TableBody, TableCell,
//     TableContainer, TableHead,
//     TablePagination,
//     TableRow, TextField,
//     Typography
// } from '@mui/material';
// import * as React from 'react';
// import { FormularioModalEditarVehiculo } from '../editar/FormularioEditarVehiculo';
// import AlertaEliminarVehiculo from '../eliminar/AlertaEliminarVehiculo';
// import { Loader, ErrorDisplay } from '@/components/dashboard/componentes_generales/mensajedecarga/Loader';
// import { TABLE_PADDING } from '@/styles/theme/padding-table';

// interface Vehiculo {
//     IdVehiculo: string;
//     Placa: string;
//     Estado: string;
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

// export function TablaVisualizarVehiculos(): React.JSX.Element {
//     const [vehiculos, setVehiculos] = React.useState<any[]>([]);
//     const [cargando, setCargando] = React.useState(true);
//     const [error, setError] = React.useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(5);

//     // const { messages } = useSocketIO(process.env.NEXT_PUBLIC_WS_URL!);
//     // 👇 ÚNICA instancia del socket
//     const { sendMessage, messages } = useSocketIO();

//     const CargarVehiculos = async () => {
//         try {
//             setError(null);
//             // await new Promise((resolve) => setTimeout(resolve, 2000));
//             const data = await ConsultarVehiculos();
//             setVehiculos(data);
//         } catch (error) {
//             setError(`Error al cargar los vehículos: ${error}`);
//         } finally {
//             setCargando(false);
//         }
//     };

//     //Carga los vehículos al iniciar/cargar
//     React.useEffect(() => {
//         CargarVehiculos();
//     }, []);

//     //Se cargan nuevamente cuando un vehiculo es creado, actualizado ó eliminado
//     React.useEffect(() => {
//         // console.log("Mensajes recibidos:", messages); // ← añade esto
//         if (messages.length > 0) {
//             const UltimoMensajeEmitdo = messages[messages.length - 1];
//             if (
//                 UltimoMensajeEmitdo.tipo === 'vehiculo-actualizado' ||
//                 UltimoMensajeEmitdo.tipo === 'vehiculo-creado' ||
//                 UltimoMensajeEmitdo.tipo === 'vehiculo-eliminado'
//             ) {
//                 CargarVehiculos();
//             }
//         }
//     }, [messages]);

//     // Se implementó acá porque si se dejaba en el componente "AlertaEliminarVehiculo.tsx", se perdía al momento de eliminar el vehículo
//     // ya que al no estar presente en la tabla, este desmontaba el componente por completo impidiendo la visualización de la alerta de confirmación
//     // Se declaran los estados para las alertas para la eliminación del vehículo
//     const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
//     const [mensajeAlerta, setMensajeAlerta] = React.useState('');
//     const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
//     // ...

//     // Funcionalidad para abrir/mostrar la alerta para la eliminación del vehículo
//     const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
//         setMensajeAlerta(mensaje);
//         setTipoAlerta(tipo);
//         setMostrarAlertas(true);
//     };
//     // ...

//     const filteredData = vehiculos.filter(vehiculo =>
//         vehiculo.Placa.toLowerCase().includes(searchTerm.toLocaleLowerCase())
//     );
//     const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     if (cargando) return <Loader />;
//     if (error) return <ErrorDisplay message={error} />;

//     return (
//         <>
//             <MensajeAlerta
//                 open={mostrarAlertas}
//                 tipo={tipoAlerta}
//                 mensaje={mensajeAlerta}
//                 onClose={() => setMostrarAlertas(false)}
//             />
//             <Card>
//                 <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de vehículos</Typography>
//                 <Divider />
//                 <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                     <Paper>
//                         <TextField
//                             variant="outlined"
//                             placeholder="Buscar vehículo..."
//                             onChange={e => setSearchTerm(e.target.value)}
//                             // style={{ margin: '16px' }}
//                             size='small'
//                         />
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>IdVehículo</TableCell>
//                                         <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Placa</TableCell>
//                                         <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
//                                         <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
//                                         <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
//                                         <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {paginatedData.map((vehiculo, index) => {
//                                         const estadokey = estadoMap[vehiculo.Estado.toLowerCase() as EstadoDb] ?? 'inactive';
//                                         return (
//                                             <TableRow key={vehiculo.IdVehiculo}>
//                                                 <TableCell sx={TABLE_PADDING}>{vehiculo.IdVehiculo}</TableCell>
//                                                 <TableCell sx={TABLE_PADDING}>{vehiculo.Placa}</TableCell>
//                                                 <TableCell sx={TABLE_PADDING}>{vehiculo.UsuarioCreacion}</TableCell>
//                                                 <TableCell sx={TABLE_PADDING}>{vehiculo.FechaCreacion}</TableCell>
//                                                 <TableCell sx={TABLE_PADDING}>
//                                                     <Chip
//                                                         label={Estado[estadokey].label}
//                                                         color={Estado[estadokey].color}
//                                                         size="small"
//                                                         sx={{ width: 90, justifyContent: 'center' }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell sx={TABLE_PADDING}>
//                                                     <FormularioModalEditarVehiculo
//                                                         IdVehiculo={vehiculo.IdVehiculo}
//                                                         sendMessage={sendMessage} // 👈 pásalo como prop
//                                                     />
//                                                     <AlertaEliminarVehiculo
//                                                         IdVehiculo={vehiculo.IdVehiculo}
//                                                         NombrePlacaVehiculo={vehiculo.Placa}
//                                                         sendMessage={sendMessage} // 👈 pásalo como prop
//                                                         mostrarMensaje={mostrarMensaje}
//                                                     />
//                                                 </TableCell>
//                                             </TableRow>
//                                         )
//                                     })}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Paper>
//                     <TablePagination
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
//                     />
//                 </CardContent>
//             </Card>
//         </>
//     );
// };



'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarVehiculos } from '@/services/gestionycontrol/vehiculos/ConsultarVehiculosService';
import * as React from 'react';
import { FormularioModalEditarVehiculo } from '../editar/FormularioEditarVehiculo';
import AlertaEliminarVehiculo from '../eliminar/AlertaEliminarVehiculo';
import { Chip } from '@mui/material';

interface Vehiculo {
    Estado: string;
    IdVehiculo: number;
    Placa: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
}

export function TablaVisualizarVehiculos(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();

    const [data, setData] = React.useState<Vehiculo[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Se implementó acá porque si se dejaba en el componente "AlertaEliminarVehiculo.tsx", se perdía al momento de eliminar el vehículo
    // ya que al no estar presente en la tabla, este desmontaba el componente por completo impidiendo la visualización de la alerta de confirmación
    // Se declaran los estados para las alertas para la eliminación del vehículo
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    // ...

    const CargarVehiculos = async () => {
        try {
            setError(null);
            const data = await ConsultarVehiculos();
            setData(data);
        } catch (error) {
            setError(`Error al cargar los equipos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        CargarVehiculos();
    }, []);

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Activo': return 'success';
            case 'Inactivo': return 'error';
            default: return 'default';
        }
    };

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'vehiculo-creado' || ultimomensajes.tipo === 'vehiculo-actualizado' || ultimomensajes.tipo === 'vehiculo-eliminado') {
                CargarVehiculos();
            }
        }
    }, [messages]);

    const columns = [
        {
            key: 'IdVehiculo',
            header: 'IdVehículo'
        },
        {
            key: 'Placa',
            header: 'Placa'
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
            render: (row: Vehiculo) => {
                return (
                    <Chip
                        label={row.Estado}
                        color={getEstadoColor(row.Estado)}
                        size="small"
                        sx={{ color: 'white', minWidth: 100 }}
                    />
                )
            }
        }
    ];

    const actions: ActionDefinition<Vehiculo>[] = [
        {
            render: (row: Vehiculo) => (
                <FormularioModalEditarVehiculo
                    IdVehiculo={row.IdVehiculo}
                    sendMessage={sendMessage} // 👈 pásalo como prop
                />
            ),
            tooltip: 'Editar vehiculo'
        },
        // {
        //     render: (row: Vehiculo) => (
        //         < AlertaEliminarVehiculo
        //             IdVehiculo={row.IdVehiculo}
        //             NombrePlacaVehiculo={row.Placa}
        //             sendMessage={sendMessage} // 👈 pásalo como prop
        //             mostrarMensaje={mostrarMensaje}
        //         />
        //     ),
        //     tooltip: 'Eliminar vehiculo'
        // }
    ];

    // Funcionalidad para abrir/mostrar la alerta para la eliminación del vehículo
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };
    // ...

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await ConsultarVehiculos();
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable<Vehiculo>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron vehículos"
                rowKey={(row) => row.IdVehiculo}
                placeHolderBuscador='Buscar vehículos...'
            />
            <MensajeAlerta
                open={mostrarAlertas}
                tipo={tipoAlerta}
                mensaje={mensajeAlerta}
                onClose={() => setMostrarAlertas(false)}
            />
        </>
    )
}