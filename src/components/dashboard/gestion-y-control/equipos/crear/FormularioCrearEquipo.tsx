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


const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]

const Caracteristica = [
    { value: '1', label: 'Alquiler' },
    { value: '2', label: 'Venta' },
    { value: '2', label: 'Reparación' },
]


export function FormularioCrearEquipo(): React.JSX.Element {
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

    const CrearEquipo = () => {
        setMostrarAlerta(true);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
    };


    return (
        <Card>
            <CardHeader
                title="Creación de equipo"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid md={6} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Nombre</InputLabel>
                            <OutlinedInput defaultValue="Constructions" label="Nombre" name="Nombre" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Referencia</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Referencia" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Costo</InputLabel>
                            <OutlinedInput defaultValue="80000" label="Costo" name="lastName" type="number" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth>
                            <InputLabel>Característica</InputLabel>
                            <Select defaultValue="Activo" label="Característica" name="state" variant="outlined" size="small">
                                {Caracteristica.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth required>
                            <InputLabel>Costo</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Costo" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                </Grid>
                {/* {mostrarAlerta && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Este es un mensaje de error!
                    </Alert>
                )} */}
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={CrearEquipo}>
                    Crear equipo
                </Button>
            </CardActions>

            {/* Snackbar con alerta */}
            <Snackbar
                open={mostrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                onClose={() => setMostrarAlerta(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }} onClose={() => setMostrarAlerta(false)}>
                    Equipo creado exitosamente
                </Alert>
            </Snackbar>
        </Card>
    );
}