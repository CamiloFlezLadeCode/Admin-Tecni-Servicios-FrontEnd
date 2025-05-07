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
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import InputSelect from '../../../componentes_generales/formulario/Select'

const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]



const Empresas = [
    { value: '1', label: 'Empresa/Cliente #1' },
    { value: '2', label: 'Empresa/Cliente #2' },
    { value: '3', label: 'Cinnamom Overdressed Ceere Software SAS' },
]

export function FormularioCrearRemision(): React.JSX.Element {
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);


    //Empresa
    const [Empresa, setEmpresa] = React.useState<string>('');
        //Empresa
        const handleChangeEmpresa = (event: SelectChangeEvent<string>) => {
            const newValue = event.target.value;
            setEmpresa(newValue);
        };

    // const handleCrearCliente = () => {
    //     setMostrarAlerta(true);
    // };

    const handleCrearCliente = () => {
        setMostrarAlerta(true);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
    };
    return (
        <Card style={{ height: '200vh' }}>
            <CardHeader
                title="Creación de remisión" size="small"
                sx={{
                    fontSize: '0.875rem', // Tamaño de fuente más pequeño
                    padding: '8px', // Espaciado interno más pequeño
                }}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid md={3} xs={12} mt={0.5}>
                        <InputSelect
                            label='Empresa'
                            value={Empresa}
                            options={Empresas}
                            size='small'
                            onChange={handleChangeEmpresa}
                        />
                    </Grid>
                    <Grid md={6} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Nombre</InputLabel>
                            <OutlinedInput defaultValue="Constructions" label="Nombre" name="Nombre" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Documento</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Documento" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Dirección</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Dirección" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth required>
                            <InputLabel>Teléfono</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Teléfono" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth required>
                            <InputLabel>Celular</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Celular" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select defaultValue="Activo" label="Estado" name="state" variant="outlined" size="small">
                                {EstadoCliente.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth required>
                            <InputLabel>Correo</InputLabel>
                            <OutlinedInput defaultValue="Rivers" label="Correo" name="lastName" size="small" />
                        </FormControl>
                    </Grid>
                    <Grid md={3} xs={12} mt={1}>
                        <FormControl fullWidth required>
                            <InputLabel shrink htmlFor="fecha">
                                Fecha
                            </InputLabel>
                            <OutlinedInput
                                id="fecha"
                                type="date"
                                name="fecha"
                                notched
                                label="Fecha"
                                size="small"
                            />
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
                <Button variant="contained" onClick={handleCrearCliente}>
                    Crear remisión
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
                    Remisión creada exitosamente
                </Alert>
            </Snackbar>
        </Card>
    );
}