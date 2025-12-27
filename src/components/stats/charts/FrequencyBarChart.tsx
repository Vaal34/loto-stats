/**
 * Frequency Bar Chart Component
 * Displays the frequency of each number (1-90) across all games
 */

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { NumberFrequency } from '../../../types/charts';

interface FrequencyBarChartProps {
  data: NumberFrequency[];
  darkMode?: boolean;
}

const chartConfig = {
  count: {
    label: 'Tirages',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function FrequencyBarChart({ data }: FrequencyBarChartProps) {
  // Calculate theoretical average (uniform distribution)
  const totalDraws = data.reduce((sum, item) => sum + item.count, 0);
  const averageFrequency = totalDraws / 90;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">
        Fréquence de tirage (1-90)
      </h3>
      <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            tick={{ fontSize: 10 }}
            className="text-xs sm:text-sm"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={30}
            tick={{ fontSize: 10 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ReferenceLine
            y={averageFrequency}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="5 5"
            label={{
              value: 'Moy.',
              position: 'insideTopRight',
              fontSize: 10,
            }}
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
