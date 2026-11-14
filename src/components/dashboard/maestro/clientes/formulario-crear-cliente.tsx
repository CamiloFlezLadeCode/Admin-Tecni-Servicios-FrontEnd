'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import { FormularioMaqueta } from '@/components/dashboard/maestro/clientes/campos-contacto-maqueta';

export function FormularioCrearCliente(): React.JSX.Element {
    return (
        <FormularioMaqueta
            encabezado={<CardHeader title="Creación de cliente" />}
            primeros={['Nit']}
            textoBoton="Crear cliente"
            mensajeExito="Cliente creado exitosamente"
        />
    );
}
