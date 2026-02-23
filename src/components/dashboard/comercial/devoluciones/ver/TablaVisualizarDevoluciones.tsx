'use client';
import { EliminarRegistro } from '@/components/dashboard/componentes_generales/acciones/EliminarRegistro';
import { GenerarPDF } from '@/components/dashboard/componentes_generales/acciones/GenerarPDF';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import MensajeDeCarga from '@/components/dashboard/componentes_generales/mensajedecarga/BackDropCircularProgress';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useSocketIO } from '@/hooks/use-WebSocket';
import { EliminarDevolucion } from '@/services/comercial/devoluciones/EliminarDevolucionService';
import { ObtenerPDFDevolucion } from '@/services/comercial/devoluciones/ObtenerPDFDevolucionService';
import { VerTodasLasDevoluciones } from '@/services/comercial/devoluciones/VerTodasLasDevolucionesService';
import {
    Chip,
    Modal,
    Box,
    Typography,
    Button,
    Fade,
    Backdrop,
    CircularProgress,
    useTheme,
} from '@mui/material';
import * as React from 'react';
import { getEstadoColor } from '@/utils/getEstadoColor';
import { EditarDevolucion } from '@/components/dashboard/comercial/devoluciones/acciones/EditarDevolucion';


interface Devolucion {
    IdDevolucion: number;
    NoDevolucion: string;
    IdRemision: number;
    Cliente: string;
    Proyecto: string;
    CreadoPor: string;
    FechaCreacion: string;
    Estado: string;
}

export function TablaVisualizarDevoluciones(): React.JSX.Element {
    const { sendMessage, messages } = useSocketIO();
    const [data, setData] = React.useState<Devolucion[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    // Estados para alertas
    const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
    const [mensajeAlerta, setMensajeAlerta] = React.useState('');
    const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');
    const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');
    const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await VerTodasLasDevoluciones();
                setData(response);
            } catch (err) {
                setError(`Error al cargar las devoluciones: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        if (messages.length > 0) {
            const ultimomensajes = messages[messages.length - 1];
            if (ultimomensajes.tipo === 'devolucion-creada' || ultimomensajes.tipo === 'devolucion-eliminada') {
                handleRefresh();
            }
        }
    }, [messages]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setSearchTerm('');
            const response = await VerTodasLasDevoluciones();
            setData(response);
        } catch (err) {
            setError(`Error al actualizar: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para mostrar mensajes de alerta
    const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setMostrarAlertas(true);
    };

    const columns = [
        // {
        //     key: 'IdDevolucion',
        //     header: 'Id'
        // },
        {
            key: 'NoDevolucion',
            header: 'No Devolución'
        },
        {
            key: 'NoRemision',
            header: 'No Remisión'
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
            key: 'CreadoPor',
            header: 'Creado Por'
        },
        {
            key: 'FechaCreacion',
            header: 'Fecha Creación'
        },
        {
            key: 'Estado',
            header: 'Estado',
            render: (row: Devolucion) => (
                <Chip
                    label={row.Estado}
                    color={getEstadoColor(row.Estado)}
                    size="small"
                    sx={{ color: 'white', minWidth: 100 }}
                />
            )
        },
    ];

    // Función para mostrar/ocultar carga
    const manejarCarga = (mostrar: boolean, mensaje: string = '') => {
        setMostrarMensajeDeCarga(mostrar);
        setMensajeDeCarga(mensaje);
    };

    const actions: ActionDefinition<Devolucion>[] = [
        {
            render: (row: Devolucion) => (
                <EditarDevolucion
                MostrarModalTemporalDesarrollo={true}
                // IdDevolucion={row.IdDevolucion}
                // NoDevolucion={row.NoDevolucion}
                // sendMessage={sendMessage}
                // mostrarMensaje={mostrarMensaje}
                />
            ),
            tooltip: 'Editar devolución'
        },
        {
            render: (row: Devolucion) => (
                <GenerarPDF
                    servicioPDF={(id) => ObtenerPDFDevolucion(row.IdDevolucion)}
                    idRecurso={row.IdDevolucion}
                    nombreArchivo={`devolución-No${row.IdDevolucion}.pdf`}
                    mensajes={{
                        generando: 'Generando PDF de devolución. Por favor espere',
                        exito: 'PDF generado correctamente',
                        error: 'Error al generar el PDF de la devolución'
                    }}
                    onMostrarCarga={manejarCarga}
                    onMostrarMensaje={mostrarMensaje}
                    comportamiento="impresion"
                // icono={<Printer size={20} weight="bold" />}
                />
            ),
            tooltip: 'Imprimir devolución'
        },
        {
            render: (row: Devolucion) => (
                <EliminarRegistro
                    servicioEliminarRegistro={(id) => EliminarDevolucion(row.IdDevolucion)}
                    idRecurso={row.IdDevolucion}
                    sendMessage={sendMessage}
                    mostrarMensaje={mostrarMensaje}
                    mensajes={{
                        ariaLabel: `eliminar-devolucion-${row.IdDevolucion}`,
                        socket: 'devolucion-eliminada',
                        info: `¿Realmente quieres eliminar la devolución ${row.NoDevolucion}?`,
                        exito: 'Devolución eliminada correctamente',
                        error: 'Error al eliminar devolución'
                    }}
                    TituloParaTooltip="Eliminar devolución"
                />
            ),
            // tooltip: 'Eliminar devolución'
        }
    ];


    //Para menejar el tema del modal
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        localStorage.setItem('MostrarModalDevoluciones', 'false');
    };

    React.useEffect(() => {
        const mostrarModal = localStorage.getItem('MostrarModalDevoluciones');
        if (mostrarModal === null || mostrarModal === 'true') {
            handleOpen();
        }
    }, []);

    return (
        <>
            <DataTable<Devolucion>
                data={data}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={handleRefresh}
                emptyMessage="No se encontraron devoluciones"
                rowKey={(row) => row.IdDevolucion}
                placeHolderBuscador='Buscar devoluciones...'
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
            <Modal
                open={open}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleClose();
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '1%',
                        left: '50%',
                        transform: 'translate(-50%)', //Solo horizontalmente
                        // width: '90%',
                        // maxWidth: 1000,
                        // width: '80%',
                        width: {
                            xs: '95%',
                            sm: '90%',
                            md: '80%',
                            lg: '70%',
                        },
                        [theme.breakpoints.down('xl')]: {
                            // width: 700,
                        },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ¡HOLA MELY! 😊
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Ya puedes realizar devoluciones marcando todos los items necesarios, sin importar el subarrendatario.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Ok, gracias!
                        </Button>
                    </Box>
                </Box>

            </Modal>
        </>
    )
}