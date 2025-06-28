'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
// import { Users } from '@phosphor-icons/react/dist/ssr/Users';
// import { Wrench } from '@phosphor-icons/react/dist/ssr/Wrench';
// import { CraneTower } from '@phosphor-icons/react/dist/ssr/CraneTower';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import Card from '@mui/material/Card';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { paths } from '@/paths';


const ItemsNavDevoluciones = [
    {
        label: 'Ver devoluciones',
        path: paths.dashboard.comercialdevolucionesver,
        icon: Eye
    },
    {
        label: 'Crear devolución',
        path: paths.dashboard.comercialdevolucionescrear,
        icon: Plus
    }
]
export function NavDevoluciones(): React.JSX.Element {
    const pathname = usePathname();

    return (
        <Card style={{height: '40px'}}>
            <Box
                component="header"
                sx={{
                    borderBottom: '1px solid var(--mui-palette-divider)',
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    position: 'sticky',
                    top: 0,
                    // zIndex: 'var(--mui-zIndex-appBar)',
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    // sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
                    sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2 }}
                >
                    <Stack direction="row" spacing={2}>
                        {ItemsNavDevoluciones.map(({ path, label, icon: Icon }) => {
                            const isActive = pathname.startsWith(path); // usamos startsWith para subrutas también

                            return (
                                <Tooltip key={path} title={label}>
                                    <Box
                                        component={RouterLink}
                                        href={path}
                                        sx={{
                                            display: 'flex',
                                            borderRadius: 1,
                                            textDecoration: 'none',
                                            ...(isActive && {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                            }),
                                        }}
                                    >
                                        <IconButton sx={{ color: isActive ? 'primary.contrastText' : 'inherit' }}>
                                            <Icon />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Stack>
                </Stack>
            </Box>
        </Card>
    );
}