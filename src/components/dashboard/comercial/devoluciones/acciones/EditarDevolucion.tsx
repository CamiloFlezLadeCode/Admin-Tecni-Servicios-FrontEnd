'use client';
import * as React from 'react';
import {
    IconButton,
    Tooltip,
    Modal,
    Box,
    Typography,
    useTheme,
    Button
} from '@mui/material';
import {
    PencilSimple
} from '@phosphor-icons/react';

interface EditarDevolucionProps {
    MostrarModalTemporalDesarrollo: boolean;
}

export function EditarDevolucion({ MostrarModalTemporalDesarrollo }: EditarDevolucionProps): React.JSX.Element {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const theme = useTheme();
    return (
        <>
            <Tooltip title="Editar devolución">
                <IconButton size="small" color="primary" onClick={handleOpen}>
                    <PencilSimple size={20} weight="bold" />
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setOpen(false);
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
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        NOTA: La funcionalidad de editar devoluciones está en desarrollo, por lo que no se puede utilizar en este momento.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setOpen(false)} variant="contained" color="primary">
                            Entendido!
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}