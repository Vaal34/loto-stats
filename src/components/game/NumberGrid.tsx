/**
 * Interactive 9x10 grid for number selection
 */

import React, { useMemo } from 'react';
import { GRID_ROWS, GRID_COLS } from '../../constants/config';
import { cn } from '@/lib/utils';

interface NumberGridProps {
  onNumberClick: (number: number) => void;
  drawnNumbers: number[];
  allTimeFrequency: Record<number, number>;
  isActive: boolean;
  darkMode?: boolean;
}

const NumberGrid: React.FC<NumberGridProps> = ({
  onNumberClick,
  drawnNumbers,
  allTimeFrequency,
  isActive,
}) => {
  // Calculate max frequency for badge coloring
  const maxFrequency = useMemo(() => {
    return Math.max(...Object.values(allTimeFrequency), 1);
  }, [allTimeFrequency]);

  const getBadgeColorClass = (frequency: number): string => {
    if (frequency === 0) return 'bg-muted text-muted-foreground';

    const normalized = frequency / maxFrequency;

    if (normalized < 0.33) return 'bg-emerald-400 text-white'; // Vert clair - faible
    if (normalized < 0.66) return 'bg-indigo-500 text-white'; // Indigo - moyen
    return 'bg-violet-700 text-white'; // Violet foncé - élevé
  };

  const handleNumberClick = (number: number) => {
    if (!isActive) {
      alert('Aucune partie active. Créez une nouvelle partie pour commencer.');
      return;
    }
    onNumberClick(number);
  };

  return (
    <div className="w-full">
      {/* Grid Container - Responsive */}
      <div className="grid grid-cols-10 gap-1 sm:gap-2">
        {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, index) => {
          const number = index + 1;
          const isDrawn = drawnNumbers.includes(number);
          const frequency = allTimeFrequency[number] || 0;

          return (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              disabled={!isActive}
              className={cn(
                'relative aspect-square rounded-md font-bold transition-all duration-200',
                'text-xs sm:text-sm md:text-base',
                'hover:scale-105 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'border-2',
                isDrawn
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label={`Number ${number}${isDrawn ? ' (drawn)' : ''}. Total occurrences: ${frequency}`}
              aria-pressed={isDrawn}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{number}</span>
                {frequency > 0 && (
                  <span
                    className={cn(
                      'absolute top-0.5 right-0.5 text-[8px] sm:text-[9px] font-semibold px-1 rounded-full',
                      getBadgeColorClass(frequency)
                    )}
                    aria-label={`Drawn ${frequency} times`}
                  >
                    {frequency}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-primary border-2 border-primary" />
          <span className="text-muted-foreground">Tiré</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-card border-2 border-border" />
          <span className="text-muted-foreground">Non tiré</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-400 text-white">1</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white">2</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-violet-700 text-white">3</span>
          </div>
          <span className="text-muted-foreground">Fréquence</span>
        </div>
      </div>
    </div>
  );
};

export default NumberGrid;
