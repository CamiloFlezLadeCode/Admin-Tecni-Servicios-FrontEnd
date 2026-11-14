'use client';
import dayjs from 'dayjs';
import * as React from 'react';

import { ListarEquiposPropios } from '@/services/inventario/equipos/ListarEquiposPropiosService';
import { ConsultarSiguienteNoSalidaEquipos } from '@/services/inventario/equipos/ConsultarSiguienteNoSalidaEquiposService';
import { GuardarSalidaEquipos } from '@/services/inventario/equipos/GuardarSalidaEquiposService';
import { ListarTiposMovimientoEquipo } from '@/services/inventario/equipos/ListarTiposMovimientoEquipoService';
import { VisualizarSalidaEquipos } from '@/services/inventario/equipos/VisualizarSalidaEquiposService';
import { ConsultarEquipoPorId } from '@/services/gestionycontrol/equipos/ConsultarEquipoPorIdService';
import { ModalSalidaInventario, type ConfigSalidaInventario } from '@/components/dashboard/inventario/comun/ModalSalidaInventario';

const CONFIG: ConfigSalidaInventario = {
  plural: 'equipos',
  singular: 'Equipo',
  campoNumero: 'NoSalidaEquipos',
  campoLista: 'Equipos',
  campoId: 'IdEquipo',
  campoIdAlterno: 'EquipoId',
  campoCodigo: 'CodigoEquipo',
  campoNombre: 'NombreEquipo',
  campoSiguiente: 'SiguienteNoSalidaEquipo',
  evento: 'salida-equipos-creada',
  textoGuardar: 'Guardar Salida',
  servicios: {
    siguiente: ConsultarSiguienteNoSalidaEquipos,
    guardar: GuardarSalidaEquipos,
    visualizar: VisualizarSalidaEquipos,
    listarElementos: ListarEquiposPropios,
    listarTipos: ListarTiposMovimientoEquipo,
    consultarPorId: ConsultarEquipoPorId,
  },
  // El backend la envía como texto '%d/%m/%Y %r' (mismo ajuste que remisiones y devoluciones).
  leerFecha: (resp) => (resp?.FechaSalida ? dayjs(String(resp.FechaSalida), 'DD/MM/YYYY hh:mm A') : dayjs()),
};

interface ModalRegistrarVisualizarSalidaEquiposProps {
  modo?: 'crear' | 'visualizar';
  noSalidaEquipos?: number;
  onClose?: () => void;
  readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
  // El socket lo abre la tabla y lo comparte: si cada modal llamara a useSocketIO
  // abriría su propia conexión al montarse (igual que en entradas de equipos).
  readonly sendMessage?: (event: string, payload: any) => void;
  readonly mensajesSocket?: any[];
}

export function ModalRegistrarVisualizarSalidaEquipos({ noSalidaEquipos, ...props }: Readonly<ModalRegistrarVisualizarSalidaEquiposProps>): React.JSX.Element {
  return <ModalSalidaInventario config={CONFIG} numero={noSalidaEquipos} {...props} />;
}
