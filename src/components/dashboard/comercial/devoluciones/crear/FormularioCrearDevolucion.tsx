'use client';

import * as React from 'react';
import { UserContext } from '@/contexts/user-context';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '../../../componentes_generales/formulario/Select';
import {
    Card,
    CardContent,
    CardActions,
    Divider,
    Typography,
    Box,
    SelectChangeEvent,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TextField,
    MenuItem,
    TableRow,
    Select,
    TableHead,
    Button
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
// Imports para mostrar info de la bd
import { ListarClientes } from '@/services/generales/ListarClientesService';
import { ListarProyectos } from '@/services/generales/ListarProyectos';
import { VerRemisionesCliente } from '@/services/comercial/devoluciones/VerRemisionesClienteService';
import { MostrarItemsRemision } from '@/services/comercial/devoluciones/MostrarItemsRemisionService';

// 1. Interfaces
// interface Devolucion {
//     Cliente: string;
//     NoDevolucion: string;
//     UsuarioCreacion: string;
// }


// 1. Interfaces
interface Devolucion {
    NoDevolucion: string;
    Cliente: string;
    Remision?: string; // Añadir remisión asociada
    Proyecto?: string; // Proyecto específico
    FechaDevolucion: string;
    Observaciones: string;
    UsuarioCreacion: string;
}

interface ItemDevolucion {
    IdEquipo: string;
    NombreEquipo: string;
    CantidadArrendada: number;
    CantidadPendiente: number;
    CantidadADevolver: number;
    Estado: string;
    Motivo: string;
    Observaciones: string;
}

interface Option {
    value: string | number;
    label: string;
}

// 2. Componente Principal
// export function FormularioCrearDevolucion(): React.JSX.Element {
//     // 3. Hooks de React y otros hooks de librerías
//     const theme = 0;

//     // 4. Estados
//     // const [devolucion, setDevolucion] = React.useState<Devolucion[]>([]);
//     const [datos, setDatos] = React.useState<Devolucion>({
//         Cliente: '',
//         NoDevolucion: '',
//         UsuarioCreacion: '',
//     });
//     const [clientes, setClientes] = React.useState<{ value: string | number; label: string }[]>([]);

//     // 5. useEffect para la carga inicial y sockets
//     React.useEffect(() => {
//         ObtenerClientes();
//     }, []);

//     React.useEffect(() => {
//         console.log('HOLISS');
//     }, [datos.Cliente]);

//     const handleChange = async (e: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement> | { target: { value: string | number; name?: string } }) => {
//         const { name, value } = e.target;
//         setDatos(prev => ({ ...prev, [name ?? '']: value }));
//     };

//     // 6. Funciones del componente
//     const ObtenerClientes = async () => {
//         try {
//             const Clientes = await ListarClientes();
//             setClientes(Clientes);
//         } catch (error) {
//             console.error('Error al obtener clientes:', error);
//         }
//     };

//     // 7. Renderizado JSX del componente
//     return (
//         <Card>
//             <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
//                 <Typography variant="subtitle1" color="text.primary">
//                     Creación de devolución
//                 </Typography>
//                 <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
//                     <Input
//                         label='Devolución No:'
//                         // value={datos.NoRemision}
//                         value="|1"
//                         onChange={() => { }}
//                         // required
//                         tamano='small'
//                         tipo_input='text'
//                         valorname='NoRemision'
//                     />
//                 </Typography>
//             </Box>
//             <Divider />
//             <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
//                 <Grid container spacing={1}>
//                     <Grid md={3} xs={12} mt={0.5}>
//                         <InputSelect
//                             label='Empresa/Cliente'
//                             value={datos.Cliente}
//                             options={clientes}
//                             size='small'
//                             onChange={handleChange}
//                             valorname='Cliente'
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//         </Card>
//     )
// }

export function FormularioCrearDevolucion(): React.JSX.Element {
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;

    // Estados ampliados
    const [datos, setDatos] = React.useState<Devolucion>({
        Cliente: '',
        NoDevolucion: 'DEV-001', // Temporal, luego se consulta a la API
        FechaDevolucion: new Date().toISOString().split('T')[0],
        Observaciones: '',
        UsuarioCreacion: documentoUsuarioActivo || '',
    });

    const [clientes, setClientes] = React.useState<Option[]>([]);
    const [proyectos, setProyectos] = React.useState<Option[]>([]);
    const [remisiones, setRemisiones] = React.useState<Option[]>([]);
    const [itemsRemision, setItemsRemision] = React.useState<ItemDevolucion[]>([]);

    // Cargar remisiones pendientes cuando se selecciona cliente y proyecto
    React.useEffect(() => {
        ObtenerClientes();
    }, []);

    React.useEffect(() => {
        ObtenerProyectosDelCliente();
        setDatos(prev => ({
            ...prev,
            Prueba: `DocCliente: ${datos.Cliente} - IdProyec: ${datos.Proyecto}`
        }))
    }, [datos.Cliente, datos.Proyecto])

    React.useEffect(() => {
        if (datos.Cliente && datos.Proyecto) {
            cargarRemisionesPendientes(datos.Cliente, datos.Proyecto);
        }
    }, [datos.Cliente, datos.Proyecto]);

    const cargarRemisionesPendientes = async (clienteId: string, proyectoId: string) => {
        try {
            // Implementar servicio que consulte remisiones con items pendientes
            // const res = await ListarRemisionesPendientes(clienteId, proyectoId);
            // setRemisiones(res);
            const Remisiones = await VerRemisionesCliente(clienteId, proyectoId);
            setRemisiones(Remisiones);
        } catch (error) {
            console.error('Error al cargar remisiones:', error);
        }
    };

    // Cargar los clientes
    const ObtenerClientes = async () => {
        try {
            const Clientes = await ListarClientes();
            setClientes(Clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    // Cargar proyectos según el cliente seleccionado
    const ObtenerProyectosDelCliente = async () => {
        try {
            let DocumentoCliente = {
                Cliente: datos.Cliente
            }
            const Proyectos = await ListarProyectos(DocumentoCliente);
            setProyectos(Proyectos);
        } catch (error) {
            console.error('Error al obtener los proyectos del cliente:', error);
        }
    }

    // Cargar items cuando se selecciona una remisión
    const cargarItemsRemision = async (remisionId: string) => {
        try {
            // Servicio que trae los items pendientes de devolución
            // const items = await ConsultarItemsRemision(remisionId);
            // setItemsRemision(items.map(item => ({
            //     ...item,
            //     CantidadADevolver: 0,
            //     Estado: '',
            //     Motivo: '',
            //     Observaciones: ''
            // })));

            const ItemsRemision = await MostrarItemsRemision(remisionId);
            setItemsRemision(ItemsRemision);
        } catch (error) {
            console.error('Error al cargar items:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));

        // Resetear proyectos si cambia el cliente
        if (name === 'Cliente' && value !== datos.Cliente) {
            setDatos(prev => ({ ...prev, Proyecto: '', Remision: '' }));
            setProyectos([]);
            setRemisiones([]);
            setItemsRemision([]);
        }

        // Cargar items si se selecciona una remisión
        if (name === 'Remision') {
            cargarItemsRemision(value);
        }
    };

    // Renderizado
    return (
        <Card>
            {/* Cabecera */}
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                <Typography variant="subtitle1" color="text.primary">
                    Creación de devolución
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                    <Input
                        label='Devolución No:'
                        value="1"
                        onChange={handleChange}
                        // required
                        tamano='small'
                        tipo_input='text'
                        valorname='NoRemision'
                    />
                </Typography>
            </Box>
            <Divider />
            <CardContent>
                <Grid container spacing={2}>
                    {/* Selector de Cliente */}
                    <Grid md={4} xs={12}>
                        <InputSelect
                            label="Cliente"
                            value={datos.Cliente}
                            options={clientes}
                            onChange={handleChange}
                            valorname="Cliente"
                        />
                    </Grid>

                    {/* Selector de Proyecto (solo si hay cliente seleccionado) */}
                    {datos.Cliente && (
                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Proyecto"
                                value={datos.Proyecto || ''}
                                options={proyectos}
                                onChange={handleChange}
                                valorname="Proyecto"
                            />
                        </Grid>
                    )}

                    {/* Selector de Remisión (solo si hay proyecto seleccionado) */}
                    {datos.Proyecto && (
                        <Grid md={4} xs={12}>
                            <InputSelect
                                label="Remisión No"
                                value={datos.Remision || ''}
                                options={remisiones}
                                onChange={handleChange}
                                valorname="Remision"
                            />
                        </Grid>
                    )}
                </Grid>

                {/* Lista de Items (solo si hay remisión seleccionada) */}
                {itemsRemision.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6">Items a devolver</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Equipo</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }} align="right">Arrendado</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }} align="right">Pendiente</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }} align="right">A Devolver</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Motivo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody
                                >
                                    {itemsRemision.map((item) => (
                                        <TableRow
                                            key={item.IdEquipo}
                                            // sx={{
                                            //     '&:last-child td, &:last-child th': {  // ← Esto afecta específicamente a la última fila
                                            //         padding: { xs: '6px 8px', md: '8px 12px' },
                                            //         '& .MuiInputBase-root': {
                                            //             boxSizing: 'border-box'
                                            //         }
                                            //     }
                                            // }}
                                            sx={{ padding: { xs: '6px 8px', md: '8px 12px' } }}
                                        >
                                            <TableCell>{item.NombreEquipo}</TableCell>
                                            <TableCell align="right">{item.CantidadArrendada}</TableCell>
                                            <TableCell align="right">{item.CantidadPendiente}</TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.CantidadADevolver}
                                                    // onChange={(e) => actualizarItem(item.IdEquipo, 'CantidadADevolver', e.target.value)}
                                                    onChange={() => { }}
                                                    inputProps={{
                                                        min: 0,
                                                        max: item.CantidadPendiente
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={item.Estado}
                                                    // onChange={(e) => actualizarItem(item.IdEquipo, 'Estado', e.target.value)}
                                                    onChange={() => { }}
                                                    size="small"
                                                >
                                                    <MenuItem value="Bueno">Buen Estado</MenuItem>
                                                    <MenuItem value="Daniado">Dañado</MenuItem>
                                                    <MenuItem value="Perdido">Perdido</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={item.Motivo}
                                                    // onChange={(e) => actualizarItem(item.IdEquipo, 'Motivo', e.target.value)}
                                                    onChange={() => { }}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => { }}>
                    Crear devolución
                </Button>
            </CardActions>
        </Card>
    );
}
