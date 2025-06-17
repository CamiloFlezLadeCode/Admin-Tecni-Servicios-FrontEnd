'use client';

import { FormularioEditarUsuarioGeneral } from '@/components/dashboard/gestion-y-control/usuarios-generales/editar/FormularioEditarUsuarioGeneral';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { UserContext } from '@/contexts/user-context';
import { ConsultarUsuariosGenerales } from '@/services/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesService';
import {
    Card, CardContent,
    Chip,
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody, TableCell,
    TableContainer, TableHead,
    TablePagination,
    TableRow, TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { FilePdf, Printer, Trash } from '@phosphor-icons/react/dist/ssr';
import { Loader, ErrorDisplay } from '@/components/dashboard/componentes_generales/mensajedecarga/Loader';
import * as React from 'react';

interface UsuarioGeneral {
    IdUsuario: string;
    Nombre: string;
    TipoDocumento: string;
    Documento: string;
    Correo: string;
    Direccion: string;
    Telefono: string;
    Celular: string;
    RolesLabel: string;
    RolesValue: string;
    Nivel: string;
    UsuarioCreacion: string;
    FechaCreacion: string;
    Estado: string;
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

export function TablaVisualizarUsuariosGenerales(): React.JSX.Element {
    const [usuarios, setUsuarios] = React.useState<any[]>([]);
    const [cargando, setCargando] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Dentro del componente:
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    // ...

    // Implementación de WebSocket
    const { sendMessage, messages } = useSocketIO();
    const cargarUsuarios = async () => {
        try {
            setError(null);
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const data = await ConsultarUsuariosGenerales();
            setUsuarios(data);
        } catch (error) {
            setError(`Error al cargar los usuarios: ${error}`);
        } finally {
            setCargando(false);
        }
    };

    React.useEffect(() => {
        cargarUsuarios(); // Al iniciar
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimoMensaje = messages[messages.length - 1];

            if (ultimoMensaje.tipo === 'usuario-actualizado' || ultimoMensaje.tipo === 'usuario-creado') {
                cargarUsuarios();
            }
        }
    }, [messages]);
    // ...

    // const filteredData = usuarios.filter(usuariogeneral =>
    //     usuariogeneral.Nombre.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    //     usuariogeneral.Documento.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    //     usuariogeneral.RolesLabel.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    // );
    const filteredData = usuarios.filter(usuariogeneral =>
        (usuariogeneral.Nombre && usuariogeneral.Nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (usuariogeneral.Documento && usuariogeneral.Documento.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (usuariogeneral.RolesLabel && usuariogeneral.RolesLabel.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Se captura el rol del usuario activo para ocultar ó mostrar la columna de acciones
    const { user } = React.useContext(UserContext) || { user: null };
    const mostrarAcciones = user?.rol === 'Administrador';
    // ...

    if (cargando) return <Loader />;
    if (error) return <ErrorDisplay message={error} />;

    return (
        <Card>
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de usuarios generales</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar usuario general..."
                        onChange={e => setSearchTerm(e.target.value)}
                        // style={{ margin: '16px' }}
                        size='small'
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nombre</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Tipo Documento</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Documento</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Correo</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Dirección</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Celular</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Roles</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Nivel</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                    {/* <TableCell style={{ fontWeight: 'bold', color: '#000000' }} align="center">Acciones</TableCell> */}
                                    {mostrarAcciones && (
                                        <TableCell
                                            style={{ fontWeight: 'bold', color: '#000000' }}
                                            align="center"
                                        >
                                            Acciones
                                        </TableCell>
                                    )}

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((usuariogeneral, index) => {
                                    const estadoKey = estadoMap[usuariogeneral.Estado.toLowerCase() as EstadoDb] ?? 'inactive';
                                    return (
                                        <TableRow key={usuariogeneral.IdUsuario}>
                                            <TableCell>{usuariogeneral.Nombre}</TableCell>
                                            <TableCell>{usuariogeneral.TipoDocumento}</TableCell>
                                            <TableCell>{usuariogeneral.Documento}</TableCell>
                                            <TableCell>{usuariogeneral.Correo}</TableCell>
                                            <TableCell>{usuariogeneral.Direccion}</TableCell>
                                            <TableCell>{usuariogeneral.Celular}</TableCell>
                                            <TableCell>{usuariogeneral.RolesLabel}</TableCell>
                                            <TableCell>{usuariogeneral.Nivel}</TableCell>
                                            <TableCell>{usuariogeneral.UsuarioCreacion}</TableCell>
                                            <TableCell>{usuariogeneral.FechaCreacion}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={Estado[estadoKey].label}
                                                    color={Estado[estadoKey].color}
                                                    size="small"
                                                    sx={{ width: 90, justifyContent: 'center' }}
                                                />
                                            </TableCell>
                                            {mostrarAcciones && (
                                                <TableCell align="center">
                                                    <FormularioEditarUsuarioGeneral
                                                        DatosUsuarioAActualizar={usuariogeneral.Documento}
                                                        sendMessage={sendMessage}
                                                    />
                                                    {/* <IconButton
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <Trash size={20} weight="bold" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <Printer size={20} weight='bold' />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <FilePdf size={20} weight='bold' />
                                                </IconButton> */}
                                                </TableCell>
                                            )}

                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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