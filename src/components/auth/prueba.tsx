// components/UsuariosList.tsx
'use client';

import * as React from 'react';
import { Stack, Typography, Alert, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_URL_USUARIOS, API_URL_USUARIOS2 } from '../../../config';

interface Usuario {
    Id: number; // Ajusta según la estructura de tu usuario
    Nombres: string; // Ajusta según la estructura de tu usuario
    Apellidos: string; // Ajusta según la estructura de tu usuario
    TipoDocumento: number;
}

export function UsuariosList(): React.JSX.Element {
    const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(`${API_URL_USUARIOS}`);
                setUsuarios(response.data);
                // console.log(response.data);

                const respuesta2 = await axios.get(`${API_URL_USUARIOS2}`);
                console.log(respuesta2);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Lista de Usuarios</Typography>
            <List>
                {usuarios.map((usuario) => (
                    <ListItem key={usuario.Id}>
                        <ListItemText primary={usuario.Nombres} />
                        <ListItemText primary={usuario.Apellidos} />
                        <ListItemText primary={usuario.TipoDocumento} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
