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
import { ListarEstados } from '@/services/generales/ListarEstadosService';
import { nullable } from 'zod';
import { textAlign } from '@mui/system';
import { ConsultarSiguienteNoDevolucion } from '@/services/comercial/devoluciones/ConsultarSiguienteNoDevolucionService';

// 1. Interfaces
// interface Devolucion {
//     Cliente: string;
//     NoDevolucion: string;
//     UsuarioCreacion: string;
// }


// 1. INTERFACES
interface Devolucion {
    NoDevolucion: string;
    Cliente: string;
    Remision?: string; // Añadir remisión asociada
    Proyecto?: string; // Proyecto específico
    FechaDevolucion: string;
    Observaciones: string;
    UsuarioCreacion: string;
    EstadoEquipo: number;
}

interface ItemDevolucion {
    IdEquipo: string;
    NombreEquipo: string;
    CantidadArrendada: number;
    CantidadPendiente: number;
    CantidadADevolver: number;
    EstadoEquipo: number;
    Motivo: string;
    Observaciones: string;
}

interface Option {
    value: string | number;
    label: string;
}

// 2. COMPONENTE PRINCIPAL
export function FormularioCrearDevolucion(): React.JSX.Element {
    // 3. HOOKS DE REACT Y OTROS HOOKS DE LIBRERÍAS
    const { user } = React.useContext(UserContext) || { user: null };
    const documentoUsuarioActivo = user ? `${user.documento}` : null;


    // 4. ESTADOS
    const [datos, setDatos] = React.useState<Devolucion>({
        Cliente: '',
        NoDevolucion: '', // Temporal, luego se consulta a la API
        FechaDevolucion: new Date().toISOString().split('T')[0],
        Observaciones: '',
        UsuarioCreacion: documentoUsuarioActivo || '',
        EstadoEquipo: 9,
    });

    const [clientes, setClientes] = React.useState<Option[]>([]);
    const [proyectos, setProyectos] = React.useState<Option[]>([]);
    const [remisiones, setRemisiones] = React.useState<Option[]>([]);
    const [itemsRemision, setItemsRemision] = React.useState<ItemDevolucion[]>([]);

    // 5. USEEFFECT PARA LA CARGA INICIAL Y SOCKETS
    // Cargar remisiones pendientes cuando se selecciona cliente y proyecto
    React.useEffect(() => {
        ObtenerClientes();
        CargarEstados();
        CargarSiguienteNoDevolucion();
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

    // 6. FUNCIONES DEL COMPONENTE
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

    // Cargar siguiente no devolución
    const CargarSiguienteNoDevolucion = async () => {
        try {
            const SiguienteNoDevolucion = await ConsultarSiguienteNoDevolucion();
            setDatos(prev => ({
                ...prev, NoDevolucion: SiguienteNoDevolucion[0].SiguienteNoDevolucion
            }));
        } catch (error) {
            console.error('Error al consultar el siguiente número de devolución: ', error);
        }
    };
    // ...

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

    // Cargar estados
    const [estados, setEstados] = React.useState<{ value: string | number; label: string }[]>([]);
    const CargarEstados = async () => {
        try {
            const Estados = await ListarEstados();
            const estadosPermitidos = new Set(['buen estado', 'dañado', 'perdido']);
            const NuevosEstados = Estados.filter((element: any) =>
                estadosPermitidos.has(element.label.toLowerCase().trim())
            );
            setEstados(NuevosEstados);
        } catch (error) {
            console.error('Erro al listar los estados: ', error);
        }
    };
    // ...

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

    //Controlar ingreso a la cantidad a devolver
    // const actualizarCantidadADevolver = (idEquipo: string, nuevaCantidad: number) => {
    //     setItemsRemision(prevItems =>
    //         prevItems.map(item =>
    //             item.IdEquipo === idEquipo
    //                 ? { ...item, CantidadADevolver: nuevaCantidad }
    //                 : item
    //         )
    //     );
    // };

    const actualizarCantidadADevolver = (idEquipo: string, nuevaCantidad: number) => {
        setItemsRemision(prevItems =>
            prevItems.map(item => {
                if (item.IdEquipo === idEquipo) {
                    const cantidadMaxima = item.CantidadPendiente;
                    const cantidadFinal = Math.min(
                        Math.max(nuevaCantidad, 0), // No menor a 0
                        cantidadMaxima             // No mayor al pendiente
                    );
                    return { ...item, CantidadADevolver: cantidadFinal };
                }
                return item;
            })
        );
    };
    // ...

    // Para independizar el estado de entrega para cada item/equipo
    const actualizarEstadoEntregaEquipo = (idEquipo: string, nuevoEstadoEntregaEquipo: number) => {
        setItemsRemision(prevItems =>
            prevItems.map(item => {
                if (item.IdEquipo === idEquipo) {
                    const EstadoDeEntregaEquipo = nuevoEstadoEntregaEquipo;
                    return { ...item, EstadoEquipo: EstadoDeEntregaEquipo };
                }
                return item;
            })
        );
    }
    // ...

    // 7. RENDERIZADO JSX DEL COMPONENTE
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
                        value={datos.NoDevolucion}
                        onChange={handleChange}
                        // required
                        tamano='small'
                        tipo_input='text'
                        valorname='NoDevolucion'
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
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Arrendado</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Pendiente</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#000000', width: '15%' }}>A Devolver</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000 !important', width: { xs: '18%', md: '20%' } }}>Estado</TableCell>
                                        {/* <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Motivo</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody
                                >
                                    {itemsRemision.map((item) => (
                                        <TableRow
                                            key={item.IdEquipo}
                                            sx={{ padding: { xs: '6px 8px', md: '8px 12px' } }}
                                        >
                                            <TableCell>{item.NombreEquipo}</TableCell>
                                            <TableCell>{item.CantidadArrendada}</TableCell>
                                            <TableCell>{item.CantidadPendiente}</TableCell>
                                            <TableCell>
                                                {/* <Grid md={3} xs={12} style={{ width: '30%', textAlign: 'right' }}> */}
                                                <Input
                                                    label=""
                                                    value={item.CantidadADevolver}
                                                    tamano="small"
                                                    tipo_input='number'
                                                    onChange={(e) => {
                                                        const nuevaCantidad = parseInt(e.target.value) || 0;
                                                        actualizarCantidadADevolver(item.IdEquipo, nuevaCantidad);
                                                    }}
                                                />
                                                {/* </Grid> */}
                                            </TableCell>
                                            <TableCell>
                                                <InputSelect
                                                    label=""
                                                    value={item.EstadoEquipo}
                                                    options={estados}
                                                    onChange={(e) => {
                                                        const nuevoEstadoEntregaEquipo = parseInt(e.target.value);
                                                        actualizarEstadoEntregaEquipo(item.IdEquipo, nuevoEstadoEntregaEquipo);
                                                    }}
                                                    valorname="EstadoEquipo"
                                                />
                                            </TableCell>
                                            {/* <TableCell>
                                                <TextField
                                                    value={item.Motivo}
                                                    // onChange={(e) => actualizarItem(item.IdEquipo, 'Motivo', e.target.value)}
                                                    onChange={() => { }}
                                                    size="small"
                                                />
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid md={6} xs={12} mt={0.5} >
                            <Input
                                label='Observaciones'
                                value={datos.Observaciones}
                                onChange={handleChange}
                                // required
                                tamano='small'
                                tipo_input='textarea'
                                valorname='Observaciones'
                            />
                        </Grid>
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
