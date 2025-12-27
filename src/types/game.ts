/**
 * Core type definitions for Loto statistics application
 */

/**
 * Represents a single manche (round) within a partie
 */
export interface Manche {
  /** Unique identifier (UUID) */
  id: string;

  /** Manche number within the partie */
  mancheNumber: number;

  /** Start time in ISO format */
  startTime: string;

  /** End time in ISO format (optional, only when manche is finished) */
  endTime?: string;

  /** Numbers drawn in chronological order (1-90) */
  numbers: number[];

  /** Whether the manche is currently active */
  isActive: boolean;

  /** Position (1-based) when first quine was achieved */
  quineAt?: number;

  /** Position (1-based) when second quine was achieved */
  deuxiemeQuineAt?: number;

  /** Position (1-based) when double quine was achieved */
  doubleQuineAt?: number;

  /** Position (1-based) when carton plein was achieved */
  cartonPleinAt?: number;
}

/**
 * Represents a complete Loto partie (contains multiple manches)
 */
export interface LotoGame {
  /** Unique identifier (UUID) */
  id: string;

  /** Partie name (e.g., "Soirée du vendredi", "Partie #1") */
  name: string;

  /** Partie date in ISO format */
  date: string;

  /** Start time in ISO format */
  startTime: string;

  /** End time in ISO format (optional, only when partie is finished) */
  endTime?: string;

  /** All manches in this partie */
  manches: Manche[];

  /** Whether the partie is currently active */
  isActive: boolean;
}

/**
 * Number with timestamp for tracking when it was drawn
 */
export interface NumberWithTimestamp {
  number: number;
  timestamp: string;
  order: number; // Position in the drawing sequence
}

/**
 * Global statistics containing all games and aggregate data
 */
export interface GlobalStats {
  /** All games (active + completed) */
  games: LotoGame[];

  /** Frequency map: number -> count across all games */
  allTimeFrequency: Record<number, number>;

  /** Total number of games played */
  totalGamesPlayed: number;

  /** When the stats were first created */
  createdAt: string;

  /** When the stats were last updated */
  lastUpdated: string;
}

/**
 * Summary statistics for a game
 */
export interface GameSummary {
  id: string;
  name: string;
  date: string;
  numbersDrawn: number;
  totalNumbers: number;
  percentage: number;
  duration?: number; // Duration in milliseconds
  isActive: boolean;
}

/**
 * Frequency data for a specific number
 */
export interface FrequencyData {
  number: number;
  count: number;
  percentage: number;
  lastDrawn?: string; // ISO date of last occurrence
  games: string[]; // Game IDs where this number appeared
}

/**
 * Statistics by decade (1-10, 11-20, etc.)
 */
export interface DecadeStats {
  decade: string; // e.g., "1-10" (for chart compatibility)
  range: string; // e.g., "1-10"
  count: number;
  percentage: number;
  numbers: number[]; // Numbers in this decade that were drawn
}

/**
 * Comparison data between two or more games
 */
export interface GameComparison {
  games: GameSummary[];
  commonNumbers: number[];
  uniqueNumbers: Map<string, number[]>; // gameId -> unique numbers
  averageDrawnCount: number;
}

/**
 * Export/Import data structure
 */
export interface ExportData {
  version: string;
  exportDate: string;
  stats: GlobalStats;
  metadata?: Record<string, unknown>;
}

/**
 * CSV row for a single number draw
 */
export interface CSVNumberRow {
  gameId: string;
  gameName: string;
  number: number;
  order: number;
  timestamp: string;
}

/**
 * Theme preference
 */
export type Theme = 'light' | 'dark';

/**
 * App settings
 */
export interface AppSettings {
  theme: Theme;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoSaveInterval: number; // milliseconds
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Type guard to check if a value is a valid Manche
 */
export function isManche(value: unknown): value is Manche {
  if (typeof value !== 'object' || value === null) return false;

  const manche = value as Record<string, unknown>;

  return (
    typeof manche.id === 'string' &&
    typeof manche.mancheNumber === 'number' &&
    typeof manche.startTime === 'string' &&
    Array.isArray(manche.numbers) &&
    manche.numbers.every((n) => typeof n === 'number' && n >= 1 && n <= 90) &&
    typeof manche.isActive === 'boolean' &&
    (manche.endTime === undefined || typeof manche.endTime === 'string')
  );
}

/**
 * Type guard to check if a value is a valid LotoGame
 */
export function isLotoGame(value: unknown): value is LotoGame {
  if (typeof value !== 'object' || value === null) return false;

  const game = value as Record<string, unknown>;

  return (
    typeof game.id === 'string' &&
    typeof game.name === 'string' &&
    typeof game.date === 'string' &&
    typeof game.startTime === 'string' &&
    Array.isArray(game.manches) &&
    game.manches.every(isManche) &&
    typeof game.isActive === 'boolean' &&
    (game.endTime === undefined || typeof game.endTime === 'string')
  );
}

/**
 * Type guard to check if a value is valid GlobalStats
 */
export function isGlobalStats(value: unknown): value is GlobalStats {
  if (typeof value !== 'object' || value === null) return false;

  const stats = value as Record<string, unknown>;

  return (
    Array.isArray(stats.games) &&
    stats.games.every(isLotoGame) &&
    typeof stats.allTimeFrequency === 'object' &&
    typeof stats.totalGamesPlayed === 'number' &&
    typeof stats.createdAt === 'string' &&
    typeof stats.lastUpdated === 'string'
  );
}

/**
 * Readonly version of LotoGame for display purposes
 */
export type ReadonlyLotoGame = Readonly<LotoGame> & {
  readonly numbers: readonly number[];
};

/**
 * Readonly version of GlobalStats for display purposes
 */
export type ReadonlyGlobalStats = Readonly<Omit<GlobalStats, 'games'>> & {
  readonly games: readonly ReadonlyLotoGame[];
};
