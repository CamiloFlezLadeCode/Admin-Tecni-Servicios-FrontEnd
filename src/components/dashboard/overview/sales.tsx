'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import type { PaletaGraficas } from '@/hooks/use-chart-palette';
import { useChartPalette } from '@/hooks/use-chart-palette';
import { Chart } from '@/components/core/chart';

export interface SalesProps {
  chartSeries: { name: string; data: number[] }[];
  sx?: SxProps;
}

const ALTURA = 350;

export function Sales({ chartSeries, sx }: SalesProps): React.JSX.Element {
  const paleta = useChartPalette();
  const chartOptions = useChartOptions(paleta);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Sync
          </Button>
        }
        title="Sales"
      />
      <CardContent>
        {paleta.montado ? (
          <Chart
            // El modo va en `key` a propósito: Apex reutiliza el SVG ya
            // pintado y no siempre repinta los colores literales al recibir
            // opciones nuevas. Remontar es la única forma fiable de que el
            // gráfico entero cambie de tema.
            key={paleta.modo}
            height={ALTURA}
            options={chartOptions}
            series={chartSeries}
            sx={{
              // Los pinta el CSS de `chart.tsx`; ver allí el reparto.
              '--grafica-tooltip-fondo': paleta.tooltipFondo,
              '--grafica-tooltip-texto': paleta.tooltipTexto,
            }}
            type="bar"
            width="100%"
          />
        ) : (
          // Reserva la altura hasta conocer el modo real: sin salto de layout
          // y sin un fogonazo con la paleta equivocada.
          <Skeleton height={ALTURA} variant="rounded" />
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(paleta: PaletaGraficas): ApexOptions {
  // `paleta` sólo cambia de identidad cuando cambia el modo, así que basta
  // con tenerla en las dependencias para que las opciones se recalculen al
  // alternar el tema (que es justo lo que NO pasaba con `theme.palette.*`).
  return React.useMemo<ApexOptions>(
    () => ({
      chart: {
        background: 'transparent',
        fontFamily: 'inherit',
        // `foreColor` es el color por defecto de cualquier texto del SVG que
        // no tenga uno propio; sin él Apex cae en un gris fijo.
        foreColor: paleta.textoEje,
        stacked: false,
        toolbar: { show: false },
      },
      // Dos series categóricas → los dos primeros matices de la secuencia
      // (índigo y verde azulado), no dos opacidades del mismo color.
      colors: [paleta.series[0], paleta.series[1]],
      dataLabels: { enabled: false },
      fill: { opacity: 1, type: 'solid' },
      grid: {
        borderColor: paleta.rejilla,
        strokeDashArray: 2,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      // Con dos series la leyenda no es opcional: es lo único que ata cada
      // color a su nombre.
      legend: {
        fontFamily: 'inherit',
        horizontalAlign: 'right',
        itemMargin: { horizontal: 8 },
        labels: { colors: paleta.textoEje },
        markers: { height: 10, radius: 3, width: 10 },
        position: 'top',
        show: true,
      },
      plotOptions: {
        bar: {
          // Punta redondeada sólo en el extremo del dato: la base queda
          // anclada a la línea cero, que es lo que se compara.
          borderRadius: 4,
          borderRadiusApplication: 'end',
          columnWidth: '40px',
        },
      },
      // Filete del color de la tarjeta entre barras contiguas: las separa sin
      // añadir una línea de un color que no existe en el gráfico.
      stroke: { colors: [paleta.superficie], show: true, width: 2 },
      theme: { mode: paleta.modo },
      tooltip: { theme: paleta.modo },
      xaxis: {
        axisBorder: { color: paleta.bordeEje, show: true },
        axisTicks: { color: paleta.bordeEje, show: true },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { offsetY: 5, style: { colors: paleta.textoEje } },
      },
      yaxis: {
        labels: {
          formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
          offsetX: -10,
          style: { colors: paleta.textoEje },
        },
      },
    }),
    [paleta]
  );
}
