'use client';
import * as React from 'react';

import { OpcionPorDefectoNumber } from '@/lib/constants/option-default';
import { ListarRepuestos } from '@/services/inventario/repuestos/ListarRepuestosService';
import { VisualizarEntradaRepuestos } from '@/services/inventario/repuestos/VisualizarEntradaRepuestosService';
import { ConsultarSiguienteNoEntradaRepuestos } from '@/services/inventario/repuestos/ConsultarSiguienteNoEntradaRepuestosService';
import { GuardarEntradaRepuestos } from '@/services/inventario/repuestos/GuardarEntradaRepuestosService';
import { ConsultarRepuestoPorId } from '@/services/gestionycontrol/repuestos/ConsultarRepuestoPorIdService';
import { ModalEntradaInventario, type ConfigEntradaInventario } from '@/components/dashboard/inventario/comun/ModalEntradaInventario';

const CONFIG: ConfigEntradaInventario = {
    plural: 'repuestos',
    singular: 'Repuesto',
    campoNumero: 'NoEntradaRepuestos',
    campoLista: 'Repuestos',
    campoId: 'IdRepuesto',
    campoSiguiente: 'SiguienteNoEntradaRepuestos',
    evento: 'entrada-repuestos-creada',
    textoGuardar: 'Guardar entrada',
    mensajeExito: 'Entrada de repuestos creada correctamente',
    mensajeErrorGuardar: 'Hubo un error al crear la entrada de repuestos.',
    mensajeErrorSiguiente: 'repuestos',
    servicios: {
        siguiente: ConsultarSiguienteNoEntradaRepuestos,
        guardar: GuardarEntradaRepuestos,
        visualizar: VisualizarEntradaRepuestos,
        listarElementos: ListarRepuestos,
        consultarPorId: ConsultarRepuestoPorId,
    },
    // El listado de repuestos ya llega como opciones { value, label }.
    construirOpciones: (listado) => {
        const unidades = new Map<number, number>();
        (Array.isArray(listado) ? listado : []).forEach((r: any) => {
            const id = r?.value ?? r?.IdRepuesto;
            const um = r?.IdUnidadMedida ?? r?.IdUnidadDeMedida;
            if (id && um) unidades.set(Number(id), Number(um));
        });
        return { opciones: [OpcionPorDefectoNumber, ...listado], unidades };
    },
    filtrarEstados: false,
    // Comportamiento heredado: verifica el primer elemento si llega un array, pero lee los campos de la respuesta.
    leerVisualizacion: (respuesta) => ({ existe: Array.isArray(respuesta) ? respuesta[0] : respuesta, datos: respuesta }),
    presentacionRepuestos: true,
};

interface ModalRegistrarVisualizarEntradaRepuestosProps {
    modo?: 'crear' | 'visualizar';
    noEntradaRepuestos?: number;
    onClose?: () => void;
    readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly sendMessage?: (event: string, payload: any) => void;
    readonly mensajesSocket?: any[];
}

export function ModalRegistrarVisualizarEntradaRepuestos({ noEntradaRepuestos, ...props }: Readonly<ModalRegistrarVisualizarEntradaRepuestosProps>): React.JSX.Element {
    return <ModalEntradaInventario config={CONFIG} numero={noEntradaRepuestos} {...props} />;
}
