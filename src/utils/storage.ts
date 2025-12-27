/**
 * LocalStorage utility functions
 */

import { GlobalStats, isGlobalStats, LotoGame } from '../types/game';
import { STORAGE_KEY } from '../constants/config';

/**
 * Initialize empty global stats
 */
export function initializeGlobalStats(): GlobalStats {
  return {
    games: [],
    allTimeFrequency: {},
    totalGamesPlayed: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Load global stats from localStorage
 */
export function loadGlobalStats(): GlobalStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initializeGlobalStats();
    }

    const parsed = JSON.parse(stored);

    if (!isGlobalStats(parsed)) {
      console.error('Invalid stored data format, initializing new stats');
      return initializeGlobalStats();
    }

    return parsed;
  } catch (error) {
    console.error('Error loading stats from localStorage:', error);
    return initializeGlobalStats();
  }
}

/**
 * Save global stats to localStorage
 */
export function saveGlobalStats(stats: GlobalStats): boolean {
  try {
    const statsWithTimestamp: GlobalStats = {
      ...stats,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(statsWithTimestamp));
    return true;
  } catch (error) {
    console.error('Error saving stats to localStorage:', error);

    // Check if quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded!');
      // Could implement cleanup strategy here
    }

    return false;
  }
}

/**
 * Clear all stats from localStorage
 */
export function clearGlobalStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Get localStorage usage in bytes
 */
export function getStorageSize(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Blob([stored]).size : 0;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Update frequency map when numbers are added/removed
 */
export function updateFrequency(
  frequency: Record<number, number>,
  numbers: number[],
  increment: boolean = true
): Record<number, number> {
  const newFrequency = { ...frequency };

  numbers.forEach((num) => {
    if (increment) {
      newFrequency[num] = (newFrequency[num] || 0) + 1;
    } else {
      newFrequency[num] = Math.max((newFrequency[num] || 0) - 1, 0);
      if (newFrequency[num] === 0) {
        delete newFrequency[num];
      }
    }
  });

  return newFrequency;
}

/**
 * Recalculate all-time frequency from scratch
 */
export function recalculateFrequency(games: LotoGame[]): Record<number, number> {
  const frequency: Record<number, number> = {};

  games.forEach((game) => {
    game.numbers.forEach((num) => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
  });

  return frequency;
}

/**
 * Create a backup of current stats
 */
export function createBackup(): string | null {
  try {
    const stats = loadGlobalStats();
    return JSON.stringify({
      version: '1.0.0',
      backupDate: new Date().toISOString(),
      stats,
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
}

/**
 * Restore from backup
 */
export function restoreFromBackup(backupJson: string): boolean {
  try {
    const backup = JSON.parse(backupJson);

    if (!backup.stats || !isGlobalStats(backup.stats)) {
      console.error('Invalid backup format');
      return false;
    }

    saveGlobalStats(backup.stats);
    return true;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
}
