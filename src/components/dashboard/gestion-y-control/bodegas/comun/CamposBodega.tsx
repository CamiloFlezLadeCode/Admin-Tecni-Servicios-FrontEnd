'use client';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import { FormControl, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';

export interface ValoresBodega {
    TipoDeBodega: string;
    NombreDeBodega: string;
    Descripcion?: string;
    Estado: string | number;
}

interface Opcion {
    value: string | number;
    label: string;
}

/** Deja solo los estados "activo" e "inactivo" y antepone la opción vacía. */
export function filtrarEstadosBodega<T extends { label: string }>(estados: T[], opcionInicial: T): T[] {
    const permitidos = new Set(['activo', 'inactivo']);
    const filtrados = estados.filter((item) => permitidos.has(item.label.toLowerCase().trim()));
    filtrados.unshift(opcionInicial);
    return filtrados;
}

function MensajeError({ mensaje }: { readonly mensaje?: string }): React.JSX.Element | null {
    if (!mensaje) return null;
    return (
        <FormHelperText error sx={{ width: '100%', margin: 0 }}>
            {mensaje}
        </FormHelperText>
    );
}

interface CamposBodegaProps {
    readonly control: Control<any>;
    readonly errors: FieldErrors<ValoresBodega>;
    readonly tiposDeBodegas: Opcion[];
    readonly estados: Opcion[];
    /** En edición el estado se maneja como texto; en creación, tal como llega del select. */
    readonly estadoComoTexto?: boolean;
    readonly onCambioTipo?: (valor: string) => void;
}

/** Tipo, nombre, descripción y estado: los campos comunes de crear y editar bodega. */
export function CamposBodega({ control, errors, tiposDeBodegas, estados, estadoComoTexto = false, onCambioTipo }: CamposBodegaProps): React.JSX.Element {
    return (
        <>
            <Grid md={3} xs={12} mt={0.5}>
                <Controller
                    name="TipoDeBodega"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputSelect
                                label='Tipo de bodega'
                                value={String(field.value)}
                                options={tiposDeBodegas}
                                size='small'
                                onChange={(e) => {
                                    field.onChange(String(e.target.value));
                                    onCambioTipo?.(String(e.target.value));
                                }}
                            />
                            <MensajeError mensaje={errors.TipoDeBodega?.message} />
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid md={3} xs={12} mt={0.5}>
                <Controller
                    name="NombreDeBodega"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <Input
                                label='Nombre de bodega'
                                value={field.value}
                                tamano='small'
                                tipo_input='text'
                                valorname='NombreDeBodega'
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                            <MensajeError mensaje={errors.NombreDeBodega?.message} />
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid md={3} xs={12} mt={0.5}>
                <Controller
                    name="Descripcion"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <Input
                                label='Descripción'
                                value={field.value ?? ''}
                                tamano='small'
                                tipo_input='text'
                                valorname='Descripcion'
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid md={3} xs={12} mt={0.5}>
                <Controller
                    name="Estado"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputSelect
                                label='Estado'
                                value={estadoComoTexto ? String(field.value) : field.value}
                                options={estados}
                                size='small'
                                onChange={(e) => field.onChange(estadoComoTexto ? String(e.target.value) : e.target.value)}
                            />
                            <MensajeError mensaje={errors.Estado?.message} />
                        </FormControl>
                    )}
                />
            </Grid>
        </>
    );
}
