'use client';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import Card from '@mui/material/Card';
import type { SxProps, Theme } from '@mui/material/styles';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';


interface ParametrosProps {
    readonly label: string;
    readonly path: string;
    readonly icon: React.ElementType;
}

interface PropsNavBarLayout {
    readonly ItemsLayout: ParametrosProps[];
    /** Sin alto fijo de 40px: la tarjeta toma el alto de su contenido. */
    readonly altoAutomatico?: boolean;
    /** Marca activo solo la ruta exacta (por defecto también sus subrutas). */
    readonly rutaExacta?: boolean;
    /** Estilos extra del encabezado (algunas vistas antiguas usan otro z-index/posición). */
    readonly sxEncabezado?: Record<string, unknown>;
    /** Estilos extra de la fila de íconos. */
    readonly sxBarra?: Record<string, unknown>;
}

export function NavBarLayout({ ItemsLayout, altoAutomatico = false, rutaExacta = false, sxEncabezado, sxBarra }: PropsNavBarLayout): React.JSX.Element {
    const pathname = usePathname();

    return (
        <Card style={altoAutomatico ? undefined : { height: '40px' }}>
            <Box
                component="header"
                sx={{
                    borderBottom: '1px solid var(--mui-palette-divider)',
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    position: 'sticky',
                    top: 0,
                    ...sxEncabezado,
                } as SxProps<Theme>}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, ...sxBarra } as SxProps<Theme>}
                >
                    <Stack direction="row" spacing={2}>
                        {ItemsLayout.map(({ path, label, icon: Icon }) => {
                            const isActive = rutaExacta ? pathname === path : pathname.startsWith(path); // startsWith: subrutas también

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