'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar'; // Alertas Flotantes


import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
} from '@mui/material';

interface Client {
    id: number;
    name: string;
    email: string;
}

const data: Client[] = [
    { id: 1, name: 'Cliente 1', email: 'cliente1@example.com' },
    { id: 2, name: 'Cliente 2', email: 'cliente2@example.com' },
    { id: 3, name: 'Cliente 3', email: 'cliente3@example.com' },
    // Agrega más datos según sea necesario
];


export function TablaVisualizarHojasDeVidaEquipos(): React.JSX.Element {
    const [searchTerm, setSearchTerm] = React.useState<string>('');

    const filteredData = data.filter(item =>
        ( item.name.toLowerCase().includes(searchTerm.toLowerCase()) ) 
        || ( item.email.toLowerCase().includes(searchTerm.toLowerCase()) )
    );
    return (
        <Card>
            <CardHeader
                title="Visualización de hojas de vida de equipos"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
            <Paper style={{border: 'solid green'}}>
            <TextField
                variant="outlined"
                placeholder="Buscar hoja de vida..."
                onChange={e => setSearchTerm(e.target.value)}
                style={{ margin: '16px' }}
                size='small'
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
            </CardContent>
        </Card>
    )
}