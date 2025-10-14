'use client';
import {
    Card,
    Typography,
    Divider,
    CardContent,
    CardActions,
    Button
} from '@mui/material';
import * as React from 'react';

export function TablaVisualizarEntradasEquipos(): React.JSX.Element {
    return (
        <>
            <Card>
                <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de entradas de equipos</Typography>
                <Divider />
                <CardContent>
                    <Button variant='contained'>+ Nueva Entrada</Button>
                </CardContent>
            </Card>
        </>
    );
}