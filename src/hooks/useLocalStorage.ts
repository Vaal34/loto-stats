/**
 * Generic hook for localStorage with React state sync
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validator?: (value: unknown) => value is T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return initialValue;
      }

      const parsed = JSON.parse(item);

      // Validate if validator provided
      if (validator && !validator(parsed)) {
        console.warn(`Invalid stored value for key "${key}", using initial value`);
        return initialValue;
      }

      return parsed;
    } catch (error) {
      console.error(`Error loading from localStorage (key: ${key}):`, error);
      return initialValue;
    }
  });

  const [isSaved, setIsSaved] = useState(true);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        setIsSaved(false);

        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Mark as saved after a brief delay
        setTimeout(() => setIsSaved(true), 100);
      } catch (error) {
        console.error(`Error saving to localStorage (key: ${key}):`, error);
        setIsSaved(true);
      }
    },
    [key, storedValue]
  );

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);

          if (validator && !validator(parsed)) {
            console.warn(`Invalid storage event value for key "${key}"`);
            return;
          }

          setStoredValue(parsed);
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, validator]);

  return [storedValue, setValue, isSaved];
}
