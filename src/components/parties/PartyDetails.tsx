/**
 * Detailed view of a single party
 * Shows comprehensive stats, timeline, and export functionality
 */

import React, { useMemo } from 'react';
import { LotoGame } from '../../types/game';
import { X, Download, Clock, Calendar, Hash, TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PartyDetailsProps {
  game: LotoGame;
  onExport?: (game: LotoGame) => void;
  onClose: () => void;
  darkMode?: boolean;
}

const PartyDetails: React.FC<PartyDetailsProps> = ({
  game,
  onExport,
  onClose,
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
      return `${hours}h ${minutes}min ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}min ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Calculate statistics by decade
  const decadeStats = useMemo(() => {
    const decades = [
      { range: '1-10', min: 1, max: 10 },
      { range: '11-20', min: 11, max: 20 },
      { range: '21-30', min: 21, max: 30 },
      { range: '31-40', min: 31, max: 40 },
      { range: '41-50', min: 41, max: 50 },
      { range: '51-60', min: 51, max: 60 },
      { range: '61-70', min: 61, max: 70 },
      { range: '71-80', min: 71, max: 80 },
      { range: '81-90', min: 81, max: 90 },
    ];

    return decades.map((decade) => {
      const count = game.numbers.filter(
        (num) => num >= decade.min && num <= decade.max
      ).length;
      const percentage = numbersDrawn > 0 ? (count / numbersDrawn) * 100 : 0;
      return {
        ...decade,
        count,
        percentage,
      };
    });
  }, [game.numbers, numbersDrawn]);

  // Group numbers into rows of 10 for display
  const numbersGrid = useMemo(() => {
    const grid: number[][] = [];
    for (let i = 0; i < game.numbers.length; i += 10) {
      grid.push(game.numbers.slice(i, i + 10));
    }
    return grid;
  }, [game.numbers]);

  const handleExport = () => {
    if (onExport) {
      onExport(game);
    }
  };

  // Calculate average time between draws (if there are enough numbers)
  const avgTimeBetweenDraws = useMemo(() => {
    if (numbersDrawn < 2) return null;
    const totalDuration = duration;
    const avgMs = totalDuration / numbersDrawn;
    return avgMs;
  }, [numbersDrawn, duration]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden"
        style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: darkMode ? '#111827' : '#f9fafb',
            borderColor: darkMode ? '#374151' : '#e5e7eb',
          }}
        >
          <div className="flex-1">
            <h2
              className="text-2xl font-bold"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              {game.name}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              {format(new Date(game.date), 'EEEE dd MMMM yyyy', { locale: fr })}
            </p>
          </div>

          {game.isActive && (
            <span
              className="mx-4 px-3 py-1 text-sm font-semibold rounded-full animate-pulse"
              style={{
                backgroundColor: darkMode ? '#059669' : '#10b981',
                color: '#ffffff',
              }}
            >
              En cours
            </span>
          )}

          <div className="flex items-center gap-2">
            {onExport && (
              <button
                onClick={handleExport}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: darkMode ? '#3b82f6' : '#60a5fa',
                  color: '#ffffff',
                }}
                aria-label="Exporter cette partie"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#f3f4f6' : '#111827',
              }}
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Numbers Drawn */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                borderColor: darkMode ? '#4b5563' : '#e5e7eb',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Hash
                  className="w-5 h-5"
                  style={{ color: darkMode ? '#60a5fa' : '#3b82f6' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Numéros tirés
                </span>
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              >
                {numbersDrawn}/{totalNumbers}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
              >
                {progress.toFixed(1)}% complété
              </p>
            </div>

            {/* Duration */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                borderColor: darkMode ? '#4b5563' : '#e5e7eb',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock
                  className="w-5 h-5"
                  style={{ color: darkMode ? '#10b981' : '#059669' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Durée
                </span>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              >
                {formatDuration(duration)}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
              >
                {game.isActive ? 'En cours' : 'Terminée'}
              </p>
            </div>

            {/* Start Time */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                borderColor: darkMode ? '#4b5563' : '#e5e7eb',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar
                  className="w-5 h-5"
                  style={{ color: darkMode ? '#f59e0b' : '#d97706' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Début
                </span>
              </div>
              <p
                className="text-xl font-bold"
                style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              >
                {format(new Date(game.startTime), 'HH:mm:ss')}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
              >
                {format(new Date(game.startTime), 'dd/MM/yyyy')}
              </p>
            </div>

            {/* Average Time */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                borderColor: darkMode ? '#4b5563' : '#e5e7eb',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity
                  className="w-5 h-5"
                  style={{ color: darkMode ? '#a855f7' : '#9333ea' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Temps moyen
                </span>
              </div>
              <p
                className="text-xl font-bold"
                style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              >
                {avgTimeBetweenDraws
                  ? `${(avgTimeBetweenDraws / 1000).toFixed(1)}s`
                  : 'N/A'}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
              >
                Par numéro
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-medium"
                style={{ color: darkMode ? '#d1d5db' : '#374151' }}
              >
                Progression
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              >
                {progress.toFixed(1)}%
              </span>
            </div>
            <div
              className="w-full h-4 rounded-full overflow-hidden"
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
          </div>

          {/* Decade Distribution */}
          <div className="mb-6">
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Distribution par dizaine
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {decadeStats.map((decade) => (
                <div
                  key={decade.range}
                  className="p-3 rounded-lg border text-center"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                    borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                  }}
                >
                  <div
                    className="text-xs font-medium mb-1"
                    style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                  >
                    {decade.range}
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                  >
                    {decade.count}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                  >
                    {decade.percentage.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Numbers Drawn Timeline */}
          <div>
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              <Hash className="inline w-5 h-5 mr-2" />
              Numéros tirés (dans l'ordre)
            </h3>

            {numbersDrawn === 0 ? (
              <div
                className="text-center py-8 rounded-lg border"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Aucun numéro tiré pour le moment
                </p>
              </div>
            ) : (
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                }}
              >
                {numbersGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap gap-2 mb-2 last:mb-0">
                    {row.map((number, colIndex) => {
                      const position = rowIndex * 10 + colIndex + 1;
                      return (
                        <div
                          key={position}
                          className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-bold text-lg shadow-md transition-transform hover:scale-110"
                          style={{
                            backgroundColor: darkMode ? '#10b981' : '#10b981',
                            color: '#ffffff',
                          }}
                          title={`Position ${position}: Numéro ${number}`}
                        >
                          {number}
                          <span
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold"
                            style={{
                              backgroundColor: darkMode ? '#374151' : '#ffffff',
                              color: darkMode ? '#9ca3af' : '#6b7280',
                              border: `2px solid ${darkMode ? '#1f2937' : '#e5e7eb'}`,
                            }}
                          >
                            {position}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyDetails;
