'use client';

import * as React from 'react';
import {
    IconButton
} from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr';
export function EditarRemision(): React.JSX.Element {
    return (
        <IconButton
            size="small"
            color="primary"
            onClick={() => { }}
        >
            <PencilSimple size={20} weight="bold" />
        </IconButton>
    )
};