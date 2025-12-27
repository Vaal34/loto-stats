/**
 * Fast number input component for quick number entry
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';

interface QuickInputProps {
  onSubmit: (number: number) => void;
  drawnNumbers: number[];
  darkMode?: boolean;
}

const QuickInput: React.FC<QuickInputProps> = ({
  onSubmit,
  drawnNumbers,
  darkMode = false,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateAndSubmit = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError('Veuillez entrer un numéro');
      return;
    }

    const num = parseInt(trimmedValue, 10);

    if (isNaN(num)) {
      setError('Veuillez entrer un nombre valide');
      setValue('');
      inputRef.current?.focus();
      return;
    }

    if (num < 1 || num > 90) {
      setError('Le numéro doit être entre 1 et 90');
      setValue('');
      inputRef.current?.focus();
      return;
    }

    if (drawnNumbers.includes(num)) {
      setError(`Le numéro ${num} a déjà été tiré`);
      setValue('');
      inputRef.current?.focus();
      return;
    }

    // Valid number - submit it
    onSubmit(num);
    setValue('');
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateAndSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow numbers
    if (newValue && !/^\d+$/.test(newValue)) {
      return;
    }

    // Limit to 2 digits
    if (newValue.length > 2) {
      return;
    }

    setValue(newValue);
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Entrez un numéro (1-90)"
            className="w-full px-4 py-3 rounded-lg border-2 font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              borderColor: error
                ? '#ef4444'
                : darkMode ? '#4b5563' : '#d1d5db',
              color: darkMode ? '#f3f4f6' : '#111827',
              ...(darkMode && { focusRingColor: '#3b82f6' }),
            }}
            aria-label="Quick number input"
            aria-invalid={!!error}
            aria-describedby={error ? 'input-error' : undefined}
            autoComplete="off"
          />
        </div>

        <button
          onClick={validateAndSubmit}
          className="px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
            color: '#ffffff',
          }}
          disabled={!value}
          aria-label="Submit number"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          id="input-error"
          className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse"
          style={{
            backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
            color: darkMode ? '#fca5a5' : '#991b1b',
          }}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={16} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Instructions */}
      <div
        className="mt-2 text-xs sm:text-sm"
        style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
      >
        Tapez un numéro et appuyez sur Entrée ou cliquez sur le bouton
      </div>
    </div>
  );
};

export default QuickInput;
