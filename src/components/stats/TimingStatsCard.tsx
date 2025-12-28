/**
 * TimingStatsCard Component
 * Displays statistics about duration and speed of the game
 * Updated to use shadcn/ui components
 */

import { Clock, Timer, Zap, Hourglass } from 'lucide-react';
import { TimingStats } from '../../hooks/useStats';

interface TimingStatsCardProps {
  timingStats: TimingStats;
  darkMode?: boolean;
}

const TimingStatsCard: React.FC<TimingStatsCardProps> = ({ timingStats }) => {
  const formatDuration = (seconds: number | null): string => {
    if (seconds === null) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatSpeed = (seconds: number): string => {
    return `${seconds.toFixed(1)}s`;
  };

  const hasData = timingStats.averageMancheDurationSeconds > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Rythme de jeu
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Analyse de la vitesse des tirages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4 flex-1">
        {/* Durée moyenne d'une manche */}
        <div className="rounded-lg border bg-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Durée Moyenne
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold">
              {formatDuration(timingStats.averageMancheDurationSeconds)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">par manche</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            Temps moyen du premier au dernier numéro tiré
          </p>
        </div>

        {/* Temps entre tirages */}
        <div className="rounded-lg border bg-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Hourglass className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Cadence
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold">
              {formatSpeed(timingStats.averageTimeBetweenDrawsSeconds)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">entre deux numéros</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            Intervalle moyen entre chaque tirage consécutif
          </p>
        </div>

        {/* Manche la plus rapide */}
        <div className="rounded-lg border bg-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-muted-foreground">
              La plus rapide
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
              {formatDuration(timingStats.fastestMancheSeconds)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            Record de vitesse pour terminer une manche
          </p>
        </div>

        {/* Manche la plus lente */}
        <div className="rounded-lg border bg-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">
              La plus longue
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
              {formatDuration(timingStats.slowestMancheSeconds)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            Manche ayant pris le plus de temps
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimingStatsCard;
