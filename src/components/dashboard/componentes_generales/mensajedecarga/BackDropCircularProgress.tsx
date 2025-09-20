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
                backgroundColor: 'rgba(255, 255, 255, .8)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // Estilos específicos para iOS
                ...(isIOS && {
                    height: '100vh',
                    WebkitOverflowScrolling: 'touch'
                })
            }}
            open={MostrarMensaje}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 320,
                    minHeight: 160,
                    px: 4,
                    py: 3,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    // Prevenir transformaciones no deseadas en iOS
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)'
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
                        userSelect: 'none'
                    }}
                >
                    {Mensaje}...
                </Typography>
                <CircularProgress color="primary" />
            </Paper>
        </Backdrop>
    )
};