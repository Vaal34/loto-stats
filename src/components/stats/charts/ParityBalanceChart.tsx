/**
 * ParityBalanceChart Component
 * Displays the ratio of Even vs Odd numbers
 */

import { Pie, PieChart, Cell, Legend } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { ParityStats } from '../../../hooks/useStats';

interface ParityBalanceChartProps {
    stats: ParityStats;
    darkMode?: boolean;
}

const chartConfig = {
    even: {
        label: 'Pairs',
        color: 'hsl(var(--chart-1))',
    },
    odd: {
        label: 'Impairs',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

export default function ParityBalanceChart({ stats }: ParityBalanceChartProps) {
    const data = [
        { name: 'Pair', value: stats.evenCount, fill: 'var(--color-even)' },
        { name: 'Impair', value: stats.oddCount, fill: 'var(--color-odd)' },
    ];

    // Custom colors matching chart config variables
    // We'll use CSS variables usually, but here for simplicity with Pie cells
    const COLORS = ['#3b82f6', '#f59e0b']; // Blue and Amber

    return (
        <div className="w-full flexflex-col items-center">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-4 text-center">
                Équilibre Pair / Impair
            </h3>
            <div className="flex justify-center">
                <ChartContainer config={chartConfig} className="h-[250px] w-full max-w-[300px]">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartContainer>
            </div>
            <div className="flex justify-center gap-8 mt-2 text-sm">
                <div className="text-center">
                    <div className="font-semibold text-blue-500">{stats.evenPercentage.toFixed(1)}%</div>
                    <div className="text-muted-foreground">Pairs</div>
                </div>
                <div className="text-center">
                    <div className="font-semibold text-amber-500">{stats.oddPercentage.toFixed(1)}%</div>
                    <div className="text-muted-foreground">Impairs</div>
                </div>
            </div>
        </div>
    );
}
