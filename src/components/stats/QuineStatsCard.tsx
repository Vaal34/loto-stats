/**
 * QuineStatsCard Component
 * Displays statistics about quine, double quine, and carton plein milestones
 * Updated to use shadcn/ui theme
 */

import React from 'react';
import { Trophy, Target, Medal } from 'lucide-react';

interface QuineStats {
  averageQuinePosition: number | null;
  averageDeuxiemeQuinePosition: number | null;
  averageDoubleQuinePosition: number | null;
  averageCartonPleinPosition: number | null;
  totalQuines: number;
  totalDeuxiemeQuines: number;
  totalDoubleQuines: number;
  totalCartonPleins: number;
  fastestQuine: number | null;
  slowestQuine: number | null;
  fastestDeuxiemeQuine: number | null;
  slowestDeuxiemeQuine: number | null;
  fastestDoubleQuine: number | null;
  slowestDoubleQuine: number | null;
  fastestCartonPlein: number | null;
  slowestCartonPlein: number | null;
}

interface QuineStatsCardProps {
  quineStats: QuineStats;
  darkMode?: boolean;
}

const QuineStatsCard: React.FC<QuineStatsCardProps> = ({ quineStats }) => {
  const formatPosition = (position: number | null): string => {
    if (position === null) return 'N/A';
    return `${position}ème`;
  };

  console.log(quineStats);

  const formatAverage = (avg: number | null): string => {
    if (avg === null) return 'N/A';
    return avg.toFixed(1);
  };

  const statCards = [
    {
      title: 'Quine',
      description: 'Première ligne complète',
      icon: Target,
      iconColor: 'text-blue-500',
      stats: [
        { label: 'Position moyenne', value: formatAverage(quineStats.averageQuinePosition), highlight: true },
        { label: 'Plus rapide', value: formatPosition(quineStats.fastestQuine) },
        { label: 'Plus lent', value: formatPosition(quineStats.slowestQuine) },
        { label: 'Total', value: quineStats.totalQuines.toString() },
      ],
    },
    {
      title: '2ème Quine',
      description: 'Deuxième ligne complète',
      icon: Target,
      iconColor: 'text-indigo-500',
      stats: [
        { label: 'Position moyenne', value: formatAverage(quineStats.averageDeuxiemeQuinePosition), highlight: true },
        { label: 'Plus rapide', value: formatPosition(quineStats.fastestDeuxiemeQuine) },
        { label: 'Plus lent', value: formatPosition(quineStats.slowestDeuxiemeQuine) },
        { label: 'Total', value: quineStats.totalDeuxiemeQuines.toString() },
      ],
    },
    {
      title: 'Double Quine',
      description: 'Deux lignes en même temps',
      icon: Medal,
      iconColor: 'text-purple-500',
      stats: [
        { label: 'Position moyenne', value: formatAverage(quineStats.averageDoubleQuinePosition), highlight: true },
        { label: 'Plus rapide', value: formatPosition(quineStats.fastestDoubleQuine) },
        { label: 'Plus lent', value: formatPosition(quineStats.slowestDoubleQuine) },
        { label: 'Total', value: quineStats.totalDoubleQuines.toString() },
      ],
    },
    {
      title: 'Carton Plein',
      description: 'Carte complète (15 numéros)',
      icon: Trophy,
      iconColor: 'text-amber-500',
      stats: [
        { label: 'Position moyenne', value: formatAverage(quineStats.averageCartonPleinPosition), highlight: true },
        { label: 'Plus rapide', value: formatPosition(quineStats.fastestCartonPlein) },
        { label: 'Plus lent', value: formatPosition(quineStats.slowestCartonPlein) },
        { label: 'Total', value: quineStats.totalCartonPleins.toString() },
      ],
    },
  ];

  const hasNoData = quineStats.totalQuines === 0 &&
    quineStats.totalDeuxiemeQuines === 0 &&
    quineStats.totalDoubleQuines === 0 &&
    quineStats.totalCartonPleins === 0;

  if (hasNoData) {
    return (
      <div className="w-full flex flex-col gap-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 shrink-0 text-primary" />
          <span className="line-clamp-2">Statistiques Quine / Double Quine / Carton Plein</span>
        </h3>
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Aucune donnée disponible. Les statistiques apparaîtront après avoir joué au moins une manche complète.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 shrink-0 text-primary" />
          <span className="line-clamp-2">Statistiques Quine / Double Quine / Carton Plein</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          À quel numéro en moyenne chaque étape est atteinte ?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-lg border bg-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 shrink-0 ${card.iconColor}`} />
                <div>
                  <h4 className="font-semibold">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {card.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                    <span
                      className={`font-medium ${stat.highlight
                        ? `text-lg ${card.iconColor}`
                        : ''
                        }`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary insights */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">
              Total quines:{' '}
              <span className="font-medium text-foreground">
                {quineStats.totalQuines}
              </span>
            </span>
          </div>
          {quineStats.fastestQuine !== null && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                Quine le plus rapide:{' '}
                <span className="font-medium text-foreground">
                  {quineStats.fastestQuine}ème
                </span>
              </span>
            </div>
          )}
          {quineStats.fastestCartonPlein !== null && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">
                Carton le plus rapide:{' '}
                <span className="font-medium text-foreground">
                  {quineStats.fastestCartonPlein}ème
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuineStatsCard;
