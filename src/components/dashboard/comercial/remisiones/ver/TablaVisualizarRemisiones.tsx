'use client';

import * as React from 'react';
import { Loader, ErrorDisplay } from '@/components/dashboard/componentes_generales/mensajedecarga/Loader';
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
    useTheme,
    Box,
    CircularProgress
} from '@mui/material';
import {
    FilePdf,
    Printer,
    Trash,
    PencilSimple
}
    from '@phosphor-icons/react/dist/ssr';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { ConsultarRemisiones } from '@/services/comercial/remisiones/ConsultarRemisionesService';
import { GenerarPDFRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/GenerarPDFRemision';
import { EliminarRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/EliminarRemision';
import { EditarRemision } from '@/components/dashboard/comercial/remisiones/acciones-remision/EditarRemision';


// 1. Tipos / Interfaces locales
interface Remision {
    IdRemision: number;
    NoRemision: string;
    Cliente: string;
    Proyecto: string;
    CreadoPor: string;
    FechaCreacion: string;
    ObservacionesInternasEmpresa: string;
    EstadoRemision: string;
}


// 2. Componente principal
export function TablaVisualizarRemisiones(): React.JSX.Element {
    // 3. Hooks de React y otros hooks de librerías
    const theme = useTheme();
    const { sendMessage, messages } = useSocketIO();

    // 4. Estados
    // const [remisiones, setRemisiones] = React.useState<any[]>([]);
    const [remisiones, setRemisiones] = React.useState<Remision[]>([]);
    const [cargando, setCargando] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [buscarPalabra, setBuscarPalabra] = React.useState('');
    const [pagina, setPagina] = React.useState(0);
    const [filasPorPagina, setFilasPorPagina] = React.useState(5);

    // 5. useEffect para carga inicial y sockets
    React.useEffect(() => {
        ObtenerRemisiones();
    }, []);

    // 6. Funciones del componente
    const ObtenerRemisiones = async () => {
        try {
            setError(null);
            // Simula retraso
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            // Forzar un error de prueba
            // throw new Error('Simulación de error al obtener remisiones');
            // const data = await ConsultarRemisiones();
            const data: Remision[] = await ConsultarRemisiones();
            setRemisiones(data);
        } catch (error) {
            setError(`Error al cargar las remisiones: ${error}`);
        } finally {
            setCargando(false);
        }
    };

    // Filtrado y paginado de tabla
    // const FiltrarDatosEnTabla = remisiones.filter(remision =>
    //     remision.NoRemision?.toLowerCase().includes(buscarPalabra.toLowerCase())
    // );
    const FiltrarDatosEnTabla = remisiones.filter((remision) =>
        Object.values(remision).some((valor) =>
            String(valor).toLowerCase().includes(buscarPalabra.toLowerCase())
        )
    );

    const PaginadoTabla = FiltrarDatosEnTabla.slice(
        pagina * filasPorPagina,
        pagina * filasPorPagina + filasPorPagina
    );

    if (cargando) return <Loader />;
    if (error) return <ErrorDisplay message={error} />;


    // 7. Renderizado JSX
    return (
        <Card>
            <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de remisiones</Typography>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Paper>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar remisión..."
                        onChange={e => setBuscarPalabra(e.target.value)}
                        // style={{ margin: '16px' }}
                        size='small'
                    />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Id</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>NoRemisión</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cliente</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Proyecto</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Creado Por</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Fecha Creación</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Observaciones</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Estado</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', color: '#000000' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {PaginadoTabla.map((remision: Remision) => (
                                    <TableRow key={remision.IdRemision}>
                                        <TableCell>{remision.IdRemision}</TableCell>
                                        <TableCell>{remision.NoRemision}</TableCell>
                                        <TableCell>{remision.Cliente}</TableCell>
                                        <TableCell>{remision.Proyecto}</TableCell>
                                        <TableCell>{remision.CreadoPor}</TableCell>
                                        <TableCell>{remision.FechaCreacion}</TableCell>
                                        <TableCell>{remision.ObservacionesInternasEmpresa}</TableCell>
                                        <TableCell>{remision.EstadoRemision}</TableCell>
                                        <TableCell>
                                            <EditarRemision />
                                            <GenerarPDFRemision IdRemision={remision.IdRemision}/>
                                            <EliminarRemision />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <TablePagination
                    component="div"
                    count={FiltrarDatosEnTabla.length}
                    page={pagina}
                    onPageChange={(_, newPage) => setPagina(newPage)}
                    rowsPerPage={filasPorPagina}
                    onRowsPerPageChange={(event) => {
                        setFilasPorPagina(parseInt(event.target.value, 10));
                        setPagina(0);
                    }}
                    labelRowsPerPage="Filas por página"
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </CardContent>
        </Card>
    )
};