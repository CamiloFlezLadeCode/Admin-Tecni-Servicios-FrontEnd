'use client';

import * as React from 'react';
import {
    IconButton
} from '@mui/material';
import { Trash } from '@phosphor-icons/react';

export function EliminarRemision(): React.JSX.Element {
    return (
        <IconButton
            size="small"
            color="error"
            onClick={() => { }}
        >
            <Trash size={20} weight="bold" />
        </IconButton>
    )
};