'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Desktop as DesktopIcon } from '@phosphor-icons/react/dist/ssr/Desktop';
import { DeviceTablet as DeviceTabletIcon } from '@phosphor-icons/react/dist/ssr/DeviceTablet';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import type { ApexOptions } from 'apexcharts';

import type { PaletaGraficas } from '@/hooks/use-chart-palette';
import { useChartPalette } from '@/hooks/use-chart-palette';
import { Chart } from '@/components/core/chart';

const iconMapping = { Desktop: DesktopIcon, Tablet: DeviceTabletIcon, Phone: PhoneIcon } as Record<string, Icon>;

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
}

const ALTURA = 300;

export function Traffic({ chartSeries, labels, sx }: TrafficProps): React.JSX.Element {
  const paleta = useChartPalette();
  const chartOptions = useChartOptions(labels, paleta);

  return (
    <Card sx={sx}>
      <CardHeader title="Traffic source" />
      <CardContent>
        <Stack spacing={2}>
          {paleta.montado ? (
            <Chart
              // Ver `sales.tsx`: remontar es lo único que garantiza que Apex
              // repinte los colores literales al cambiar de modo.
              key={paleta.modo}
              height={ALTURA}
              options={chartOptions}
              series={chartSeries}
              sx={{
                '--grafica-tooltip-fondo': paleta.tooltipFondo,
                '--grafica-tooltip-texto': paleta.tooltipTexto,
              }}
              type="donut"
              width="100%"
            />
          ) : (
            <Skeleton height={ALTURA} variant="rounded" />
          )}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const Icon = iconMapping[label];

              return (
                <Stack key={label} spacing={1} sx={{ alignItems: 'center' }}>
                  {Icon ? <Icon fontSize="var(--icon-fontSize-lg)" /> : null}
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                    {/*
                      Esta fila hace de leyenda de la dona. Sin el cuadrito de
                      color, la identidad de cada porción dependería sólo del
                      color de la propia dona, que es exactamente lo que no
                      puede leer alguien con daltonismo.
                    */}
                    <Box
                      aria-hidden
                      sx={{
                        backgroundColor: paleta.series[index % paleta.series.length],
                        borderRadius: '3px',
                        flex: '0 0 auto',
                        height: 10,
                        width: 10,
                      }}
                    />
                    <Typography variant="h6">{label}</Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="subtitle2">
                    {item}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[], paleta: PaletaGraficas): ApexOptions {
  return React.useMemo<ApexOptions>(
    () => ({
      chart: { background: 'transparent', fontFamily: 'inherit', foreColor: paleta.textoEje },
      colors: [...paleta.series],
      dataLabels: { enabled: false },
      labels,
      // La leyenda de Apex se sustituye por la fila de iconos de abajo, que ya
      // trae etiqueta, porcentaje y ahora también el cuadrito de color.
      legend: { show: false },
      plotOptions: { pie: { donut: { size: '70%' }, expandOnClick: false } },
      states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
      // Separador de 2px del color REAL de la tarjeta: despega las porciones
      // contiguas sin meter un borde de un color ajeno al gráfico.
      stroke: { colors: [paleta.superficie], width: 2 },
      theme: { mode: paleta.modo },
      tooltip: {
        fillSeriesColor: false,
        theme: paleta.modo,
        y: { formatter: (value: number) => `${value}%` },
      },
    }),
    [labels, paleta]
  );
}
