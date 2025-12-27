/**
 * Modal to create a new game
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (gameName: string, startTime: Date) => void;
  gameNumber: number;
  darkMode?: boolean;
}

const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onCreateGame,
  gameNumber,
  darkMode = false,
}) => {
  const defaultGameName = `Partie #${gameNumber}`;
  const [gameName, setGameName] = useState(defaultGameName);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize date and time when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setDateValue(format(now, 'yyyy-MM-dd'));
      setTimeValue(format(now, 'HH:mm'));
      setGameName(defaultGameName);

      // Focus on name input after modal opens
      setTimeout(() => {
        nameInputRef.current?.focus();
        nameInputRef.current?.select();
      }, 100);
    }
  }, [isOpen, defaultGameName]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time
    const [year, month, day] = dateValue.split('-').map(Number);
    const [hours, minutes] = timeValue.split(':').map(Number);

    const startTime = new Date(year, month - 1, day, hours, minutes);
    const finalGameName = gameName.trim() || defaultGameName;

    onCreateGame(finalGameName, startTime);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg shadow-2xl animate-scale-in"
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#f3f4f6' : '#111827',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderBottomColor: darkMode ? '#374151' : '#e5e7eb',
          }}
        >
          <h2
            id="modal-title"
            className="text-xl font-bold"
            style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          >
            Nouvelle partie
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#9ca3af' : '#6b7280',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Game Name */}
          <div className="mb-4">
            <label
              htmlFor="game-name"
              className="block text-sm font-semibold mb-2"
              style={{ color: darkMode ? '#d1d5db' : '#374151' }}
            >
              Nom de la partie
            </label>
            <input
              ref={nameInputRef}
              id="game-name"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder={defaultGameName}
              className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                borderColor: darkMode ? '#4b5563' : '#d1d5db',
                color: darkMode ? '#f3f4f6' : '#111827',
              }}
              aria-label="Game name"
              maxLength={50}
            />
            <p
              className="mt-1 text-xs"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              Laissez vide pour utiliser &quot;{defaultGameName}&quot;
            </p>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label
              htmlFor="game-date"
              className="block text-sm font-semibold mb-2"
              style={{ color: darkMode ? '#d1d5db' : '#374151' }}
            >
              Date
            </label>
            <div className="relative">
              <input
                id="game-date"
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db',
                  color: darkMode ? '#f3f4f6' : '#111827',
                  colorScheme: darkMode ? 'dark' : 'light',
                }}
                aria-label="Game date"
              />
              <Calendar
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Time */}
          <div className="mb-6">
            <label
              htmlFor="game-time"
              className="block text-sm font-semibold mb-2"
              style={{ color: darkMode ? '#d1d5db' : '#374151' }}
            >
              Heure
            </label>
            <input
              id="game-time"
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                borderColor: darkMode ? '#4b5563' : '#d1d5db',
                color: darkMode ? '#f3f4f6' : '#111827',
                colorScheme: darkMode ? 'dark' : 'light',
              }}
              aria-label="Game time"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#d1d5db' : '#374151',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2"
              style={{
                backgroundColor: darkMode ? '#10b981' : '#059669',
                color: '#ffffff',
              }}
            >
              <Play size={20} />
              Démarrer
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewGameModal;
