'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ColumnDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { VerStockEquipos } from '@/services/inventario/equipos/VerStockEquiposService';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import * as React from 'react';
import { useSocketIO } from '@/hooks/use-WebSocket';

interface EquipoStock {
  IdEquipo: number;
  CodigoEquipo?: string;
  NombreEquipo?: string;
  Categoria?: string;
  Cantidad?: number; // Ajustado para mapear desde Cantidad
  UnidadMedida?: string;
  Estado?: string;
}

export function TablaVisualizarStockEquipos(): React.JSX.Element {
  const [data, setData] = React.useState<EquipoStock[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoriaFiltro, setCategoriaFiltro] = React.useState<string>('');
  const [soloBajoStock, setSoloBajoStock] = React.useState<boolean>(false);
  const { messages } = useSocketIO();

  const { mostrarAlertas, mensajeAlerta, tipoAlerta, mostrarMensaje, ocultarAlerta } = useAlertas();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await VerStockEquipos();
        // Mapeo explicito si la respuesta difiere de la interfaz
        const mapeado = (Array.isArray(response) ? response : []).map((item: any) => ({
            IdEquipo: item.IdEquipo,
            NombreEquipo: item.NombreEquipo,
            Cantidad: item.Cantidad,
            Estado: item.Estado,
            UnidadMedida: item.UnidadMedida
        }));
        setData(mapeado);
      } catch (err: any) {
        setError(`Error al cargar el stock de equipos: ${err?.message ?? err}`);
        mostrarMensaje(`No fue posible cargar el stock de equipos`, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchTerm('');
      const response = await VerStockEquipos();
       const mapeado = (Array.isArray(response) ? response : []).map((item: any) => ({
            IdEquipo: item.IdEquipo,
            NombreEquipo: item.NombreEquipo,
            Cantidad: item.Cantidad,
            Estado: item.Estado,
            UnidadMedida: item.UnidadMedida
        }));
      setData(mapeado);
    } catch (err: any) {
      setError(`Error al actualizar: ${err?.message ?? err}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimo = messages[messages.length - 1];
      if (ultimo.tipo === 'salida-equipos-creada' || ultimo.tipo === 'entrada-equipos-creada') {
        handleRefresh();
      }
    }
  }, [messages]);

  const categorias = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => { if (d.Categoria) set.add(String(d.Categoria)); });
    return Array.from(set).sort();
  }, [data]);

  const filtered = React.useMemo(() => {
    let rows = data;
    if (categoriaFiltro) rows = rows.filter((r) => String(r.Categoria) === categoriaFiltro);
    if (soloBajoStock) rows = rows.filter((r) => (r.Cantidad ?? 0) <= 5);
    return rows;
  }, [data, categoriaFiltro, soloBajoStock]);

  const columns: ColumnDefinition<EquipoStock>[] = [
    {
      key: 'NombreEquipo',
      header: 'Equipo',
    },
    {
      key: 'Cantidad',
      header: 'Disponible',
      align: 'center',
      width: 120,
      render: (row) => {
        const qty = row.Cantidad ?? 0;
        const color = qty <= 0 ? 'error' : qty <= 5 ? 'warning' : 'success';
        const label = qty <= 0 ? 'Agotado' : qty <= 5 ? 'Bajo' : 'OK';
        return (
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{qty}</Typography>
            <Chip size="small" color={color as any} label={label} />
          </Stack>
        );
      }
    },
    {
      key: 'Estado',
      header: 'Estado',
      width: 120,
      render: (row) => {
         // Usar el estado directo si existe, o calcular basado en cantidad
        const disponible = row.Estado === 'Disponible' || (row.Cantidad ?? 0) > 0;
        return <Chip size="small" color={disponible ? 'success' : 'default'} label={row.Estado || (disponible ? 'Disponible' : 'No disponible')} />;
      }
    }
  ];

  return (
    <>
      <Card>
        <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>
          Visualización de stock de equipos
        </Typography>
        <Divider />
        <CardContent>
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Chip
              label={soloBajoStock ? 'Solo bajo stock' : 'Todos los niveles'}
              color={soloBajoStock ? 'warning' : 'default'}
              onClick={() => setSoloBajoStock((s) => !s)}
              sx={{ cursor: 'pointer' }}
            />
          </Box>

          <DataTable<EquipoStock>
            data={filtered}
            columns={columns}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            emptyMessage="No se encontraron equipos"
            rowKey={(row) => row.IdEquipo}
            placeHolderBuscador='Buscar equipos...'
            vista={1}
            MarginTop={1}
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
