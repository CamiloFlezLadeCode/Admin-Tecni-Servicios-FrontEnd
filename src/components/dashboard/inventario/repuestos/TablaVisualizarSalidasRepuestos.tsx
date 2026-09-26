'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ActionDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import { Eye } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
import { VerTodasLasSalidasDeRepuestosPaginado } from '@/services/inventario/repuestos/VerTodasLasSalidasDeRepuestosService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
import { ModalRegistrarVisualizarSalidaRepuestos } from './ModalRegistrarVisualizarSalidaRepuestos';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface SalidaDeRepuestosLista {
  NoSalidaRepuestos: number;
  FechaSalida: string;
  Responsable: string;
  NombreResponsable: string;
  Observaciones: string;
  UsuarioCreacion: string;
  CreadoPor: string;
  FechaCreacion: string;
  TipoMovimiento?: string | number;
}

export function TablaVisualizarSalidasRepuestos(): React.JSX.Element {
  // Paginado, búsqueda y recargas contra el servidor
  const tabla = usePaginacionServidor<SalidaDeRepuestosLista>({
      consultar: VerTodasLasSalidasDeRepuestosPaginado,
      mensajeError: (error) => `Error al cargar las salidas de repuestos: ${error}`,
  });
  const [noSalidaParaVisualizar, setNoSalidaParaVisualizar] = React.useState<number | null>(null);

  const {
    mostrarAlertas,
    mensajeAlerta,
    tipoAlerta,
    mostrarMensaje,
    ocultarAlerta
  } = useAlertas();
  const { messages } = useSocketIO();


  const abrirModalVisualizacion = (salida: SalidaDeRepuestosLista) => {
    setNoSalidaParaVisualizar(salida.NoSalidaRepuestos);
  };

  const cerrarModalVisualizacion = () => {
    setNoSalidaParaVisualizar(null);
  };

  const columns = [
    { key: 'NoSalidaRepuestos', header: 'NoSalida' },
    { key: 'FechaSalida', header: 'Fecha Salida' },
    { key: 'NombreResponsable', header: 'Responsable' },
    { key: 'TipoMovimiento', header: 'Tipo movimiento' },
    {
      key: 'Observaciones',
      header: 'Observaciones',
      render: (row: SalidaDeRepuestosLista) => (
        <Typography
          variant="body2"
          sx={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={row.Observaciones}
        >
          {row.Observaciones || 'Sin observaciones'}
        </Typography>
      )
    },
    { key: 'CreadoPor', header: 'Creado Por' },
    { key: 'FechaCreacion', header: 'Fecha Creación' }
  ];

  const actions: ActionDefinition<SalidaDeRepuestosLista>[] = [
    {
      render: (row: SalidaDeRepuestosLista) => (
        <IconButton size="small" onClick={() => abrirModalVisualizacion(row)} color="secondary">
          <Eye size={20} weight='bold' />
        </IconButton>
      ),
      tooltip: 'Ver detalles'
    }
  ];


  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimo = messages[messages.length - 1];
      if (ultimo.tipo === 'salida-repuestos-creada') {
        tabla.recargar();
      }
    }
  }, [messages]);

  return (
    <>
      <Card>
        <Typography variant='subtitle1' sx={{ p: '5px', fontWeight: 'normal' }}>
          Visualización de salidas de repuestos
        </Typography>
        <Divider />
        <CardContent>
          <ModalRegistrarVisualizarSalidaRepuestos
            modo="crear"
            onMostrarMensaje={mostrarMensaje}
          />

          {noSalidaParaVisualizar && (
            <ModalRegistrarVisualizarSalidaRepuestos
              modo="visualizar"
              noSalidaRepuestos={noSalidaParaVisualizar}
              onClose={cerrarModalVisualizacion}
              onMostrarMensaje={mostrarMensaje}
            />
          )}

          <DataTable<SalidaDeRepuestosLista>
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
            rowKey={(row) => row.NoSalidaRepuestos}
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