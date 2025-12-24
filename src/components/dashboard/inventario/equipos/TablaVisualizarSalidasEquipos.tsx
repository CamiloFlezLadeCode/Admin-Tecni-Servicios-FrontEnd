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
import { VerTodasLasSalidasDeEquipos } from '@/services/inventario/equipos/VerTodasLasSalidasDeEquiposService';
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
  const [data, setData] = React.useState<SalidaDeEquiposLista[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [noSalidaParaVisualizar, setNoSalidaParaVisualizar] = React.useState<number | null>(null);

  const {
    mostrarAlertas,
    mensajeAlerta,
    tipoAlerta,
    mostrarMensaje,
    ocultarAlerta
  } = useAlertas();
  const { messages } = useSocketIO();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await VerTodasLasSalidasDeEquipos();
        setData(response);
      } catch (err) {
        setError(`Error al cargar las salidas de los equipos: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      render: (row: SalidaDeEquiposLista) => (
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

  const actions: ActionDefinition<SalidaDeEquiposLista>[] = [
    {
      render: (row: SalidaDeEquiposLista) => (
        <IconButton size="small" onClick={() => abrirModalVisualizacion(row)} color="primary">
          <Eye size={20} />
        </IconButton>
      ),
      tooltip: 'Ver detalles'
    }
  ];

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchTerm('');
      const response = await VerTodasLasSalidasDeEquipos();
      setData(response);
    } catch (err) {
      setError(`Error al actualizar: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimo = messages[messages.length - 1];
      if (ultimo.tipo === 'salida-equipos-creada') {
        handleRefresh();
      }
    }
  }, [messages]);

  return (
    <>
      <Card>
        <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>
          Visualización de salidas de equipos
        </Typography>
        <Divider />
        <CardContent>
          <ModalRegistrarVisualizarSalidaEquipos
            modo="crear"
            onMostrarMensaje={mostrarMensaje}
          />

          {noSalidaParaVisualizar && (
            <ModalRegistrarVisualizarSalidaEquipos
              modo="visualizar"
              noSalidaEquipos={noSalidaParaVisualizar}
              onClose={cerrarModalVisualizacion}
              onMostrarMensaje={mostrarMensaje}
            />
          )}

          <DataTable<SalidaDeEquiposLista>
            data={data}
            columns={columns}
            actions={actions}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
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
