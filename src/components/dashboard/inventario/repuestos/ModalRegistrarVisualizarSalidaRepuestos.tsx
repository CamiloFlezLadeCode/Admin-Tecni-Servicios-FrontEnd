'use client';
import dayjs from 'dayjs';
import * as React from 'react';

import { useSocketIO } from '@/hooks/use-WebSocket';
import { ListarRepuestos } from '@/services/inventario/repuestos/ListarRepuestosService';
import { ConsultarSiguienteNoSalidaRepuestos } from '@/services/inventario/repuestos/ConsultarSiguienteNoSalidaRepuestosService';
import { GuardarSalidaRepuestos } from '@/services/inventario/repuestos/GuardarSalidaRepuestosService';
import { ListarTiposMovimientoRepuesto } from '@/services/inventario/repuestos/ListarTiposMovimientoRepuestoService';
import { VisualizarSalidaRepuestos } from '@/services/inventario/repuestos/VisualizarSalidaRepuestosService';
import { ConsultarRepuestoPorId } from '@/services/gestionycontrol/repuestos/ConsultarRepuestoPorIdService';
import { ModalSalidaInventario, type ConfigSalidaInventario } from '@/components/dashboard/inventario/comun/ModalSalidaInventario';

const CONFIG: ConfigSalidaInventario = {
  plural: 'repuestos',
  singular: 'Repuesto',
  campoNumero: 'NoSalidaRepuestos',
  campoLista: 'Repuestos',
  campoId: 'IdRepuesto',
  campoIdAlterno: 'RepuestoId',
  campoCodigo: 'CodigoRepuesto',
  campoNombre: 'NombreRepuesto',
  campoSiguiente: 'SiguienteNoSalidaRepuestos',
  evento: 'salida-repuestos-creada',
  textoGuardar: 'Guardar salida',
  servicios: {
    siguiente: ConsultarSiguienteNoSalidaRepuestos,
    guardar: GuardarSalidaRepuestos,
    visualizar: VisualizarSalidaRepuestos,
    listarElementos: ListarRepuestos,
    listarTipos: ListarTiposMovimientoRepuesto,
    consultarPorId: ConsultarRepuestoPorId,
  },
  leerFecha: (resp) => dayjs(String(resp?.FechaSalida ?? resp?.fecha ?? resp?.Fecha ?? dayjs().format('YYYY-MM-DD HH:mm:ss'))),
  presentacionRepuestos: true,
};

interface ModalRegistrarVisualizarSalidaRepuestosProps {
  modo?: 'crear' | 'visualizar';
  noSalidaRepuestos?: number;
  onClose?: () => void;
  readonly onMostrarMensaje?: (mensaje: string, tipo: 'success' | 'error') => void;
}

export function ModalRegistrarVisualizarSalidaRepuestos({ noSalidaRepuestos, ...props }: Readonly<ModalRegistrarVisualizarSalidaRepuestosProps>): React.JSX.Element {
  // Esta salida abre su propio socket (la tabla no se lo comparte).
  const { sendMessage, messages } = useSocketIO();
  return <ModalSalidaInventario config={CONFIG} numero={noSalidaRepuestos} sendMessage={sendMessage} mensajesSocket={messages} {...props} />;
}
