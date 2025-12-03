'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ColumnDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { VerStockRepuestos } from '@/services/inventario/repuestos/VerStockRepuestosService';
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

interface RepuestoStock {
  IdRepuesto: number;
  CodigoRepuesto?: string;
  NombreRepuesto?: string;
  Categoria?: string;
  CantidadDisponible?: number;
  UnidadMedida?: string;
  Estado?: string;
}

export function TablaVisualizarStockRepuestos(): React.JSX.Element {
  const [data, setData] = React.useState<RepuestoStock[]>([]);
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
        const response = await VerStockRepuestos();
        setData(Array.isArray(response) ? response : []);
      } catch (err: any) {
        setError(`Error al cargar el stock de repuestos: ${err?.message ?? err}`);
        mostrarMensaje(`No fue posible cargar el stock de repuestos`, 'error');
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
      const response = await VerStockRepuestos();
      setData(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(`Error al actualizar: ${err?.message ?? err}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (messages.length > 0) {
      console.log('messages', messages);
      const ultimo = messages[messages.length - 1];
      console.log('ultimo', ultimo);
      if (ultimo.tipo === 'salida-repuestos-creada' || ultimo.tipo === 'entrada-repuestos-creada') {
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
    if (soloBajoStock) rows = rows.filter((r) => (r.CantidadDisponible ?? 0) <= 5);
    return rows;
  }, [data, categoriaFiltro, soloBajoStock]);

  const columns: ColumnDefinition<RepuestoStock>[] = [
    // { key: 'CodigoRepuesto', header: 'Código', width: 120 },
    {
      key: 'NombreRepuesto',
      header: 'Repuesto',
      // render: (row) => (
      //   <Stack spacing={0.3}>
      //     <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.NombreRepuesto ?? '-'}</Typography>
      //     {/* <Typography variant="caption" color="text.secondary">{row.Categoria ?? 'Sin categoría'}</Typography> */}
      //   </Stack>
      // )
    },
    // {
    //   key: 'buscar',
    //   header: 'Buscar',
    //   hidden: true,
    //   render: (row) => `${row.CodigoRepuesto ?? ''} ${row.NombreRepuesto ?? ''} ${row.Categoria ?? ''} ${row.UnidadMedida ?? ''} ${row.Estado ?? ''} ${row.CantidadDisponible ?? ''}`
    // },
    {
      key: 'CantidadDisponible',
      header: 'Disponible',
      align: 'center',
      width: 120,
      render: (row) => {
        const qty = row.CantidadDisponible ?? 0;
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
    // { key: 'UnidadMedida', header: 'Unidad', width: 120 },
    {
      key: 'Estado',
      header: 'Estado',
      width: 120,
      render: (row) => {
        const disponible = (row.CantidadDisponible ?? 0) > 0;
        return <Chip size="small" color={disponible ? 'success' : 'default'} label={disponible ? 'Disponible' : 'No disponible'} />;
      }
    }
  ];

  return (
    <>
      <Card>
        <Typography variant='subtitle1' style={{ color: '#000000', padding: '5px', fontWeight: 'normal' }}>
          Visualización de stock de repuestos
        </Typography>
        <Divider />
        <CardContent>
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            {/* <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                label="Categoría"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <Chip
              label={soloBajoStock ? 'Solo bajo stock' : 'Todos los niveles'}
              color={soloBajoStock ? 'warning' : 'default'}
              onClick={() => setSoloBajoStock((s) => !s)}
              sx={{ cursor: 'pointer' }}
            />
          </Box>

          <DataTable<RepuestoStock>
            data={filtered}
            // data={data}
            columns={columns}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            emptyMessage="No se encontraron repuestos"
            rowKey={(row) => row.IdRepuesto}
            placeHolderBuscador='Buscar repuestos...'
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