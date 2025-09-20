'use client';

import * as React from 'react';
import {
    Backdrop,
    CircularProgress,
    Typography,
    Box,
    Paper
} from '@mui/material'

// interface 

// export default function MensajeDeCarga({ Mensaje, MostrarMensaje }: { Mensaje: string; MostrarMensaje: boolean; }): React.JSX.Element {
//     return (
//         <Backdrop
//             sx={{
//                 backgroundColor: 'rgba(255, 255, 255, .8)',
//                 zIndex: (theme) => theme.zIndex.drawer + 1,
//                 alignItems: 'start',
//                 mt: 10
//             }}
//             open={MostrarMensaje}
//         >
//             <Box
//                 display="flex"
//                 flexDirection="column"
//                 justifyContent="center"
//                 alignItems="center"
//             >
//                 {/* <Paper
//                     elevation={3}
//                     sx={{
//                         p: 3,
//                         backgroundColor: '#fff',
//                         borderRadius: 2,
//                         boxShadow: 3,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         gap: 2,
//                     }}
//                 >
//                     <Typography color="primary" fontWeight="bold">
//                         {Mensaje}...
//                     </Typography>
//                     <CircularProgress color="primary" />
//                 </Paper> */}
//                 <Paper
//                     elevation={3}
//                     sx={{
//                         width: 320,
//                         minHeight: 160,
//                         px: 4,
//                         py: 3,
//                         backgroundColor: '#fff',
//                         borderRadius: 2,
//                         boxShadow: 3,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: 2,
//                     }}
//                 >
//                     <Typography
//                         color="primary"
//                         fontWeight="bold"
//                         textAlign="center"
//                         variant="body1"
//                     >
//                         {Mensaje}...
//                     </Typography>
//                     <CircularProgress color="primary" />
//                 </Paper>

//             </Box>
//         </Backdrop>
//     )
// };


export default function MensajeDeCarga({ Mensaje, MostrarMensaje }: { Mensaje: string; MostrarMensaje: boolean; }): React.JSX.Element {
    // Detectar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    return (
        <Backdrop
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)', // Más opaco para mejor contraste
                zIndex: 999999, // Z-INDEX EXTREMADAMENTE ALTO
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                mt: 10,
                // Forzar sobreposición absoluta
                isolation: 'isolate', // Crea nuevo contexto de apilamiento
                // Estilos específicos para iOS
                ...(isIOS && {
                    height: '100vh',
                    WebkitOverflowScrolling: 'touch',
                    position: 'fixed',
                    zIndex: 999999,
                })
            }}
            open={MostrarMensaje}
        >
            <Paper
                elevation={24} // Elevación máxima
                sx={{
                    width: 320,
                    minHeight: 160,
                    px: 4,
                    py: 3,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: '0px 24px 48px rgba(0, 0, 0, 0.4) !important', // Sombra más intensa
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 5,
                    // Asegurar que esté por encima de TODO
                    position: 'relative',
                    zIndex: 1000000, // Aún más alto que el backdrop
                    // Prevenir transformaciones no deseadas en iOS
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    // Forzar sobre cualquier elemento
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1, // Para que el contenido esté arriba
                    }
                }}
            >
                <Typography
                    color="primary"
                    fontWeight="bold"
                    textAlign="center"
                    variant="body1"
                    sx={{
                        // Prevenir selección de texto en iOS
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        zIndex: 1000001, // Texto por encima de todo
                        position: 'relative'
                    }}
                >
                    {Mensaje}...
                </Typography>
                <CircularProgress 
                    color="primary" 
                    sx={{
                        zIndex: 1000001, // Spinner por encima de todo
                        position: 'relative'
                    }}
                />
            </Paper>
        </Backdrop>
    )
};