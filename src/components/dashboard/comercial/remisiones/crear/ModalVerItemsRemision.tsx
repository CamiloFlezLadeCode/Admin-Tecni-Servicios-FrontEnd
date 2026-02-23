'use client';
import * as React from 'react';
import {
    Button,
    Modal,
    Box,
    useMediaQuery,
    useTheme,
    IconButton,
    Typography,
    Card,
    CardContent,
    CardActions,
    Divider,
    Table,
    TableBody, TableCell,
    TableContainer, TableHead,
    Tooltip,
    TableRow
} from '@mui/material';
import {
    PencilSimple,
    Trash,
    X,
    Info
} from '@phosphor-icons/react/dist/ssr';

type EquipoItem = {
    value: string | number;
    label: string;
    Categoria?: string;
    Cantidad?: number;
    PrecioUnidad?: number;
    PrecioTotal?: number;
    ObservacionesCliente?: string;
    Subarrendatario?: string;
    NombreSubarrendatario?: string;
    IVA?: number;
    PrecioTotalSinIVA?: number;
};


type ModalVerItemsRemisionProps = {
    items: EquipoItem[];
    onEliminarItem?: (itemId: string | number, subarrendatario?: string) => void;
    precioTotalGeneral?: number;
};
export default function ModalVerItemsRemision({ items, onEliminarItem, precioTotalGeneral }: ModalVerItemsRemisionProps) {
    //Para el manejo del tamaño de la pantalla del dispositivo
    const isMobile = useMediaQuery('(max-width:600px)');
    //...
    //Para menajar el estado del modal
    const [modalAbierto, setModalAbierto] = React.useState(false);
    //...
    //Para menejar el tema del modal
    const theme = useTheme();
    //...
    //Para manejar la apertura del modal
    const VerItems = async () => {
        try {
            // await ConsultarUsuarioGeneral(DatosUsuarioAActualizar);
            setModalAbierto(true);
        } catch (error) {
            // mostrarMensaje(`Error al cargar los datos del usuario general. Error: ${error}`, 'error');
        }
    };
    //...
    return (
        <>
            <Button onClick={VerItems}>Ver</Button>
            <Modal
                open={modalAbierto}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setModalAbierto(false);
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
                    <IconButton
                        onClick={() => setModalAbierto(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <X />
                    </IconButton>
                    <Typography variant="subtitle1" mb={1}>
                        Items remisión
                    </Typography>
                    <Card>
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Item</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Subarrendatario</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Categoría</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Equipo</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Cantidad</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Precio Unidad</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Total Sin IVA</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>IVA%</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Total Con IVA</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Observaciones</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#000000' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {/* <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>Taladro Makita</TableCell>
                                            <TableCell>Electromecánicos</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell sx={{ maxWidth: 200 }}>
                                                <Box
                                                    sx={{
                                                        maxHeight: 80,
                                                        overflowY: 'auto',
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'pre-line',
                                                        paddingRight: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2">¿Qué es Lorem Ipsum?
                                                        Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell style={{display: 'flex', justifyContent: 'center'}}>
                                                <IconButton size="small" color="primary"><Trash size={20} weight="bold" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody> */}
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={`${item.value}-${item.Subarrendatario}`}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.NombreSubarrendatario}</TableCell>
                                                <TableCell>{item.Categoria ?? '-'}</TableCell>
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell>{item.Cantidad ?? 1}</TableCell>
                                                <TableCell>{item.PrecioUnidad ?? 0}</TableCell>
                                                <TableCell>{item.PrecioTotalSinIVA ?? 0}</TableCell>
                                                <TableCell>{item.IVA ?? 0}</TableCell>
                                                <TableCell>{item.PrecioTotal ?? 0}</TableCell>
                                                <TableCell sx={{ maxWidth: 200 }}>
                                                    <Box
                                                        sx={{
                                                            maxHeight: 80,
                                                            overflowY: 'auto',
                                                            wordBreak: 'break-word',
                                                            whiteSpace: 'pre-line',
                                                            paddingRight: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            {item.ObservacionesCliente ?? 'Sin observaciones'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" color="error" onClick={() => onEliminarItem?.(item.value, item.Subarrendatario)} title='Eliminar item'>
                                                        <Trash size={20} weight="bold" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Divider />
                            <Box textAlign="right" padding="10px">
                                <Typography mt={1} style={{ fontWeight: 'bolder', color: '#000000' }}>Precio total general: <span style={{ fontWeight: 'normal' }}>{precioTotalGeneral}</span></Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>
    );
};