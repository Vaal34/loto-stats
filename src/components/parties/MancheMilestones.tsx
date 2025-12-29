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
    compact?: boolean;
}

const MancheMilestones: React.FC<MancheMilestonesProps> = ({
    manche,
    compact = false
}) => {
    const analysis = useMemo(() => analyzeMancheQuines(manche), [manche]);

    const getMilestoneConfig = (type: QuineMilestone['type']) => {
        switch (type) {
            case 'quine':
                return {
                    icon: <Target className="h-3 w-3" />,
                    label: 'Quine',
                    bgColor: 'bg-chart-1/10',
                    textColor: 'text-chart-1',
                    borderColor: 'border-chart-1/30',
                };
            case 'deuxieme-quine':
                return {
                    icon: <Target className="h-3 w-3" />,
                    label: '2ème Quine',
                    bgColor: 'bg-chart-2/10',
                    textColor: 'text-chart-2',
                    borderColor: 'border-chart-2/30',
                };
            case 'double-quine':
                return {
                    icon: <Medal className="h-3 w-3" />,
                    label: 'Double Quine',
                    bgColor: 'bg-chart-4/10',
                    textColor: 'text-chart-4',
                    borderColor: 'border-chart-4/30',
                };
            case 'carton-plein':
                return {
                    icon: <Trophy className="h-3 w-3" />,
                    label: 'Carton Plein',
                    bgColor: 'bg-chart-5/10',
                    textColor: 'text-chart-5',
                    borderColor: 'border-chart-5/30',
                };
        }
    };

    if (analysis.milestones.length === 0) {
        return null;
    }

    if (compact) {
        return (
            <div className="flex gap-1">
                {analysis.milestones.map((milestone, index) => {
                    const config = getMilestoneConfig(milestone.type);
                    const formattedPosition = milestone.position < 10 ? `0${milestone.position}` : milestone.position.toString();
                    return (
                        <span
                            key={index}
                            className={`inline-flex items-center justify-center gap-0.5 px-1 py-0.5 rounded text-xs font-medium border flex-1 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                            title={`${config.label} au ${milestone.position}ème numéro (${milestone.numberDrawn})`}
                        >
                            {config.icon}
                            <span className="tabular-nums">{formattedPosition}</span>
                        </span>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            {analysis.milestones.map((milestone, index) => {
                const config = getMilestoneConfig(milestone.type);
                return (
                    <div
                        key={index}
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                    >
                        {config.icon}
                        <span>{config.label}</span>
                        <span className="font-normal text-muted-foreground">
                            au {milestone.position}ème numéro
                        </span>
                        <span className="font-bold px-1.5 py-0.5 rounded bg-background">
                            {milestone.numberDrawn}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default MancheMilestones;
