'use client';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import SelectMultiple from '@/components/dashboard/componentes_generales/formulario/SelectMultiple';

type Opcion = { value: string | number; label: string };

/** Un campo de un formulario de datos (texto, select o selección múltiple). */
export interface DefinicionCampo {
    readonly nombre: string;
    readonly etiqueta: string;
    /** Columnas que ocupa en pantallas medianas (en móvil siempre 12). */
    readonly md: number;
    readonly tipo?: 'texto' | 'select' | 'multiple';
    readonly opciones?: Opcion[];
    readonly maximalongitud?: number;
    readonly bloqueado?: boolean;
    /** Oculta el campo sin desmontarlo (p. ej. "Contacto" solo para clientes). */
    readonly mostrar?: 'none' | 'block';
}

interface CamposFormularioProps {
    readonly campos: DefinicionCampo[];
    readonly datos: Record<string, any>;
    readonly onChange: (e: any) => void;
}

/** Rejilla de campos de un formulario a partir de su definición. */
export function CamposFormulario({ campos, datos, onChange }: CamposFormularioProps): React.JSX.Element {
    return (
        <Grid container spacing={1}>
            {campos.map((campo) => (
                <Grid key={campo.nombre} md={campo.md} xs={12} mt={0.5} sx={campo.mostrar ? { display: campo.mostrar } : undefined}>
                    {renderCampo(campo, datos[campo.nombre], onChange)}
                </Grid>
            ))}
        </Grid>
    );
}

function renderCampo(campo: DefinicionCampo, valor: any, onChange: (e: any) => void): React.ReactNode {
    if (campo.tipo === 'select') {
        return (
            <InputSelect
                label={campo.etiqueta}
                value={valor}
                options={campo.opciones ?? []}
                size='small'
                onChange={onChange}
                valorname={campo.nombre}
                bloqueado={campo.bloqueado}
            />
        );
    }
    if (campo.tipo === 'multiple') {
        return <SelectMultiple label={campo.etiqueta} options={campo.opciones ?? []} value={valor} onChange={onChange} valorname={campo.nombre} />;
    }
    return (
        <Input
            label={campo.etiqueta}
            value={valor}
            onChange={onChange}
            tamano='small'
            tipo_input='text'
            valorname={campo.nombre}
            maximalongitud={campo.maximalongitud}
            bloqueado={campo.bloqueado}
            mostrar={campo.mostrar}
        />
    );
}
