'use client';

import {
    Box,
    CircularProgress,
    Typography
} from '@mui/material';

export function Loader() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress color="primary" />
        </Box>
    );
};

export function ErrorDisplay({ message }: { message: string }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="error">{message}</Typography>
        </Box>
    );
};
