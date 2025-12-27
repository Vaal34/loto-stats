/**
 * Single party card component
 * Displays individual game information in a card format
 */

import React from 'react';
import { LotoGame } from '../../types/game';
import { Play, Trash2, Clock, Calendar } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PartyCardProps {
  game: LotoGame;
  onClick: (game: LotoGame) => void;
  onResume?: (game: LotoGame) => void;
  onDelete?: (game: LotoGame) => void;
  darkMode?: boolean;
}

const PartyCard: React.FC<PartyCardProps> = ({
  game,
  onClick,
  onResume,
  onDelete,
  darkMode = false,
}) => {
  const numbersDrawn = game.numbers.length;
  const totalNumbers = 90;
  const progress = (numbersDrawn / totalNumbers) * 100;

  const duration = game.endTime
    ? new Date(game.endTime).getTime() - new Date(game.startTime).getTime()
    : Date.now() - new Date(game.startTime).getTime();

  const formatDuration = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      return `${minutes}min ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onResume) {
      onResume(game);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer la partie "${game.name}" ?`)) {
        onDelete(game);
      }
    }
  };

  return (
    <div
      onClick={() => onClick(game)}
      className="rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg"
      style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        boxShadow: darkMode
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-lg font-bold truncate flex-1"
            style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          >
            {game.name}
          </h3>
          {game.isActive && (
            <span
              className="ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap animate-pulse"
              style={{
                backgroundColor: darkMode ? '#059669' : '#10b981',
                color: '#ffffff',
              }}
            >
              En cours
            </span>
          )}
        </div>

        {/* Date and Duration */}
        <div className="flex flex-col gap-1 text-sm" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(game.date), 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(duration)}</span>
            {game.isActive && (
              <span className="text-xs">
                (commencé {formatDistanceToNow(new Date(game.startTime), { locale: fr, addSuffix: true })})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: darkMode ? '#d1d5db' : '#374151' }}
          >
            Numéros tirés
          </span>
          <span
            className="text-2xl font-bold"
            style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          >
            {numbersDrawn}/{totalNumbers}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: darkMode ? '#374151' : '#e5e7eb' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: game.isActive
                ? darkMode ? '#3b82f6' : '#60a5fa'
                : darkMode ? '#10b981' : '#10b981',
            }}
          />
        </div>

        <div
          className="mt-1 text-xs text-right"
          style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
        >
          {progress.toFixed(1)}% complété
        </div>
      </div>

      {/* Action Buttons */}
      {(onResume || onDelete) && (
        <div
          className="p-3 border-t flex gap-2"
          style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}
        >
          {onResume && !game.isActive && (
            <button
              onClick={handleResume}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? '#3b82f6' : '#60a5fa',
                color: '#ffffff',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
              }}
              aria-label={`Reprendre la partie ${game.name}`}
            >
              <Play className="w-4 h-4" />
              <span>Reprendre</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? '#991b1b' : '#fca5a5',
                color: darkMode ? '#ffffff' : '#7f1d1d',
                boxShadow: darkMode
                  ? '0 2px 4px rgba(153, 27, 27, 0.3)'
                  : '0 2px 4px rgba(252, 165, 165, 0.3)',
              }}
              aria-label={`Supprimer la partie ${game.name}`}
            >
              <Trash2 className="w-4 h-4" />
              {!onResume && <span>Supprimer</span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PartyCard;
