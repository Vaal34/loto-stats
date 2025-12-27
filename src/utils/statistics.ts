/**
 * Statistical calculations for Loto data
 */

import { LotoGame, GameSummary } from '../types/game';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Calculate game duration in milliseconds
 */
export function calculateGameDuration(game: LotoGame): number | null {
  if (!game.startTime) return null;

  const start = new Date(game.startTime).getTime();
  const end = game.endTime ? new Date(game.endTime).getTime() : Date.now();

  return end - start;
}

/**
 * Format duration as HH:MM:SS
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':');
}

/**
 * Format relative time (e.g., "il y a 5 minutes")
 */
export function formatRelativeTime(date: string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  } catch {
    return 'Date invalide';
  }
}

/**
 * Get game summary
 */
export function getGameSummary(game: LotoGame): GameSummary {
  const duration = calculateGameDuration(game);

  return {
    id: game.id,
    name: game.name,
    date: game.date,
    numbersDrawn: game.numbers.length,
    totalNumbers: 90,
    percentage: (game.numbers.length / 90) * 100,
    duration: duration || undefined,
    isActive: game.isActive,
  };
}

/**
 * Calculate average numbers per game
 */
export function calculateAverageNumbersPerGame(games: LotoGame[]): number {
  if (games.length === 0) return 0;

  const total = games.reduce((sum, game) => sum + game.numbers.length, 0);
  return total / games.length;
}

/**
 * Calculate average game duration
 */
export function calculateAverageDuration(games: LotoGame[]): number {
  const completedGames = games.filter((g) => !g.isActive && g.endTime);

  if (completedGames.length === 0) return 0;

  const total = completedGames.reduce((sum, game) => {
    const duration = calculateGameDuration(game);
    return sum + (duration || 0);
  }, 0);

  return total / completedGames.length;
}

/**
 * Find common numbers between games
 */
export function findCommonNumbers(games: LotoGame[]): number[] {
  if (games.length === 0) return [];

  const numberSets = games.map((game) => new Set(game.numbers));
  const firstSet = numberSets[0];

  return Array.from(firstSet).filter((num) =>
    numberSets.every((set) => set.has(num))
  );
}

/**
 * Find unique numbers in a game (not in other games)
 */
export function findUniqueNumbers(
  targetGame: LotoGame,
  otherGames: LotoGame[]
): number[] {
  const otherNumbers = new Set(
    otherGames.flatMap((game) => game.numbers)
  );

  return targetGame.numbers.filter((num) => !otherNumbers.has(num));
}

/**
 * Get most recent games
 */
export function getMostRecentGames(games: LotoGame[], count: number = 10): LotoGame[] {
  return [...games]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * Search games by name or date
 */
export function searchGames(games: LotoGame[], query: string): LotoGame[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return games;

  return games.filter((game) => {
    const nameMatch = game.name.toLowerCase().includes(lowerQuery);
    const dateMatch = game.date.includes(lowerQuery);
    const idMatch = game.id.toLowerCase().includes(lowerQuery);

    return nameMatch || dateMatch || idMatch;
  });
}

/**
 * Sort games
 */
export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'numbers-desc' | 'numbers-asc';

export function sortGames(games: LotoGame[], sortBy: SortOption): LotoGame[] {
  const sorted = [...games];

  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'numbers-desc':
      return sorted.sort((a, b) => b.numbers.length - a.numbers.length);
    case 'numbers-asc':
      return sorted.sort((a, b) => a.numbers.length - b.numbers.length);
    default:
      return sorted;
  }
}
