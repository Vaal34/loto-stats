/**
 * Display game duration timer
 */

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  startTime: Date;
  endTime?: Date;
  darkMode?: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({
  startTime,
  endTime,
  darkMode = false,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Calculate initial elapsed time
    const calculateElapsed = () => {
      const end = endTime || new Date();
      const diff = end.getTime() - startTime.getTime();
      return Math.floor(diff / 1000); // Convert to seconds
    };

    setElapsed(calculateElapsed());

    // If game is still active (no endTime), update every second
    if (!endTime) {
      const interval = setInterval(() => {
        setElapsed(calculateElapsed());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  const isActive = !endTime;

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg sm:text-xl font-bold transition-all"
      style={{
        backgroundColor: darkMode ? '#374151' : '#f3f4f6',
        color: isActive
          ? darkMode ? '#10b981' : '#059669'
          : darkMode ? '#9ca3af' : '#6b7280',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isActive
          ? darkMode ? '#10b981' : '#059669'
          : darkMode ? '#4b5563' : '#d1d5db',
      }}
      role="timer"
      aria-live="polite"
      aria-label={`Game timer: ${formatTime(elapsed)}`}
    >
      <Clock
        size={20}
        className={isActive ? 'animate-pulse' : ''}
        aria-hidden="true"
      />
      <span>{formatTime(elapsed)}</span>
      {!isActive && (
        <span
          className="text-xs font-normal ml-1"
          style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
        >
          (terminée)
        </span>
      )}
    </div>
  );
};

export default GameTimer;
