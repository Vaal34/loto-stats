/**
 * Hook for managing the active game state
 */

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LotoGame, GlobalStats } from '../types/game';
import { updateFrequency } from '../utils/storage';

interface UseGameStateReturn {
  activeGame: LotoGame | null;
  startNewGame: (name?: string) => void;
  endGame: () => void;
  addNumber: (number: number) => boolean;
  removeNumber: (number: number) => boolean;
  removeLastNumber: () => boolean;
  isNumberDrawn: (number: number) => boolean;
  getGameDuration: () => number | null;
}

export function useGameState(
  globalStats: GlobalStats,
  setGlobalStats: (stats: GlobalStats | ((prev: GlobalStats) => GlobalStats)) => void
): UseGameStateReturn {
  // Find active game from globalStats
  const [activeGame, setActiveGame] = useState<LotoGame | null>(() => {
    return globalStats.games.find((g) => g.isActive) || null;
  });

  // Sync activeGame when globalStats changes
  useEffect(() => {
    const active = globalStats.games.find((g) => g.isActive) || null;
    setActiveGame(active);
  }, [globalStats]);

  /**
   * Start a new game
   */
  const startNewGame = useCallback(
    (name?: string) => {
      const existingActive = globalStats.games.find((g) => g.isActive);

      if (existingActive) {
        const confirm = window.confirm(
          'Une partie est déjà en cours. Voulez-vous la terminer et en créer une nouvelle ?'
        );

        if (!confirm) {
          return;
        }

        // End existing game
        setGlobalStats((prev) => ({
          ...prev,
          games: prev.games.map((g) =>
            g.id === existingActive.id
              ? { ...g, isActive: false, endTime: new Date().toISOString() }
              : g
          ),
        }));
      }

      const now = new Date().toISOString();
      const gameNumber = globalStats.totalGamesPlayed + 1;

      const newGame: LotoGame = {
        id: uuidv4(),
        name: name || `Partie #${gameNumber}`,
        date: now,
        startTime: now,
        numbers: [],
        isActive: true,
      };

      setGlobalStats((prev) => ({
        ...prev,
        games: [...prev.games, newGame],
        totalGamesPlayed: prev.totalGamesPlayed + 1,
      }));

      setActiveGame(newGame);
    },
    [globalStats, setGlobalStats]
  );

  /**
   * End the current game
   */
  const endGame = useCallback(() => {
    if (!activeGame) {
      return;
    }

    setGlobalStats((prev) => ({
      ...prev,
      games: prev.games.map((g) =>
        g.id === activeGame.id
          ? { ...g, isActive: false, endTime: new Date().toISOString() }
          : g
      ),
    }));

    setActiveGame(null);
  }, [activeGame, setGlobalStats]);

  /**
   * Add a number to the active game
   */
  const addNumber = useCallback(
    (number: number): boolean => {
      if (!activeGame) {
        console.error('No active game');
        return false;
      }

      if (number < 1 || number > 90) {
        console.error('Number must be between 1 and 90');
        return false;
      }

      if (activeGame.numbers.includes(number)) {
        console.error(`Number ${number} already drawn`);
        return false;
      }

      setGlobalStats((prev) => {
        const updatedGames = prev.games.map((g) =>
          g.id === activeGame.id ? { ...g, numbers: [...g.numbers, number] } : g
        );

        return {
          ...prev,
          games: updatedGames,
          allTimeFrequency: updateFrequency(prev.allTimeFrequency, [number], true),
        };
      });

      return true;
    },
    [activeGame, setGlobalStats]
  );

  /**
   * Remove a number from the active game
   */
  const removeNumber = useCallback(
    (number: number): boolean => {
      if (!activeGame) {
        console.error('No active game');
        return false;
      }

      if (!activeGame.numbers.includes(number)) {
        console.error(`Number ${number} not in current game`);
        return false;
      }

      const confirm = window.confirm(
        `Voulez-vous vraiment retirer le numéro ${number} ?`
      );

      if (!confirm) {
        return false;
      }

      setGlobalStats((prev) => {
        const updatedGames = prev.games.map((g) =>
          g.id === activeGame.id
            ? { ...g, numbers: g.numbers.filter((n) => n !== number) }
            : g
        );

        return {
          ...prev,
          games: updatedGames,
          allTimeFrequency: updateFrequency(prev.allTimeFrequency, [number], false),
        };
      });

      return true;
    },
    [activeGame, setGlobalStats]
  );

  /**
   * Remove the last number drawn
   */
  const removeLastNumber = useCallback((): boolean => {
    if (!activeGame || activeGame.numbers.length === 0) {
      return false;
    }

    const lastNumber = activeGame.numbers[activeGame.numbers.length - 1];

    setGlobalStats((prev) => {
      const updatedGames = prev.games.map((g) =>
        g.id === activeGame.id ? { ...g, numbers: g.numbers.slice(0, -1) } : g
      );

      return {
        ...prev,
        games: updatedGames,
        allTimeFrequency: updateFrequency(prev.allTimeFrequency, [lastNumber], false),
      };
    });

    return true;
  }, [activeGame, setGlobalStats]);

  /**
   * Check if a number has been drawn in the active game
   */
  const isNumberDrawn = useCallback(
    (number: number): boolean => {
      return activeGame?.numbers.includes(number) || false;
    },
    [activeGame]
  );

  /**
   * Get the duration of the active game in milliseconds
   */
  const getGameDuration = useCallback((): number | null => {
    if (!activeGame) {
      return null;
    }

    const start = new Date(activeGame.startTime).getTime();
    const end = activeGame.endTime
      ? new Date(activeGame.endTime).getTime()
      : Date.now();

    return end - start;
  }, [activeGame]);

  return {
    activeGame,
    startNewGame,
    endGame,
    addNumber,
    removeNumber,
    removeLastNumber,
    isNumberDrawn,
    getGameDuration,
  };
}
