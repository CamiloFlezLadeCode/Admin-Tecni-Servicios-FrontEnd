'use client';
import * as React from 'react';
import {
    Printer
} from '@phosphor-icons/react';
import { IconButton } from '@mui/material';

export function VerGenerarPDFOrdenDeServicio(): React.JSX.Element {
    return (
        <IconButton size="small" color="default" onClick={() => { }}>
            <Printer size={20} weight="bold" />
        </IconButton>
    )
}