/**
 * Evolution Chart Component
 * Shows progression of games over time
 */

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { GameEvolution } from '../../../types/charts';

interface EvolutionChartProps {
  data: GameEvolution[];
  darkMode?: boolean;
}

const chartConfig = {
  numbersDrawn: {
    label: 'Numéros tirés',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function EvolutionChart({ data }: EvolutionChartProps) {
  if (data.length === 0) {
    return null;
  }

  const minValue = Math.min(...data.map((d) => d.numbersDrawn));
  const maxValue = Math.max(...data.map((d) => d.numbersDrawn));
  const avgValue = data.reduce((sum, d) => sum + d.numbersDrawn, 0) / data.length;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">
        Évolution des parties
      </h3>
      <ChartContainer config={chartConfig} className="h-[280px] sm:h-[350px] w-full">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="gameName"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 9 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={30}
            tick={{ fontSize: 10 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="numbersDrawn"
            stroke="var(--color-numbersDrawn)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-numbersDrawn)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 text-sm">
        <div className="p-2 sm:p-3 rounded-lg border bg-card">
          <div className="font-semibold text-card-foreground text-xs sm:text-sm">Minimum</div>
          <div className="text-lg sm:text-xl font-bold mt-1 text-primary">{minValue}</div>
        </div>

        <div className="p-2 sm:p-3 rounded-lg border bg-card">
          <div className="font-semibold text-card-foreground text-xs sm:text-sm">Moyenne</div>
          <div className="text-lg sm:text-xl font-bold mt-1 text-primary">{avgValue.toFixed(1)}</div>
        </div>

        <div className="p-2 sm:p-3 rounded-lg border bg-card">
          <div className="font-semibold text-card-foreground text-xs sm:text-sm">Maximum</div>
          <div className="text-lg sm:text-xl font-bold mt-1 text-primary">{maxValue}</div>
        </div>
      </div>
    </div>
  );
}
