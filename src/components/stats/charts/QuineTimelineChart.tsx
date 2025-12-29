/**
 * Quine Timeline Chart
 * Shows the evolution of quine positions across manches
 */

import { TrendingUp } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LotoGame } from '../../../types/game';

interface QuineTimelineChartProps {
  partie: LotoGame | null;
  darkMode?: boolean;
}

const chartConfig = {
  quine: {
    label: 'Quine',
    color: 'hsl(210, 70%, 50%)',
  },
  deuxiemeQuine: {
    label: '2ème Quine',
    color: 'hsl(270, 70%, 50%)',
  },
  doubleQuine: {
    label: 'Double Quine',
    color: 'hsl(30, 70%, 50%)',
  },
  cartonPlein: {
    label: 'Carton Plein',
    color: 'hsl(120, 70%, 50%)',
  },
} satisfies ChartConfig;

export default function QuineTimelineChart({ partie }: QuineTimelineChartProps) {
  if (!partie || partie.manches.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 shrink-0 text-primary" />
          Évolution des Gains par Manche
        </h3>
        <div className="text-center text-muted-foreground py-8">
          Aucune manche disponible
        </div>
      </div>
    );
  }

  // Sort manches by number
  const sortedManches = [...partie.manches].sort((a, b) => a.mancheNumber - b.mancheNumber);

  const data = sortedManches.map((manche) => ({
    manche: `M${manche.mancheNumber}`,
    mancheNumber: manche.mancheNumber,
    quine: manche.quineAt || null,
    deuxiemeQuine: manche.deuxiemeQuineAt || null,
    doubleQuine: manche.doubleQuineAt || null,
    cartonPlein: manche.cartonPleinAt || null,
  }));

  // Calculate averages
  const avgQuine = data.filter(d => d.quine).reduce((sum, d) => sum + (d.quine || 0), 0) /
    data.filter(d => d.quine).length;
  const avgDoubleQuine = data.filter(d => d.doubleQuine).reduce((sum, d) => sum + (d.doubleQuine || 0), 0) /
    data.filter(d => d.doubleQuine).length;
  const avgCartonPlein = data.filter(d => d.cartonPlein).reduce((sum, d) => sum + (d.cartonPlein || 0), 0) /
    data.filter(d => d.cartonPlein).length;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 shrink-0 text-primary" />
          Évolution des Gains par Manche
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Position des gains au fil des manches
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] lg:h-[350px] w-full">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="manche"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs sm:text-sm"
            label={{
              value: 'Manche',
              position: 'insideBottom',
              offset: -10,
              className: 'fill-muted-foreground text-xs'
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs sm:text-sm"
            label={{
              value: 'Position (numéro tiré)',
              angle: -90,
              position: 'insideLeft',
              className: 'fill-muted-foreground text-xs'
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Manche ${value}`}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="quine"
            stroke="var(--color-quine)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="deuxiemeQuine"
            stroke="var(--color-deuxiemeQuine)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="doubleQuine"
            stroke="var(--color-doubleQuine)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="cartonPlein"
            stroke="var(--color-cartonPlein)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ChartContainer>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Quine moyen</div>
          <div className="text-2xl font-bold text-primary">
            {avgQuine.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ème tirage
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Double Quine moyen</div>
          <div className="text-2xl font-bold text-primary">
            {avgDoubleQuine.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ème tirage
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Carton Plein moyen</div>
          <div className="text-2xl font-bold text-primary">
            {avgCartonPlein.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ème tirage
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        📈 Plus la ligne est basse, plus le gain est arrivé rapidement (peu de tirages)
      </div>
    </div>
  );
}
