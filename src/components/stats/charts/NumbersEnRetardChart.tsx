/**
 * Numbers En Retard Chart Component
 * Displays the top 15 numbers with the highest gap (not drawn for longest time)
 * Critical stat for traditional loto players
 */

import { Clock3 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { NumberGapStats } from '../../../hooks/useStats';

interface NumbersEnRetardChartProps {
  gapStats: NumberGapStats[];
  darkMode?: boolean;
}

const chartConfig = {
  currentGap: {
    label: 'Écart actuel',
    color: 'hsl(var(--destructive))',
  },
  averageGap: {
    label: 'Écart moyen',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function NumbersEnRetardChart({ gapStats }: NumbersEnRetardChartProps) {
  // Sort by current gap (descending) and take top 15
  const topRetard = [...gapStats]
    .sort((a, b) => b.currentGap - a.currentGap)
    .slice(0, 15)
    .map((stat) => ({
      number: stat.number.toString(),
      currentGap: stat.currentGap,
      averageGap: Math.round(stat.averageGap * 10) / 10, // Round to 1 decimal
      appearances: stat.appearances,
    }));

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
          <Clock3 className="h-5 w-5 shrink-0 text-primary" />
          <span className="line-clamp-2">Top 15 Numéros en Retard</span>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Numéros non sortis depuis le plus de tirages
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] lg:h-[350px] w-full">
        <BarChart
          data={topRetard}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs sm:text-sm"
            label={{
              value: 'Numéro',
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
              value: 'Tirages',
              angle: -90,
              position: 'insideLeft',
              className: 'fill-muted-foreground text-xs'
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Numéro ${value}`}
                formatter={(value, name, props) => {
                  if (name === 'currentGap') {
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{value} tirages de retard</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Moyenne: {props.payload.averageGap} tirages
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sorti {props.payload.appearances} fois au total
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            }
          />
          <Bar
            dataKey="currentGap"
            fill="var(--color-currentGap)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Plus grand retard</div>
          <div className="text-2xl font-bold">
            {topRetard[0]?.number || '-'}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({topRetard[0]?.currentGap || 0} tirages)
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Retard moyen (Top 15)</div>
          <div className="text-2xl font-bold">
            {topRetard.length > 0
              ? Math.round(
                  topRetard.reduce((sum, n) => sum + n.currentGap, 0) / topRetard.length
                )
              : 0}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              tirages
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        💡 Les numéros "en retard" n'ont statistiquement pas plus de chance de sortir,
        mais beaucoup de joueurs les favorisent dans leurs grilles.
      </div>
    </div>
  );
}
