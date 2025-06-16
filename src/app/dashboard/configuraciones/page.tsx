// import * as React from 'react';
// // import Typography from '@mui/material/Typography';
// import {
//     Paper,
//     Typography,
//     Box,
//     Stack
// } from '@mui/material';
// import type { Metadata } from 'next';
// import { config } from '@/config';
// import { FormularioCrearUsuarios } from '@/components/dashboard/configuraciones/FormularioCrearUsuarios';
// import Grid from '@mui/material/Unstable_Grid2';
// import { redirect, useRouter } from 'next/navigation';
// import { cookies } from 'next/headers';


// export const metadata = { title: `Configuraciones | ${config.site.name}` } satisfies Metadata;
// export default function Page(): React.JSX.Element {
//     // // Se declara navegación de nextjs
//     // const router = useRouter();
//     // // ...

//     const cookieStore = cookies();
//     const rol = cookieStore.get('custom-auth-rol')?.value;

//     if (rol !== 'Administrador') {
//         redirect('/errors/unauthorized'); //Para el lado del back/servidor
//         // router.push('/errors/unauthorized'); //Para el lado del cliente 'use client';
//     };

//     return (
//         <Stack spacing={2}>
//             <div>
//                 <Box mb={1}>
//                     <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f5f5f5', borderLeft: '6px solid #1976d2' }}>
//                         <Typography variant="subtitle1" fontWeight="bold" color="primary">
//                             Panel administrativo / Configuraciones de alto nivel
//                         </Typography>
//                     </Paper>
//                 </Box>
//             </div>
//             <Grid container spacing={2}>
//                 <Grid lg={6} md={6} xs={12}>
//                     <FormularioCrearUsuarios />
//                 </Grid>
//             </Grid>
//         </Stack>
//     );
// };


import * as React from 'react';
import {
    Paper,
    Typography,
    Box,
    Stack
} from '@mui/material';
import type { Metadata } from 'next';
import { config } from '@/config';
import { FormularioCrearUsuarios } from '@/components/dashboard/configuraciones/FormularioCrearUsuarios';
import Grid from '@mui/material/Unstable_Grid2';

export const metadata = { title: `Configuraciones | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return (
        <Stack spacing={2}>
            <div>
                <Box mb={1}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f5f5f5', borderLeft: '6px solid #1976d2' }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            Panel administrativo / Configuraciones de alto nivel
                        </Typography>
                    </Paper>
                </Box>
            </div>
            <Grid container spacing={2}>
                <Grid lg={6} md={6} xs={12}>
                    <FormularioCrearUsuarios />
                </Grid>
            </Grid>
        </Stack>
    );
}
