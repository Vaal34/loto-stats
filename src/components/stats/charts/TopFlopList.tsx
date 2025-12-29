/**
 * Top Flop List Component
 * Shows most and least drawn numbers
 */

import { Flame, Snowflake, Trophy, Medal, Award } from 'lucide-react';
import { NumberFrequency } from '../../../types/charts';

interface TopFlopListProps {
  topNumbers: NumberFrequency[];
  flopNumbers: NumberFrequency[];
  darkMode?: boolean;
}

export default function TopFlopList({ topNumbers, flopNumbers }: TopFlopListProps) {
  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground">{index + 1}.</span>;
  };

  const maxCount = topNumbers[0]?.count || 1;

  return (
    <div className="w-full">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-4">
        Top & Flop des numéros
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top 15 */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
            Top 15 - Plus tirés
          </h4>
          <div className="space-y-2">
            {topNumbers.map((item, index) => (
              <div
                key={item.number}
                className="p-2 sm:p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {getMedalIcon(index)}
                    <span className="text-xl sm:text-2xl font-bold text-card-foreground">
                      {item.number}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-primary">
                      {item.count}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 sm:h-2 rounded-full overflow-hidden bg-secondary">
                  <div
                    className="h-full transition-all duration-300 bg-primary"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flop 15 */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Snowflake className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            Flop 15 - Moins tirés
          </h4>
          <div className="space-y-2">
            {flopNumbers.map((item, index) => (
              <div
                key={item.number}
                className="p-2 sm:p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-card-foreground">
                      {item.number}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-chart-2">
                      {item.count}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 sm:h-2 rounded-full overflow-hidden bg-secondary">
                  <div
                    className="h-full transition-all duration-300 bg-chart-2"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
