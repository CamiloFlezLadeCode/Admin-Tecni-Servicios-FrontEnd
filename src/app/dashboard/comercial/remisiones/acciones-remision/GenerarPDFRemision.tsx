'use client';

import * as React from 'react';
import {
    FilePdf
} from '@phosphor-icons/react/dist/ssr';
import {
    IconButton
} from '@mui/material';

export function GenerarPDFRemision(): React.JSX.Element {
    const manejarImpresion = () => {
        window.print(); // Abre el diálogo de impresión del navegador
    };
    return (
        <IconButton
            size="small"
            color="default"
            onClick={manejarImpresion}
        >
            <FilePdf size={20} weight="bold" />
        </IconButton>
    )
};