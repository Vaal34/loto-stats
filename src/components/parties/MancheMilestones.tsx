/**
 * MancheMilestones Component
 * Displays quine, double quine, and carton plein milestones for a manche
 */

import React, { useMemo } from 'react';
import { Target, Medal, Trophy } from 'lucide-react';
import { Manche } from '../../types/game';
import { analyzeMancheQuines, QuineMilestone } from '../../utils/quineAnalysis';

interface MancheMilestonesProps {
    manche: Manche;
    darkMode?: boolean;
    compact?: boolean;
}

const MancheMilestones: React.FC<MancheMilestonesProps> = ({
    manche,
    darkMode = false,
    compact = false
}) => {
    const analysis = useMemo(() => analyzeMancheQuines(manche), [manche]);

    const getMilestoneConfig = (type: QuineMilestone['type']) => {
        switch (type) {
            case 'quine':
                return {
                    icon: <Target className="h-3 w-3" />,
                    label: 'Quine',
                    bgColor: darkMode ? 'bg-blue-900/50' : 'bg-blue-100',
                    textColor: darkMode ? 'text-blue-300' : 'text-blue-700',
                    borderColor: darkMode ? 'border-blue-700' : 'border-blue-300',
                };
            case 'deuxieme-quine':
                return {
                    icon: <Target className="h-3 w-3" />,
                    label: '2ème Quine',
                    bgColor: darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100',
                    textColor: darkMode ? 'text-indigo-300' : 'text-indigo-700',
                    borderColor: darkMode ? 'border-indigo-700' : 'border-indigo-300',
                };
            case 'double-quine':
                return {
                    icon: <Medal className="h-3 w-3" />,
                    label: 'Double Quine',
                    bgColor: darkMode ? 'bg-purple-900/50' : 'bg-purple-100',
                    textColor: darkMode ? 'text-purple-300' : 'text-purple-700',
                    borderColor: darkMode ? 'border-purple-700' : 'border-purple-300',
                };
            case 'carton-plein':
                return {
                    icon: <Trophy className="h-3 w-3" />,
                    label: 'Carton Plein',
                    bgColor: darkMode ? 'bg-amber-900/50' : 'bg-amber-100',
                    textColor: darkMode ? 'text-amber-300' : 'text-amber-700',
                    borderColor: darkMode ? 'border-amber-700' : 'border-amber-300',
                };
        }
    };

    if (analysis.milestones.length === 0) {
        return null;
    }

    if (compact) {
        return (
            <div className="flex flex-wrap gap-1">
                {analysis.milestones.map((milestone, index) => {
                    const config = getMilestoneConfig(milestone.type);
                    return (
                        <span
                            key={index}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                            title={`${config.label} au ${milestone.position}ème numéro (${milestone.numberDrawn})`}
                        >
                            {config.icon}
                            <span>{milestone.position}</span>
                        </span>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-1.5 mt-2">
            {analysis.milestones.map((milestone, index) => {
                const config = getMilestoneConfig(milestone.type);
                return (
                    <div
                        key={index}
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border mr-2 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                    >
                        {config.icon}
                        <span>{config.label}</span>
                        <span className={`font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            au {milestone.position}ème numéro
                        </span>
                        <span className={`font-bold px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            {milestone.numberDrawn}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default MancheMilestones;
