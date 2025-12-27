/**
 * Chronological list of drawn numbers with timestamps
 */

import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ListOrdered } from 'lucide-react';

interface NumbersListProps {
  numbers: number[];
  startTime: Date;
  darkMode?: boolean;
}

const NumbersList: React.FC<NumbersListProps> = ({
  numbers,
  startTime,
  darkMode = false,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(numbers.length);

  // Auto-scroll to bottom when new number is added
  useEffect(() => {
    if (numbers.length > lastCountRef.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    lastCountRef.current = numbers.length;
  }, [numbers.length]);

  const getTimestamp = (index: number): string => {
    // Calculate approximate time based on start time and index
    // Assuming each number takes about 30 seconds on average
    const estimatedTime = new Date(startTime.getTime() + (index * 30 * 1000));
    return format(estimatedTime, 'HH:mm:ss', { locale: fr });
  };

  if (numbers.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed"
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
          borderColor: darkMode ? '#4b5563' : '#d1d5db',
          color: darkMode ? '#9ca3af' : '#6b7280',
        }}
      >
        <ListOrdered size={48} className="mb-2 opacity-50" />
        <p className="text-sm font-medium">Aucun numéro tiré</p>
        <p className="text-xs mt-1">Les numéros tirés apparaîtront ici</p>
      </div>
    );
  }

  // Show last 15 numbers, but keep scrollable for all
  const displayNumbers = numbers.length > 15
    ? numbers.slice(-15)
    : numbers;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <ListOrdered
          size={20}
          style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
        />
        <h3
          className="font-semibold text-sm sm:text-base"
          style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
        >
          Derniers numéros tirés ({numbers.length})
        </h3>
      </div>

      <div
        ref={listRef}
        className="rounded-lg border-2 overflow-y-auto scroll-smooth"
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderColor: darkMode ? '#4b5563' : '#d1d5db',
          maxHeight: '400px',
        }}
        role="list"
        aria-label="List of drawn numbers"
      >
        {displayNumbers.map((number, idx) => {
          const absoluteIndex = numbers.length > 15
            ? numbers.length - displayNumbers.length + idx
            : idx;

          const isLatest = absoluteIndex === numbers.length - 1;

          return (
            <div
              key={`${number}-${absoluteIndex}`}
              className="flex items-center gap-3 px-4 py-3 border-b transition-all"
              style={{
                backgroundColor: isLatest
                  ? darkMode ? '#065f46' : '#d1fae5'
                  : darkMode ? '#1f2937' : '#ffffff',
                borderBottomColor: darkMode ? '#374151' : '#e5e7eb',
                borderBottomWidth: absoluteIndex === numbers.length - 1 ? '0' : '1px',
              }}
              role="listitem"
              aria-label={`Number ${absoluteIndex + 1}: ${number}, drawn at ${getTimestamp(absoluteIndex)}`}
            >
              {/* Order number */}
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm"
                style={{
                  backgroundColor: isLatest
                    ? darkMode ? '#10b981' : '#059669'
                    : darkMode ? '#374151' : '#f3f4f6',
                  color: isLatest
                    ? '#ffffff'
                    : darkMode ? '#9ca3af' : '#6b7280',
                }}
                aria-hidden="true"
              >
                #{absoluteIndex + 1}
              </div>

              {/* Number */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-lg font-bold text-xl border-2"
                style={{
                  backgroundColor: isLatest
                    ? darkMode ? '#10b981' : '#10b981'
                    : darkMode ? '#374151' : '#f9fafb',
                  borderColor: isLatest
                    ? darkMode ? '#059669' : '#047857'
                    : darkMode ? '#4b5563' : '#d1d5db',
                  color: isLatest
                    ? '#ffffff'
                    : darkMode ? '#f3f4f6' : '#111827',
                }}
              >
                {number}
              </div>

              {/* Timestamp */}
              <div className="flex-1 text-right">
                <div
                  className="font-mono text-sm font-medium"
                  style={{
                    color: isLatest
                      ? darkMode ? '#10b981' : '#059669'
                      : darkMode ? '#9ca3af' : '#6b7280',
                  }}
                >
                  {getTimestamp(absoluteIndex)}
                </div>
              </div>

              {/* Latest indicator */}
              {isLatest && (
                <div
                  className="px-2 py-1 rounded-full text-xs font-semibold animate-pulse"
                  style={{
                    backgroundColor: darkMode ? '#10b981' : '#059669',
                    color: '#ffffff',
                  }}
                  aria-label="Latest number"
                >
                  Dernier
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll indicator if more than 15 */}
      {numbers.length > 15 && (
        <div
          className="mt-2 text-xs text-center"
          style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
        >
          Défilez pour voir tous les {numbers.length} numéros
        </div>
      )}
    </div>
  );
};

export default NumbersList;
