'use client';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import * as React from 'react';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import type { PropsAlerta } from '@/components/dashboard/componentes_generales/alertas/use-mensaje-alerta';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';

interface TarjetaFormularioProps {
    /** Título de la tarjeta (los formularios dentro de un modal no lo llevan). */
    readonly titulo?: string;
    readonly textoBoton: string;
    readonly onGuardar: () => void;
    /** Validación de campos obligatorios que se dispara antes de guardar. */
    readonly validacion: {
        readonly ref: React.Ref<any>;
        readonly datos: Record<string, any>;
        readonly reglas: { campo: string; mensaje: string }[];
        readonly onValid: () => void;
    };
    /** Alerta de éxito/error del formulario, si la maneja él mismo. */
    readonly alerta?: PropsAlerta;
    /** Contenido extra al pie (p. ej. progreso del envío). */
    readonly pie?: React.ReactNode;
    readonly children: React.ReactNode;
}

/** Tarjeta de formulario: título, campos, botón de guardar con su validación y alerta. */
export function TarjetaFormulario({ titulo, textoBoton, onGuardar, validacion, alerta, pie, children }: TarjetaFormularioProps): React.JSX.Element {
    return (
        <Card>
            {titulo && (
                <>
                    <Typography variant='subtitle1' sx={{ color: 'text.primary', padding: '5px', fontWeight: 'normal' }}>{titulo}</Typography>
                    <Divider />
                </>
            )}
            <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                {children}
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={onGuardar}>
                    {textoBoton}
                </Button>
                <FormularioValidator
                    ref={validacion.ref}
                    datos={validacion.datos}
                    reglasValidacion={validacion.reglas}
                    onValid={validacion.onValid}
                />
            </CardActions>
            {pie}
            {alerta && <MensajeAlerta {...alerta} />}
        </Card>
    );
}
