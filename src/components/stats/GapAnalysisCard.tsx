/**
 * GapAnalysisCard Component
 * Displays analysis of gaps between number draws
 * Updated to use shadcn/ui theme
 */

import React, { useMemo } from 'react';
import { Hourglass, History, Activity } from 'lucide-react';
import { NumberGapStats } from '../../hooks/useStats';

interface GapAnalysisCardProps {
  gapStats: NumberGapStats[];
  darkMode?: boolean;
}

const GapAnalysisCard: React.FC<GapAnalysisCardProps> = ({ gapStats }) => {

  const lateNumbers = useMemo(() => {
    return [...gapStats]
      .sort((a, b) => b.currentGap - a.currentGap)
      .slice(0, 8);
  }, [gapStats]);

  const regularNumbers = useMemo(() => {
    return [...gapStats]
      .filter(s => s.appearances > 0)
      .sort((a, b) => a.maxGap - b.maxGap)
      .slice(0, 8);
  }, [gapStats]);

  const hasData = gapStats.some(s => s.appearances > 0);

  if (!hasData) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 shrink-0 text-primary" />
          <span>Analyse des Écarts</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Quels numéros se font attendre ?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Late Numbers */}
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Hourglass className="h-4 w-4 text-red-500" />
            <h4 className="font-medium">
              Les plus en retard
            </h4>
          </div>
          <div className="flex flex-col justify-between gap-2 flex-1">
            {lateNumbers.map((stat) => (
              <div key={stat.number} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-muted">
                    {stat.number}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Absent depuis
                  </span>
                </div>
                <div className="font-bold text-red-600 dark:text-red-500">
                  {stat.currentGap} <span className="text-xs font-normal opacity-70">tirages</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Numbers */}
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-green-500" />
            <h4 className="font-medium">
              Les plus réguliers
            </h4>
          </div>
          <div className="flex flex-col justify-between gap-2 flex-1">
            {regularNumbers.map((stat) => (
              <div key={stat.number} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-muted">
                    {stat.number}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Max sans sortir
                  </span>
                </div>
                <div className="font-bold text-green-600 dark:text-green-500">
                  {stat.maxGap} <span className="text-xs font-normal opacity-70">tirages</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysisCard;
