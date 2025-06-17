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