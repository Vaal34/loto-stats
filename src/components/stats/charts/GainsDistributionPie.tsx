/**
 * Gains Distribution Pie Chart
 * Shows distribution of different win types (Quine, Double Quine, Carton Plein)
 */

import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { QuineStats } from '../../../hooks/useStats';
import { Trophy, Target, Medal, PieChart as PieChartIcon } from 'lucide-react';

interface GainsDistributionPieProps {
  quineStats: QuineStats;
  darkMode?: boolean;
}

const chartConfig = {
  quines: {
    label: 'Quines',
    color: 'hsl(210, 70%, 50%)',
  },
  deuxiemeQuines: {
    label: '2èmes Quines',
    color: 'hsl(270, 70%, 50%)',
  },
  doubleQuines: {
    label: 'Doubles Quines',
    color: 'hsl(30, 70%, 50%)',
  },
  cartonsPleins: {
    label: 'Cartons Pleins',
    color: 'hsl(120, 70%, 50%)',
  },
} satisfies ChartConfig;

const COLORS = [
  'hsl(210, 70%, 50%)', // Blue - Quine
  'hsl(270, 70%, 50%)', // Purple - 2ème Quine
  'hsl(30, 70%, 50%)',  // Orange - Double Quine
  'hsl(120, 70%, 50%)', // Green - Carton Plein
];

export default function GainsDistributionPie({ quineStats }: GainsDistributionPieProps) {
  const data = [
    {
      name: 'Quines',
      value: quineStats.totalQuines,
      icon: Target,
      color: COLORS[0],
    },
    {
      name: '2èmes Quines',
      value: quineStats.totalDeuxiemeQuines,
      icon: Target,
      color: COLORS[1],
    },
    {
      name: 'Doubles Quines',
      value: quineStats.totalDoubleQuines,
      icon: Medal,
      color: COLORS[2],
    },
    {
      name: 'Cartons Pleins',
      value: quineStats.totalCartonPleins,
      icon: Trophy,
      color: COLORS[3],
    },
  ].filter(item => item.value > 0); // Only show types with at least 1 win

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="w-full">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 shrink-0 text-primary" />
          Répartition des Gains
        </h3>
        <div className="text-center text-muted-foreground py-8">
          Aucun gain enregistré pour le moment
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 shrink-0 text-primary" />
          Répartition des Gains
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribution des types de gains obtenus
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{value} fois</span>
                    <span className="text-muted-foreground">
                      ({((Number(value) / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ChartContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4" style={{ color: item.color }} />
                <div className="text-xs text-muted-foreground">{item.name}</div>
              </div>
              <div className="text-xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {((item.value / total) * 100).toFixed(1)}% du total
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        📊 Total de gains : {total}
      </div>
    </div>
  );
}
