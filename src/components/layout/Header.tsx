/**
 * Application header component
 * Displays app title, active game status, and theme toggle
 */

import React from 'react';
import { Sun, Moon, Clock } from 'lucide-react';
import { LotoGame } from '../../types/game';

interface HeaderProps {
  /** Currently active game (if any) */
  activeGame?: LotoGame;
  /** Current theme mode */
  darkMode: boolean;
  /** Theme toggle handler */
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeGame, darkMode, onToggleTheme }) => {
  const getElapsedTime = (): string => {
    if (!activeGame) return '';

    const start = new Date(activeGame.startTime);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);

    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b shadow-sm"
      style={{
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
      }}
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: App Title and Active Game Status */}
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate"
              style={{ color: darkMode ? '#f9fafb' : '#111827' }}
            >
              Loto Stats
            </h1>

            {/* Active Game Status */}
            {activeGame && (
              <div className="flex items-center gap-2 mt-1 flex-wrap sm:flex-nowrap">
                {/* Game Name */}
                <span
                  className="text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-none"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                  title={activeGame.name}
                >
                  {activeGame.name}
                </span>

                {/* Timer */}
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                    color: darkMode ? '#60a5fa' : '#3b82f6',
                  }}
                  aria-label={`Game duration: ${getElapsedTime()}`}
                >
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>{getElapsedTime()}</span>
                </div>

                {/* Numbers Drawn Progress */}
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: darkMode ? '#065f46' : '#d1fae5',
                    color: darkMode ? '#34d399' : '#059669',
                  }}
                  aria-label={`${activeGame.numbers.length} out of 90 numbers drawn`}
                >
                  <span>{activeGame.numbers.length}/90</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#fbbf24' : '#f59e0b',
              focusRingColor: darkMode ? '#60a5fa' : '#3b82f6',
            }}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
