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
import { TablaVisualizarBodegas } from '../../gestion-y-control/bodegas/ver/TablaVisualizarBodegas';

export function TablaVisualizarEntradasRepuestos(): React.JSX.Element {
    return (
        <>
            <Card>
                <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>Visualización de entradas de repuestos</Typography>
                <Divider />
                <CardContent>
                    <Button variant='contained'>+ Nueva Entrada</Button>
                </CardContent>
            </Card>
        </>
    );
}