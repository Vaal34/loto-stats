/**
 * Hook for managing the active game state (Partie and Manche)
 */

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LotoGame, Manche, GlobalStats } from '../types/game';
import { updateFrequency } from '../utils/storage';

interface UseGameStateReturn {
  activeGame: LotoGame | null;
  activeManche: Manche | null;
  startNewGame: (name?: string) => void;
  endGame: () => void;
  deleteGame: (gameId: string) => void;
  resumeGame: (gameId: string) => void;
  startNewManche: () => void;
  endManche: () => void;
  addNumber: (number: number) => boolean;
  removeNumber: (number: number) => boolean;
  removeLastNumber: () => boolean;
  isNumberDrawn: (number: number) => boolean;
  getGameDuration: () => number | null;
  getMancheDuration: () => number | null;
  markMilestone: (type: 'quine' | 'deuxieme-quine' | 'double-quine' | 'carton-plein', position?: number) => boolean;
  clearMilestone: (type: 'quine' | 'deuxieme-quine' | 'double-quine' | 'carton-plein') => boolean;
}

export function useGameState(
  globalStats: GlobalStats,
  setGlobalStats: (stats: GlobalStats | ((prev: GlobalStats) => GlobalStats)) => void
): UseGameStateReturn {
  // Find active game (partie) from globalStats
  const [activeGame, setActiveGame] = useState<LotoGame | null>(() => {
    return globalStats.games.find((g) => g.isActive) || null;
  });

  // Find active manche within the active game
  const [activeManche, setActiveManche] = useState<Manche | null>(() => {
    const game = globalStats.games.find((g) => g.isActive);
    return game?.manches.find((m) => m.isActive) || null;
  });

  // Sync activeGame and activeManche when globalStats changes
  useEffect(() => {
    // Check if there are multiple active games (data corruption)
    const activeGames = globalStats.games.filter((g) => g.isActive);

    if (activeGames.length > 1) {
      console.warn('Multiple active games detected! Fixing...');
      // Keep only the most recent active game
      const mostRecent = activeGames.reduce((latest, game) =>
        new Date(game.startTime) > new Date(latest.startTime) ? game : latest
      );

      setGlobalStats((prev) => ({
        ...prev,
        games: prev.games.map((g) =>
          g.isActive && g.id !== mostRecent.id
            ? { ...g, isActive: false, endTime: g.endTime || new Date().toISOString() }
            : g
        ),
      }));

      setActiveGame(mostRecent);
    } else {
      const active = activeGames[0] || null;
      setActiveGame(active);
    }

    const active = globalStats.games.find((g) => g.isActive) || null;
    const manche = active?.manches.find((m) => m.isActive) || null;
    setActiveManche(manche);
  }, [globalStats, setGlobalStats]);

  /**
   * Start a new partie
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
      }

      const now = new Date().toISOString();
      const gameNumber = globalStats.totalGamesPlayed + 1;

      const newGame: LotoGame = {
        id: uuidv4(),
        name: name || `Partie #${gameNumber}`,
        date: now,
        startTime: now,
        manches: [],
        isActive: true,
      };

      // End existing partie and create new game in one operation
      setGlobalStats((prev) => ({
        ...prev,
        games: [
          ...prev.games.map((g) =>
            g.isActive
              ? {
                  ...g,
                  isActive: false,
                  endTime: now,
                  manches: g.manches.map((m) => ({
                    ...m,
                    isActive: false,
                    endTime: m.endTime || now,
                  })),
                }
              : g
          ),
          newGame,
        ],
        totalGamesPlayed: prev.totalGamesPlayed + 1,
      }));

      setActiveGame(newGame);
      setActiveManche(null);
    },
    [globalStats, setGlobalStats]
  );

  /**
   * End the current partie
   */
  const endGame = useCallback(() => {
    if (!activeGame) {
      alert('Aucune partie active à terminer.');
      return;
    }

    // End active manche if exists
    setGlobalStats((prev) => ({
      ...prev,
      games: prev.games.map((g) =>
        g.id === activeGame.id
          ? {
              ...g,
              isActive: false,
              endTime: new Date().toISOString(),
              manches: g.manches.map((m) => ({
                ...m,
                isActive: false,
                endTime: m.endTime || new Date().toISOString(),
              })),
            }
          : g
      ),
    }));

    setActiveGame(null);
    setActiveManche(null);
  }, [activeGame, setGlobalStats]);

  /**
   * Delete a partie
   */
  const deleteGame = useCallback(
    (gameId: string) => {
      const gameToDelete = globalStats.games.find((g) => g.id === gameId);

      if (!gameToDelete) {
        alert('Partie introuvable.');
        return;
      }

      const confirm = window.confirm(
        `Voulez-vous vraiment supprimer la partie "${gameToDelete.name}" ? Cette action est irréversible.`
      );

      if (!confirm) {
        return;
      }

      setGlobalStats((prev) => ({
        ...prev,
        games: prev.games.filter((g) => g.id !== gameId),
      }));

      // If we deleted the active game, clear the state
      if (activeGame?.id === gameId) {
        setActiveGame(null);
        setActiveManche(null);
      }
    },
    [globalStats.games, activeGame, setGlobalStats]
  );

  /**
   * Resume (reactivate) an existing partie
   */
  const resumeGame = useCallback(
    (gameId: string) => {
      const gameToResume = globalStats.games.find((g) => g.id === gameId);

      if (!gameToResume) {
        alert('Partie introuvable.');
        return;
      }

      // Check if there's already an active game
      const existingActive = globalStats.games.find((g) => g.isActive);

      if (existingActive && existingActive.id !== gameId) {
        const confirm = window.confirm(
          `Une partie "${existingActive.name}" est déjà en cours. Voulez-vous la terminer et reprendre "${gameToResume.name}" ?`
        );

        if (!confirm) {
          return;
        }
      }

      // End existing partie and reactivate the selected game in one operation
      setGlobalStats((prev) => ({
        ...prev,
        games: prev.games.map((g) => {
          if (g.id === gameId) {
            // Reactivate this game
            return {
              ...g,
              isActive: true,
              endTime: undefined, // Clear end time since we're resuming
            };
          } else if (g.isActive) {
            // Deactivate any other active game
            return {
              ...g,
              isActive: false,
              endTime: new Date().toISOString(),
              manches: g.manches.map((m) => ({
                ...m,
                isActive: false,
                endTime: m.endTime || new Date().toISOString(),
              })),
            };
          }
          return g;
        }),
      }));

      setActiveGame(gameToResume);
      setActiveManche(null);
    },
    [globalStats.games, setGlobalStats]
  );

  /**
   * Start a new manche within the current partie
   */
  const startNewManche = useCallback(() => {
    if (!activeGame) {
      alert('Aucune partie active. Créez une nouvelle partie pour commencer.');
      return;
    }

    const existingActiveManche = activeGame.manches.find((m) => m.isActive);

    if (existingActiveManche) {
      const confirm = window.confirm(
        'Une manche est déjà en cours. Voulez-vous la terminer et en créer une nouvelle ?'
      );

      if (!confirm) {
        return;
      }
    }

    const now = new Date().toISOString();
    const mancheNumber = activeGame.manches.length + 1;

    const newManche: Manche = {
      id: uuidv4(),
      mancheNumber,
      startTime: now,
      numbers: [],
      isActive: true,
    };

    setGlobalStats((prev) => ({
      ...prev,
      games: prev.games.map((g) =>
        g.id === activeGame.id
          ? {
              ...g,
              manches: [
                ...g.manches.map((m) => ({
                  ...m,
                  isActive: false,
                  endTime: m.endTime || now,
                })),
                newManche,
              ],
            }
          : g
      ),
    }));

    setActiveManche(newManche);
  }, [activeGame, setGlobalStats]);

  /**
   * End the current manche
   */
  const endManche = useCallback(() => {
    if (!activeManche || !activeGame) {
      alert('Aucune manche active à terminer.');
      return;
    }

    setGlobalStats((prev) => ({
      ...prev,
      games: prev.games.map((g) =>
        g.id === activeGame.id
          ? {
              ...g,
              manches: g.manches.map((m) =>
                m.id === activeManche.id
                  ? { ...m, isActive: false, endTime: new Date().toISOString() }
                  : m
              ),
            }
          : g
      ),
    }));

    setActiveManche(null);
  }, [activeManche, activeGame, setGlobalStats]);

  /**
   * Add a number to the active manche
   */
  const addNumber = useCallback(
    (number: number): boolean => {
      if (!activeGame) {
        console.error('No active partie');
        alert('Erreur : Aucune partie active.');
        return false;
      }

      if (!activeManche) {
        alert('Aucune manche active. Créez une nouvelle manche pour commencer.');
        return false;
      }

      // Validation: number must be between 1 and 90
      if (number < 1 || number > 90) {
        console.error('Number must be between 1 and 90');
        alert(`Erreur : Le numéro doit être entre 1 et 90. Vous avez saisi : ${number}`);
        return false;
      }

      // Validation: number must not already be drawn in this manche
      if (activeManche.numbers.includes(number)) {
        console.error(`Number ${number} already drawn in this manche`);
        alert(`Le numéro ${number} a déjà été tiré dans cette manche.`);
        return false;
      }

      // Safety check: warn if all 90 numbers have been drawn
      if (activeManche.numbers.length >= 90) {
        alert('Tous les 90 numéros ont déjà été tirés dans cette manche !');
        return false;
      }

      setGlobalStats((prev) => {
        const updatedGames = prev.games.map((g) =>
          g.id === activeGame.id
            ? {
                ...g,
                manches: g.manches.map((m) =>
                  m.id === activeManche.id
                    ? { ...m, numbers: [...m.numbers, number] }
                    : m
                ),
              }
            : g
        );

        return {
          ...prev,
          games: updatedGames,
          allTimeFrequency: updateFrequency(prev.allTimeFrequency, [number], true),
        };
      });

      return true;
    },
    [activeGame, activeManche, setGlobalStats]
  );

  /**
   * Remove a number from the active manche
   */
  const removeNumber = useCallback(
    (number: number): boolean => {
      if (!activeGame) {
        console.error('No active partie');
        return false;
      }

      if (!activeManche) {
        console.error('No active manche');
        return false;
      }

      if (!activeManche.numbers.includes(number)) {
        console.error(`Number ${number} not in current manche`);
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
            ? {
                ...g,
                manches: g.manches.map((m) =>
                  m.id === activeManche.id
                    ? { ...m, numbers: m.numbers.filter((n) => n !== number) }
                    : m
                ),
              }
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
    [activeGame, activeManche, setGlobalStats]
  );

  /**
   * Remove the last number drawn in the active manche
   */
  const removeLastNumber = useCallback((): boolean => {
    if (!activeGame || !activeManche || activeManche.numbers.length === 0) {
      return false;
    }

    const lastNumber = activeManche.numbers[activeManche.numbers.length - 1];

    setGlobalStats((prev) => {
      const updatedGames = prev.games.map((g) =>
        g.id === activeGame.id
          ? {
              ...g,
              manches: g.manches.map((m) =>
                m.id === activeManche.id
                  ? { ...m, numbers: m.numbers.slice(0, -1) }
                  : m
              ),
            }
          : g
      );

      return {
        ...prev,
        games: updatedGames,
        allTimeFrequency: updateFrequency(prev.allTimeFrequency, [lastNumber], false),
      };
    });

    return true;
  }, [activeGame, activeManche, setGlobalStats]);

  /**
   * Check if a number has been drawn in the active manche
   */
  const isNumberDrawn = useCallback(
    (number: number): boolean => {
      return activeManche?.numbers.includes(number) || false;
    },
    [activeManche]
  );

  /**
   * Get the duration of the active partie in milliseconds
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

  /**
   * Get the duration of the active manche in milliseconds
   */
  const getMancheDuration = useCallback((): number | null => {
    if (!activeManche) {
      return null;
    }

    const start = new Date(activeManche.startTime).getTime();
    const end = activeManche.endTime
      ? new Date(activeManche.endTime).getTime()
      : Date.now();

    return end - start;
  }, [activeManche]);

  /**
   * Mark a milestone at the current position or at a specific position
   */
  const markMilestone = useCallback(
    (type: 'quine' | 'deuxieme-quine' | 'double-quine' | 'carton-plein', position?: number): boolean => {
      if (!activeGame || !activeManche) {
        console.error('No active game or manche');
        alert('Erreur : Aucune partie ou manche active.');
        return false;
      }

      // Use provided position or current position
      const targetPosition = position !== undefined ? position : activeManche.numbers.length;

      if (targetPosition === 0) {
        alert('Position invalide. La position doit être au moins 1.');
        return false;
      }

      // Validate position is within bounds
      if (targetPosition > activeManche.numbers.length) {
        alert(`Position invalide. Maximum actuel: ${activeManche.numbers.length}`);
        return false;
      }

      // Map type to field name
      const fieldNameMap: Record<string, keyof Manche> = {
        'quine': 'quineAt',
        'deuxieme-quine': 'deuxiemeQuineAt',
        'double-quine': 'doubleQuineAt',
        'carton-plein': 'cartonPleinAt',
      };
      const fieldName = fieldNameMap[type];

      if (activeManche[fieldName] && position === undefined) {
        // Only alert if marking at current position (not retroactive edit)
        alert(`Ce gain a déjà été marqué au ${activeManche[fieldName]}ème numéro.`);
        return false;
      }

      setGlobalStats((prev) => ({
        ...prev,
        games: prev.games.map((g) =>
          g.id === activeGame.id
            ? {
                ...g,
                manches: g.manches.map((m) =>
                  m.id === activeManche.id
                    ? { ...m, [fieldName]: targetPosition }
                    : m
                ),
              }
            : g
        ),
      }));

      return true;
    },
    [activeGame, activeManche, setGlobalStats]
  );

  /**
   * Clear a milestone
   */
  const clearMilestone = useCallback(
    (type: 'quine' | 'deuxieme-quine' | 'double-quine' | 'carton-plein'): boolean => {
      if (!activeGame || !activeManche) {
        console.error('No active game or manche');
        return false;
      }

      // Map type to field name
      const fieldNameMap: Record<string, keyof Manche> = {
        'quine': 'quineAt',
        'deuxieme-quine': 'deuxiemeQuineAt',
        'double-quine': 'doubleQuineAt',
        'carton-plein': 'cartonPleinAt',
      };
      const fieldName = fieldNameMap[type];

      setGlobalStats((prev) => ({
        ...prev,
        games: prev.games.map((g) =>
          g.id === activeGame.id
            ? {
                ...g,
                manches: g.manches.map((m) =>
                  m.id === activeManche.id
                    ? { ...m, [fieldName]: undefined }
                    : m
                ),
              }
            : g
        ),
      }));

      return true;
    },
    [activeGame, activeManche, setGlobalStats]
  );

  return {
    activeGame,
    activeManche,
    startNewGame,
    endGame,
    deleteGame,
    resumeGame,
    startNewManche,
    endManche,
    addNumber,
    removeNumber,
    removeLastNumber,
    isNumberDrawn,
    getGameDuration,
    getMancheDuration,
    markMilestone,
    clearMilestone,
  };
}
