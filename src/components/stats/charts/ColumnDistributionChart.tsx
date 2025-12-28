/**
 * Column Distribution Chart Component
 * Shows distribution of numbers by loto card columns (1-9, 10-19, ..., 80-90)
 * Critical for traditional loto as cards are organized in 9 columns
 */

import { Columns3 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { FrequencyData } from '../../../types/game';

interface ColumnDistributionChartProps {
  data: FrequencyData[];
  darkMode?: boolean;
}

const chartConfig = {
  count: {
    label: 'Tirages',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

// Colors for each column (9 colors)
const COLUMN_COLORS = [
  'hsl(220, 70%, 50%)', // 1-9: Blue
  'hsl(200, 70%, 50%)', // 10-19: Cyan
  'hsl(180, 70%, 50%)', // 20-29: Teal
  'hsl(160, 70%, 50%)', // 30-39: Green
  'hsl(100, 70%, 50%)', // 40-49: Light green
  'hsl(50, 70%, 50%)',  // 50-59: Yellow
  'hsl(30, 70%, 50%)',  // 60-69: Orange
  'hsl(10, 70%, 50%)',  // 70-79: Red-orange
  'hsl(350, 70%, 50%)', // 80-90: Red
];

export default function ColumnDistributionChart({ data }: ColumnDistributionChartProps) {
  // Group by column (1-9, 10-19, 20-29, ..., 80-90)
  const columnData = [
    { column: '1-9', range: '1-9', count: 0, numbers: [] as number[] },
    { column: '10-19', range: '10-19', count: 0, numbers: [] as number[] },
    { column: '20-29', range: '20-29', count: 0, numbers: [] as number[] },
    { column: '30-39', range: '30-39', count: 0, numbers: [] as number[] },
    { column: '40-49', range: '40-49', count: 0, numbers: [] as number[] },
    { column: '50-59', range: '50-59', count: 0, numbers: [] as number[] },
    { column: '60-69', range: '60-69', count: 0, numbers: [] as number[] },
    { column: '70-79', range: '70-79', count: 0, numbers: [] as number[] },
    { column: '80-90', range: '80-90', count: 0, numbers: [] as number[] },
  ];

  data.forEach((item) => {
    const num = item.number;
    let columnIndex: number;

    if (num >= 1 && num <= 9) columnIndex = 0;
    else if (num >= 10 && num <= 19) columnIndex = 1;
    else if (num >= 20 && num <= 29) columnIndex = 2;
    else if (num >= 30 && num <= 39) columnIndex = 3;
    else if (num >= 40 && num <= 49) columnIndex = 4;
    else if (num >= 50 && num <= 59) columnIndex = 5;
    else if (num >= 60 && num <= 69) columnIndex = 6;
    else if (num >= 70 && num <= 79) columnIndex = 7;
    else columnIndex = 8; // 80-90

    columnData[columnIndex].count += item.count;
    if (item.count > 0) {
      columnData[columnIndex].numbers.push(num);
    }
  });

  // Calculate total for percentage
  const total = columnData.reduce((sum, col) => sum + col.count, 0);
  const columnDataWithPercentage = columnData.map((col) => ({
    ...col,
    percentage: total > 0 ? ((col.count / total) * 100).toFixed(1) : '0',
  }));

  // Find min and max
  const maxColumn = columnDataWithPercentage.reduce((max, col) =>
    col.count > max.count ? col : max
  );
  const minColumn = columnDataWithPercentage.reduce((min, col) =>
    col.count < min.count ? col : min
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Columns3 className="h-5 w-5 text-primary" />
          Distribution par Colonne du Carton
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Répartition des numéros selon les colonnes du carton de loto
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] lg:h-[350px] w-full">
        <BarChart
          data={columnDataWithPercentage}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="column"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs sm:text-sm"
            label={{
              value: 'Colonne',
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
              value: 'Nombre de tirages',
              angle: -90,
              position: 'insideLeft',
              className: 'fill-muted-foreground text-xs'
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Colonne ${value}`}
                formatter={(value, _name, props) => (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{value} tirages</span>
                      <span className="text-muted-foreground">({props.payload.percentage}%)</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {props.payload.numbers.length} numéros différents sortis
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {columnDataWithPercentage.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLUMN_COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Colonne la plus fréquente</div>
          <div className="text-2xl font-bold" style={{ color: COLUMN_COLORS[columnData.indexOf(maxColumn)] }}>
            {maxColumn.column}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({maxColumn.count} tirages)
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground">Colonne la moins fréquente</div>
          <div className="text-2xl font-bold" style={{ color: COLUMN_COLORS[columnData.indexOf(minColumn)] }}>
            {minColumn.column}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({minColumn.count} tirages)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        💡 Chaque colonne du carton de loto correspond à une tranche :
        1-9 (1ère colonne), 10-19 (2ème), etc. jusqu'à 80-90 (9ème).
      </div>
    </div>
  );
}
