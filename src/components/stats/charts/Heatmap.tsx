/**
 * Heatmap Component
 * 9x10 grid showing frequency as color intensity
 */

import { NumberFrequency } from '../../../types/charts';

interface HeatmapProps {
  data: NumberFrequency[];
  darkMode?: boolean;
}

export default function Heatmap({ data }: HeatmapProps) {
  const maxCount = Math.max(...data.map((d) => d.count));

  // Get color based on frequency - vert clair vers violet foncé
  const getColorClass = (count: number): string => {
    if (count === 0) return 'bg-muted text-muted-foreground';

    const intensity = count / maxCount;

    if (intensity < 0.25) return 'bg-emerald-200 text-emerald-900'; // Très faible - vert très clair
    if (intensity < 0.5) return 'bg-emerald-400 text-white'; // Faible - vert clair
    if (intensity < 0.75) return 'bg-indigo-500 text-white'; // Moyen - indigo
    return 'bg-violet-700 text-white'; // Élevé - violet foncé
  };

  // Create 9x10 grid
  const grid: NumberFrequency[][] = [];
  for (let row = 0; row < 9; row++) {
    grid[row] = [];
    for (let col = 0; col < 10; col++) {
      const number = row * 10 + col + 1;
      const item = data.find((d) => d.number === number);
      grid[row][col] = item || { number, count: 0, percentage: 0 };
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">
        Carte de chaleur (Heatmap)
      </h3>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-block min-w-full">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell) => (
                <div
                  key={cell.number}
                  className={`relative group w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] flex items-center justify-center border transition-all hover:scale-105 cursor-pointer ${getColorClass(cell.count)}`}
                >
                  <span className="text-xs sm:text-sm font-semibold">
                    {cell.number}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute hidden group-hover:block z-10 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-popover text-popover-foreground border -top-16 left-1/2 -translate-x-1/2">
                    <div className="text-xs">
                      <div className="font-semibold">Numéro {cell.number}</div>
                      <div>Tirages: {cell.count}</div>
                      <div>Fréquence: {cell.percentage.toFixed(1)}%</div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-r border-b" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
        <span className="text-muted-foreground">Fréquence:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted border rounded" />
          <span className="text-foreground">Jamais</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-200 border rounded" />
          <span className="text-foreground">Très faible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 border rounded" />
          <span className="text-foreground">Faible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-indigo-500 border rounded" />
          <span className="text-foreground">Moyen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-violet-700 border rounded" />
          <span className="text-foreground">Élevé</span>
        </div>
      </div>
    </div>
  );
}
