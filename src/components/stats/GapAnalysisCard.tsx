/**
 * GapAnalysisCard Component
 * Displays analysis of gaps between number draws
 */

import React, { useMemo } from 'react';
import { Hourglass, History, Activity } from 'lucide-react';
import { NumberGapStats } from '../../hooks/useStats';

interface GapAnalysisCardProps {
    gapStats: NumberGapStats[];
    darkMode?: boolean;
}

const GapAnalysisCard: React.FC<GapAnalysisCardProps> = ({ gapStats, darkMode = false }) => {

    const lateNumbers = useMemo(() => {
        return [...gapStats]
            .sort((a, b) => b.currentGap - a.currentGap)
            .slice(0, 5);
    }, [gapStats]);

    const regularNumbers = useMemo(() => {
        // Filter out numbers that appeared very few times if needed, 
        // but lowest maxGap usually implies frequent appearance anyway.
        return [...gapStats]
            .filter(s => s.appearances > 0)
            .sort((a, b) => a.maxGap - b.maxGap)
            .slice(0, 5);
    }, [gapStats]);

    // Check if we have enough data (at least some numbers drawn)
    const hasData = gapStats.some(s => s.appearances > 0);

    if (!hasData) {
        return null;
    }

    return (
        <div className={`rounded-lg border p-6 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
                    <Activity className={`h-5 w-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Analyse des Écarts
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Quels numéros se font attendre ?
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Late Numbers */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Hourglass className={`h-4 w-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                        <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Les plus en retard (Écart actuel)
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {lateNumbers.map((stat) => (
                            <div key={stat.number} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        {stat.number}
                                    </div>
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Absent depuis
                                    </span>
                                </div>
                                <div className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                    {stat.currentGap} <span className="text-xs font-normal opacity-70">tirages</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regular Numbers */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <History className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Les plus réguliers (Écart max faible)
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {regularNumbers.map((stat) => (
                            <div key={stat.number} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        {stat.number}
                                    </div>
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Max sans sortir
                                    </span>
                                </div>
                                <div className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
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
