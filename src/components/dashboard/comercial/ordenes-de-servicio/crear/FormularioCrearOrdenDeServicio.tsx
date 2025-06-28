'use client';

import * as React from 'React';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '../../../componentes_generales/formulario/Select';
import {
    Card,
    Box,
    Typography,
    Divider,
    CardContent,
    CardActions,
    Button
} from '@mui/material'

// 1. Interfaces

// 2. Compornente principal
export function FormularioCrearOrdenDeServicio(): React.JSX.Element {
    // 3. Hooks de React y otros hooks de librerías

    // 4. Estados

    return (
        <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                <Typography variant="subtitle1" color="text.primary">
                    Creación de órden de servicio
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" width="140px" mb={.5} mt={.5}>
                    <Input
                        label='Remisión No:'
                        // value={datos.NoRemision}
                        value="Hola"
                        onChange={() => { }}
                        // required
                        tamano='small'
                        tipo_input='text'
                        valorname='NoRemision'
                    />
                </Typography>
            </Box>
            <Divider />
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>

            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => { }}>
                    Crear orden
                </Button>
            </CardActions>
        </Card>
    )
}