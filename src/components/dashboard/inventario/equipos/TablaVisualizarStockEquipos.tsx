'use client';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { ColumnDefinition, DataTable } from '@/components/dashboard/componentes_generales/tablas/TablaPrincipalReutilizable';
import { useAlertas } from '@/hooks/FuncionMostrarAlerta';
import { VerStockEquiposPaginado } from '@/services/inventario/equipos/VerStockEquiposService';
import { usePaginacionServidor } from '@/hooks/use-paginacion-servidor';
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
import { getEstadoColor } from '@/utils/getEstadoColor';

interface EquipoStock {
  IdEquipo: number;
  CodigoEquipo?: string;
  NombreEquipo?: string;
  Categoria?: string;
  Cantidad?: number; // Ajustado para mapear desde Cantidad
  UnidadMedida?: string;
  Estado: string;
}

export function TablaVisualizarStockEquipos(): React.JSX.Element {
  const [soloBajoStock, setSoloBajoStock] = React.useState<boolean>(false);
  const { messages } = useSocketIO();

  const { mostrarAlertas, mensajeAlerta, tipoAlerta, mostrarMensaje, ocultarAlerta } = useAlertas();

  // Paginado, búsqueda y filtro "Solo bajo stock" resueltos en el servidor
  const tabla = usePaginacionServidor<EquipoStock>({
    consultar: async (parametros) => {
      const respuesta = await VerStockEquiposPaginado(parametros, { SoloBajoStock: soloBajoStock });
      // Mismo mapeo explícito que se aplicaba al listado completo
      return {
        ...respuesta,
        Datos: respuesta.Datos.map((item: any) => ({
          IdEquipo: item.IdEquipo,
          NombreEquipo: item.NombreEquipo,
          Cantidad: item.Cantidad,
          Estado: item.Estado,
          UnidadMedida: item.UnidadMedida
        }))
      };
    },
    filtros: [soloBajoStock],
    mensajeError: (err: any) => {
      mostrarMensaje(`No fue posible cargar el stock de equipos`, 'error');
      return `Error al cargar el stock de equipos: ${err?.message ?? err}`;
    }
  });

  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimo = messages[messages.length - 1];
      if (ultimo.tipo === 'salida-equipos-creada' || ultimo.tipo === 'entrada-equipos-creada') {
        tabla.recargar();
      }
    }
  }, [messages]);

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
        // return <Chip size="small" color={disponible ? 'success' : 'default'} label={row.Estado || (disponible ? 'Disponible' : 'No disponible')} />;
        return <Chip size="small" color={getEstadoColor(row.Estado)} label={row.Estado} />;
      }
    }
  ];

  return (
    <>
      <Card>
        <Typography variant='subtitle1' sx={{ p: '5px', fontWeight: 'normal' }}>
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
            data={tabla.datos}
            columns={columns}
            loading={tabla.cargando}
            error={tabla.error}
            searchTerm={tabla.busqueda}
            onSearchChange={tabla.setBusqueda}
            onRefresh={tabla.refrescar}
            paginacionServidor={tabla.paginacionTabla}
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
