'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
];

function CampoTexto({ etiqueta, mt }: { readonly etiqueta: string; readonly mt?: number }): React.JSX.Element {
    return (
        <Grid md={3} xs={12} mt={mt}>
            <FormControl fullWidth required>
                <InputLabel>{etiqueta}</InputLabel>
                <OutlinedInput defaultValue="Rivers" label={etiqueta} name="lastName" size="small" />
            </FormControl>
        </Grid>
    );
}

/**
 * Campos de maqueta (valores fijos, no se guardan) de los formularios antiguos
 * de cliente y remisión: Dirección, Teléfono, Celular, Estado, Correo y Fecha.
 * `primeros` son los campos de texto que van antes de Dirección.
 */
export function CamposContactoMaqueta({ primeros }: { readonly primeros: readonly string[] }): React.JSX.Element {
    return (
        <>
            {primeros.map((etiqueta) => (
                <CampoTexto key={etiqueta} etiqueta={etiqueta} />
            ))}
            <CampoTexto etiqueta="Dirección" />
            <CampoTexto etiqueta="Teléfono" mt={1} />
            <CampoTexto etiqueta="Celular" mt={1} />
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
            <CampoTexto etiqueta="Correo" mt={1} />
            <Grid md={3} xs={12} mt={1}>
                <FormControl fullWidth required>
                    <InputLabel shrink htmlFor="fecha">
                        Fecha
                    </InputLabel>
                    <OutlinedInput id="fecha" type="date" name="fecha" notched label="Fecha" size="small" />
                </FormControl>
            </Grid>
        </>
    );
}

interface FormularioMaquetaProps {
    /** Encabezado de la tarjeta (cada formulario tiene el suyo). */
    readonly encabezado: React.ReactNode;
    /** Campos de texto entre Nombre y Dirección. */
    readonly primeros: readonly string[];
    readonly textoBoton: string;
    readonly mensajeExito: string;
}

/**
 * Formulario de maqueta de los módulos antiguos: no envía nada, solo muestra
 * el aviso de éxito durante 3 segundos al pulsar el botón.
 */
export function FormularioMaqueta({ encabezado, primeros, textoBoton, mensajeExito }: FormularioMaquetaProps): React.JSX.Element {
    const [mostrarAlerta, setMostrarAlerta] = React.useState<boolean>(false);

    const handleCrear = () => {
        setMostrarAlerta(true);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
    };
    return (
        <Card>
            {encabezado}
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid md={6} xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Nombre</InputLabel>
                            <OutlinedInput defaultValue="Constructions" label="Nombre" name="Nombre" size="small" />
                        </FormControl>
                    </Grid>
                    <CamposContactoMaqueta primeros={primeros} />
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCrear}>
                    {textoBoton}
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
                    {mensajeExito}
                </Alert>
            </Snackbar>
        </Card>
    );
}
