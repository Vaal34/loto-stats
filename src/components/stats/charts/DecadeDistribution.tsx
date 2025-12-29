/**
 * Decade Distribution Component
 * Shows distribution across decades (1-10, 11-20, etc.)
 */

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DecadeData } from '../../../types/charts';

interface DecadeDistributionProps {
  data: DecadeData[];
  darkMode?: boolean;
}

const chartConfig = {
  count: {
    label: 'Tirages',
    color: 'hsl(var(--primary))',
  },
  percentage: {
    label: 'Pourcentage',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function DecadeDistribution({ data }: DecadeDistributionProps) {
  const theoreticalPercentage = 100 / 9; // 11.11%

  return (
    <div className="w-full">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-4">
        Distribution par dizaine
      </h3>
      <ChartContainer config={chartConfig} className="h-[280px] sm:h-[350px] w-full">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="decade"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={30}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={30}
            tick={{ fontSize: 10 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ReferenceLine
            yAxisId="right"
            y={theoreticalPercentage}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="5 5"
            label={{
              value: `Théo.`,
              position: 'insideTopRight',
              fontSize: 9,
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="count"
            fill="var(--color-count)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="percentage"
            fill="var(--color-percentage)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>

      {/* Statistics Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
        {data.map((decade) => {
          const deviation = decade.percentage - theoreticalPercentage;
          const isOver = deviation > 0;

          return (
            <div
              key={decade.decade}
              className="p-2 sm:p-3 rounded-lg border bg-card"
            >
              <div className="font-semibold text-card-foreground text-xs sm:text-sm">
                {decade.decade}
              </div>
              <div className="text-[10px] sm:text-xs mt-1 text-muted-foreground">
                {decade.count} tirages ({decade.percentage.toFixed(1)}%)
              </div>
              <div
                className="text-[10px] sm:text-xs mt-1"
                style={{
                  color: isOver ? 'hsl(0, 84%, 60%)' : 'hsl(142, 76%, 36%)',
                }}
              >
                {isOver ? '+' : ''}{deviation.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
