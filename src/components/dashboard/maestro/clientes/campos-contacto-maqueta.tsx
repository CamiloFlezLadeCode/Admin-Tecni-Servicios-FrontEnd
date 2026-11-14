'use client';

import * as React from 'react';
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
