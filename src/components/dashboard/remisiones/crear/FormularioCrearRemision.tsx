'use client'; // Esto dice que este archivo se renderiza en el lado del cliente

import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import { FormularioMaqueta } from '@/components/dashboard/maestro/clientes/campos-contacto-maqueta';

export function FormularioCrearRemision(): React.JSX.Element {
    return (
        <FormularioMaqueta
            encabezado={
                <CardHeader
                    title="Creación de mecánico" size="small"
                    sx={{
                        fontSize: '0.875rem', // Tamaño de fuente más pequeño
                        padding: '8px', // Espaciado interno más pequeño
                    }}
                />
            }
            primeros={['Documento']}
            textoBoton="Crear remisión"
            mensajeExito="Remisión creada exitosamente"
        />
    );
}
