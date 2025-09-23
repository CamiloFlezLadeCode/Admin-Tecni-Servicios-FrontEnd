'use client';
import React from 'react';

interface Eliminar {
    servicioEliminarRegistro: (id: number | string) => Promise<string>;
}

export function EliminarRegistro({ servicioEliminarRegistro }: Eliminar): React.JSX.Element {
    return (
        <></>
    )
}