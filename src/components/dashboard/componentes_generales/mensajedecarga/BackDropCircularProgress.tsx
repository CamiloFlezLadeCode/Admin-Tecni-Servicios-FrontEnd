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

export default function MensajeDeCarga({ Mensaje, MostrarMensaje }: { Mensaje: string; MostrarMensaje: boolean; }): React.JSX.Element {
    return (
        <Backdrop
            sx={{
                backgroundColor: 'rgba(255, 255, 255, .8)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                alignItems: 'start',
                mt: 10
            }}
            open={MostrarMensaje}
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                {/* <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography color="primary" fontWeight="bold">
                        {Mensaje}...
                    </Typography>
                    <CircularProgress color="primary" />
                </Paper> */}
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
                    }}
                >
                    <Typography
                        color="primary"
                        fontWeight="bold"
                        textAlign="center"
                        variant="body1"
                    >
                        {Mensaje}...
                    </Typography>
                    <CircularProgress color="primary" />
                </Paper>

            </Box>
        </Backdrop>
    )
};


// export default function MensajeDeCarga({ Mensaje, MostrarMensaje }: { Mensaje: string; MostrarMensaje: boolean; }): React.JSX.Element | null {
//     if (!MostrarMensaje) return null; // Cambia false por null

//     return (
//         <Box
//             sx={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 width: '100vw',
//                 height: '100vh',
//                 backgroundColor: 'rgba(255, 255, 255, 0.97)',
//                 zIndex: 2147483647,
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'flex-start',
//                 pt: '80px',
//                 isolation: 'isolate',
//                 WebkitTransform: 'translateZ(0)',
//                 transform: 'translateZ(0)',
//             }}
//         >
//             <Paper
//                 sx={{
//                     width: 320,
//                     minHeight: 160,
//                     px: 4,
//                     py: 3,
//                     backgroundColor: '#fff',
//                     borderRadius: 2,
//                     boxShadow: '0px 24px 48px rgba(0, 0, 0, 0.5) !important',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: 2,
//                     zIndex: 2147483647,
//                     position: 'relative',
//                     border: '2px solid',
//                     borderColor: 'primary.main',
//                 }}
//             >
//                 <Typography
//                     color="primary"
//                     fontWeight="bold"
//                     textAlign="center"
//                     variant="body1"
//                     sx={{
//                         WebkitUserSelect: 'none',
//                         userSelect: 'none',
//                         fontWeight: 'bold !important',
//                     }}
//                 >
//                     {Mensaje}...
//                 </Typography>
//                 <CircularProgress color="primary" />
//             </Paper>
//         </Box>
//     )
// };