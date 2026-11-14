'use client';
import { useRecargaPorEventos } from '@/hooks/use-recarga-por-eventos';
import { CeldaObservaciones, accionVerDetalles } from '../comun/columnas-inventario';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { VerTodasLasSalidasDeEquiposPaginado } from '@/services/inventario/equipos/VerTodasLasSalidasDeEquiposService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { ModalRegistrarVisualizarSalidaEquipos } from './ModalRegistrarVisualizarSalidaEquipos';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface SalidaDeEquiposLista {
  NoSalidaEquipos: number;
  FechaSalida: string;
  Responsable: string;
  NombreResponsable: string;
  Observaciones: string;
  UsuarioCreacion: string;
  CreadoPor: string;
  FechaCreacion: string;
  TipoMovimiento?: string | number;
}

export function TablaVisualizarSalidasEquipos(): React.JSX.Element {
  // Paginado, búsqueda y recargas contra el servidor
  const tabla = usePaginacionServidor<SalidaDeEquiposLista>({
      consultar: VerTodasLasSalidasDeEquiposPaginado,
      mensajeError: (error) => `Error al cargar las salidas de equipos: ${error}`,
  });
  const [noSalidaParaVisualizar, setNoSalidaParaVisualizar] = React.useState<number | null>(null);

  const {
    mostrarAlertas,
    mensajeAlerta,
    tipoAlerta,
    mostrarMensaje,
    ocultarAlerta
  } = useAlertas();
  const { sendMessage, messages } = useSocketIO();


  const abrirModalVisualizacion = (salida: SalidaDeEquiposLista) => {
    setNoSalidaParaVisualizar(salida.NoSalidaEquipos);
  };

  const cerrarModalVisualizacion = () => {
    setNoSalidaParaVisualizar(null);
  };

  const columns = [
    { key: 'NoSalidaEquipos', header: 'NoSalida' },
    { key: 'FechaSalida', header: 'Fecha Salida' },
    { key: 'NombreResponsable', header: 'Responsable' },
    { key: 'TipoMovimiento', header: 'Tipo movimiento' },
    {
      key: 'Observaciones',
      header: 'Observaciones',
      render: (row: SalidaDeEquiposLista) => <CeldaObservaciones texto={row.Observaciones} />
    },
    { key: 'CreadoPor', header: 'Creado Por' },
    { key: 'FechaCreacion', header: 'Fecha Creación' }
  ];

  const actions: ActionDefinition<SalidaDeEquiposLista>[] = [
    accionVerDetalles<SalidaDeEquiposLista>(abrirModalVisualizacion)
  ];


  useRecargaPorEventos(messages, ['salida-equipos-creada'], tabla.recargar);

  return (
    <>
      <Card>
        <Typography variant='subtitle1' sx={{ p: '5px', fontWeight: 'normal' }}>
          Visualización de salidas de equipos
        </Typography>
        <Divider />
        <CardContent>
          <ModalRegistrarVisualizarSalidaEquipos
            modo="crear"
            onMostrarMensaje={mostrarMensaje}
            sendMessage={sendMessage}
            mensajesSocket={messages}
          />

          {noSalidaParaVisualizar && (
            <ModalRegistrarVisualizarSalidaEquipos
              modo="visualizar"
              noSalidaEquipos={noSalidaParaVisualizar}
              onClose={cerrarModalVisualizacion}
              onMostrarMensaje={mostrarMensaje}
              sendMessage={sendMessage}
              mensajesSocket={messages}
            />
          )}

          <DataTable<SalidaDeEquiposLista>
            data={tabla.datos}
            columns={columns}
            actions={actions}
            loading={tabla.cargando}
            error={tabla.error}
            searchTerm={tabla.busqueda}
            onSearchChange={tabla.setBusqueda}
            paginacionServidor={tabla.paginacionTabla}
            onRefresh={tabla.refrescar}
            emptyMessage="No se encontraron salidas"
            rowKey={(row) => row.NoSalidaEquipos}
            placeHolderBuscador='Buscar salidas...'
            vista={1}
            MarginTop={2}
          />
        </CardContent>
      </Card>

      <MensajeAlerta
        open={mostrarAlertas}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
        onClose={ocultarAlerta}
      />
    </>
  );
}
