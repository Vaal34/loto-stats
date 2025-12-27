/**
 * QuineStatsCard Component
 * Displays statistics about quine, double quine, and carton plein milestones
 */

import React from 'react';
import { Trophy, Zap, TrendingUp, Target, Medal } from 'lucide-react';

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
    fastestCartonPlein: number | null;
    slowestCartonPlein: number | null;
}

interface QuineStatsCardProps {
    quineStats: QuineStats;
    darkMode?: boolean;
}

const QuineStatsCard: React.FC<QuineStatsCardProps> = ({ quineStats, darkMode = false }) => {
    const formatPosition = (position: number | null): string => {
        if (position === null) return 'N/A';
        return `${position}ème numéro`;
    };

    const formatAverage = (avg: number | null): string => {
        if (avg === null) return 'N/A';
        return avg.toFixed(1);
    };

    const statCards = [
        {
            title: 'Quine',
            description: 'Première ligne complète',
            icon: <Target className="h-5 w-5" />,
            color: 'blue',
            bgColor: darkMode ? 'bg-blue-900/30' : 'bg-blue-50',
            borderColor: darkMode ? 'border-blue-700' : 'border-blue-200',
            iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
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
            icon: <Target className="h-5 w-5" />,
            color: 'indigo',
            bgColor: darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50',
            borderColor: darkMode ? 'border-indigo-700' : 'border-indigo-200',
            iconColor: darkMode ? 'text-indigo-400' : 'text-indigo-600',
            stats: [
                { label: 'Position moyenne', value: formatAverage(quineStats.averageDeuxiemeQuinePosition), highlight: true },
                { label: 'Total', value: quineStats.totalDeuxiemeQuines.toString() },
            ],
        },
        {
            title: 'Double Quine',
            description: 'Deux lignes en même temps',
            icon: <Medal className="h-5 w-5" />,
            color: 'purple',
            bgColor: darkMode ? 'bg-purple-900/30' : 'bg-purple-50',
            borderColor: darkMode ? 'border-purple-700' : 'border-purple-200',
            iconColor: darkMode ? 'text-purple-400' : 'text-purple-600',
            stats: [
                { label: 'Position moyenne', value: formatAverage(quineStats.averageDoubleQuinePosition), highlight: true },
                { label: 'Total', value: quineStats.totalDoubleQuines.toString() },
            ],
        },
        {
            title: 'Carton Plein',
            description: 'Carte complète (15 numéros)',
            icon: <Trophy className="h-5 w-5" />,
            color: 'amber',
            bgColor: darkMode ? 'bg-amber-900/30' : 'bg-amber-50',
            borderColor: darkMode ? 'border-amber-700' : 'border-amber-200',
            iconColor: darkMode ? 'text-amber-400' : 'text-amber-600',
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
            <div className={`rounded-lg border p-6 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <Trophy className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Statistiques Quine / Double Quine / Carton Plein
                    </h3>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Aucune donnée disponible. Les statistiques apparaîtront après avoir joué au moins une manche complète.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Trophy className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
                <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Statistiques Quine / Double Quine / Carton Plein
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        À quel numéro en moyenne chaque étape est atteinte ?
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className={`rounded-lg border p-4 ${card.bgColor} ${card.borderColor}`}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <div className={card.iconColor}>{card.icon}</div>
                            <div>
                                <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {card.title}
                                </h4>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {card.description}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {card.stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between items-center ${stat.highlight ? 'py-1' : ''
                                        }`}
                                >
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {stat.label}
                                    </span>
                                    <span
                                        className={`font-medium ${stat.highlight
                                            ? `text-lg ${card.iconColor}`
                                            : darkMode
                                                ? 'text-gray-200'
                                                : 'text-gray-900'
                                            }`}
                                    >
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary insights */}
            <div className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex items-center gap-2 mb-2">
                    <Zap className={`h-4 w-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Résumé
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Total manches analysées:{' '}
                            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                {quineStats.totalQuines}
                            </span>
                        </span>
                    </div>
                    {quineStats.fastestQuine !== null && (
                        <div className="flex items-center gap-2">
                            <Zap className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Quine le plus rapide:{' '}
                                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                    {quineStats.fastestQuine}ème numéro
                                </span>
                            </span>
                        </div>
                    )}
                    {quineStats.fastestCartonPlein !== null && (
                        <div className="flex items-center gap-2">
                            <Trophy className={`h-4 w-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Carton le plus rapide:{' '}
                                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                    {quineStats.fastestCartonPlein}ème numéro
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
