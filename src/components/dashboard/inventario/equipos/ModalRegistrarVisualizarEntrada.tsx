'use client';
import * as React from 'react';

import { SiguienteNoEntradaEquipos } from '@/services/inventario/equipos/ConsultarSiguienteNoEntradaEquiposService';
import { GuardarEntradaEquipos } from '@/services/inventario/equipos/GuardarEntradaEquiposService';
import { ListarEquiposPropios } from '@/services/inventario/equipos/ListarEquiposPropiosService';
import { VisualizarEntradaEquipos } from '@/services/inventario/equipos/VisualizarEntradaEquiposService';
import { ConsultarEquipoPorId } from '@/services/gestionycontrol/equipos/ConsultarEquipoPorIdService';
import { ModalEntradaInventario, type ConfigEntradaInventario } from '@/components/dashboard/inventario/comun/ModalEntradaInventario';
import { opcionesDeElementos } from '@/components/dashboard/inventario/comun/utilidades-movimiento';

const CONFIG: ConfigEntradaInventario = {
    plural: 'equipos',
    singular: 'Equipo',
    campoNumero: 'NoEntradaEquipos',
    campoLista: 'Equipos',
    campoId: 'IdEquipo',
    campoSiguiente: 'SiguienteNoEntradaEquipo',
    evento: 'entrada-equipos-creada',
    textoGuardar: 'Guardar Entrada',
    mensajeExito: 'Entrada de equipos creada correctamente',
    mensajeErrorGuardar: 'Hubo un error al crear la entrada de los equipos.',
    mensajeErrorSiguiente: 'equipo',
    servicios: {
        siguiente: SiguienteNoEntradaEquipos,
        guardar: GuardarEntradaEquipos,
        visualizar: VisualizarEntradaEquipos,
        listarElementos: ListarEquiposPropios,
        consultarPorId: ConsultarEquipoPorId,
    },
    construirOpciones: (listado) => opcionesDeElementos(listado, { campoId: 'IdEquipo', campoCodigo: 'CodigoEquipo', campoNombre: 'NombreEquipo', prefijo: 'Equipo' }),
    // Solo se reciben equipos nuevos o usados.
    filtrarEstados: true,
    leerVisualizacion: (respuesta) => ({ existe: respuesta[0], datos: respuesta[0] }),
    // El backend la envía como texto '%d/%m/%Y %r' (mismo ajuste que remisiones y devoluciones).
    formatoFecha: 'DD/MM/YYYY hh:mm A',
};

interface ModalRegistrarEntradaEquipoProps {
    modo?: 'crear' | 'visualizar';
    noEntradaEquipos?: number;
    onClose?: () => void;
    readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
    readonly sendMessage?: (event: string, payload: any) => void;
    readonly mensajesSocket?: any[];
}

export function ModalRegistrarEntradaEquipos({ noEntradaEquipos, ...props }: Readonly<ModalRegistrarEntradaEquipoProps>): React.JSX.Element {
    return <ModalEntradaInventario config={CONFIG} numero={noEntradaEquipos} {...props} />;
}
