'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import Card from '@mui/material/Card';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { paths } from '@/paths';

const ItemsNavMovimientos = [
    {
        label: 'Ver movimientos generales',
        path: paths.dashboard.comercialmovimientogeneralesver,
        icon: Eye
    }
];

export function NavMovimientosGenerales(): React.JSX.Element {
    const pathname = usePathname();

    return (
        <Card style={{ height: '40px' }}>
            <Box
                component="header"
                sx={{
                    borderBottom: '1px solid var(--mui-palette-divider)',
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    position: 'sticky',
                    top: 0,
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2 }}
                >
                    <Stack direction="row" spacing={2}>
                        {ItemsNavMovimientos.map(({ path, label, icon: Icon }) => {
                            const isActive = pathname === path;

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
