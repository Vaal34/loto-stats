/**
 * Import utilities for Loto stats
 */

import { GlobalStats, isGlobalStats, ValidationResult } from '../types/game';
import { MAX_IMPORT_FILE_SIZE } from '../constants/config';

/**
 * Validate import file
 */
export function validateImportFile(file: File): ValidationResult {
  const errors: string[] = [];

  // Check file size
  if (file.size > MAX_IMPORT_FILE_SIZE) {
    errors.push(`File size exceeds maximum (${MAX_IMPORT_FILE_SIZE / 1024 / 1024}MB)`);
  }

  // Check file type
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    errors.push('File must be a JSON file');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parse imported JSON
 */
export async function parseImportedJSON(file: File): Promise<GlobalStats | null> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    // Check if it's an ExportData structure
    if (parsed.stats && isGlobalStats(parsed.stats)) {
      return parsed.stats as GlobalStats;
    }

    // Check if it's a direct GlobalStats
    if (isGlobalStats(parsed)) {
      return parsed as GlobalStats;
    }

    console.error('Invalid data structure');
    return null;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

/**
 * Merge imported stats with existing stats
 */
export function mergeStats(
  existing: GlobalStats,
  imported: GlobalStats
): GlobalStats {
  // Create a map of existing games by ID
  const existingGamesMap = new Map(existing.games.map((g) => [g.id, g]));

  // Add/update games from imported data
  const mergedGames = [...existing.games];
  let addedCount = 0;

  imported.games.forEach((importedGame) => {
    if (!existingGamesMap.has(importedGame.id)) {
      mergedGames.push(importedGame);
      addedCount++;
    }
  });

  // Recalculate frequency
  const allTimeFrequency: Record<number, number> = {};
  mergedGames.forEach((game) => {
    // Iterate all numbers from all manches
    game.manches.forEach((manche) => {
      manche.numbers.forEach(num => {
        allTimeFrequency[num] = (allTimeFrequency[num] || 0) + 1;
      });
    });
  });

  return {
    games: mergedGames,
    allTimeFrequency,
    totalGamesPlayed: mergedGames.length,
    createdAt: existing.createdAt, // Keep original creation date
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Import from file
 */
export async function importFromFile(
  file: File,
  mergeWithExisting: boolean,
  existingStats: GlobalStats
): Promise<{ success: boolean; stats?: GlobalStats; error?: string }> {
  // Validate file
  const validation = validateImportFile(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', '),
    };
  }

  // Parse JSON
  const importedStats = await parseImportedJSON(file);
  if (!importedStats) {
    return {
      success: false,
      error: 'Invalid file format',
    };
  }

  // Merge or replace
  const finalStats = mergeWithExisting
    ? mergeStats(existingStats, importedStats)
    : importedStats;

  return {
    success: true,
    stats: finalStats,
  };
}
