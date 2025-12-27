/**
 * TimingStatsCard Component
 * Displays statistics about duration and speed of the game
 */

import React from 'react';
import { Clock, Timer, Zap, Hourglass } from 'lucide-react';
import { TimingStats } from '../../hooks/useStats';

interface TimingStatsCardProps {
    timingStats: TimingStats;
    darkMode?: boolean;
}

const TimingStatsCard: React.FC<TimingStatsCardProps> = ({ timingStats, darkMode = false }) => {
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
        <div className={`rounded-lg border p-6 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-cyan-100'}`}>
                    <Clock className={`h-5 w-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Rythme de jeu
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Analyse de la vitesse des tirages
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Durée moyenne d'une manche */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Timer className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Durée Moyenne
                        </span>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {formatDuration(timingStats.averageMancheDurationSeconds)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">par manche</p>
                </div>

                {/* Temps entre tirages */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Hourglass className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Cadence
                        </span>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {formatSpeed(timingStats.averageTimeBetweenDrawsSeconds)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">entre deux numéros</p>
                </div>

                {/* Manche la plus rapide */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className={`h-4 w-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            La plus rapide
                        </span>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {formatDuration(timingStats.fastestMancheSeconds)}
                    </div>
                </div>

                {/* Manche la plus lente */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className={`h-4 w-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            La plus longue
                        </span>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {formatDuration(timingStats.slowestMancheSeconds)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimingStatsCard;
