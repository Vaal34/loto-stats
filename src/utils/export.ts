/**
 * Export utilities for Loto stats
 */

import { GlobalStats, LotoGame, ExportData, CSVNumberRow } from '../types/game';
import { EXPORT_VERSION } from '../constants/config';

/**
 * Export all stats as JSON
 */
export function exportAsJSON(stats: GlobalStats): string {
  const exportData: ExportData = {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    stats,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download JSON file
 */
export function downloadJSON(stats: GlobalStats, filename?: string): void {
  const json = exportAsJSON(stats);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `loto-stats-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export single game as CSV
 */
export function exportGameAsCSV(game: LotoGame): string {
  const rows: CSVNumberRow[] = game.numbers.map((number, index) => ({
    gameId: game.id,
    gameName: game.name,
    number,
    order: index + 1,
    timestamp: new Date(
      new Date(game.startTime).getTime() + index * 30000
    ).toISOString(), // Assume 30s between numbers
  }));

  const headers = ['Game ID', 'Game Name', 'Number', 'Order', 'Timestamp'];
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      [row.gameId, `"${row.gameName}"`, row.number, row.order, row.timestamp].join(',')
    ),
  ];

  return csvRows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(game: LotoGame, filename?: string): void {
  const csv = exportGameAsCSV(game);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `loto-game-${game.name.replace(/[^a-z0-9]/gi, '_')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all games as CSV
 */
export function exportAllGamesAsCSV(stats: GlobalStats): string {
  const allRows: CSVNumberRow[] = [];

  stats.games.forEach((game) => {
    game.numbers.forEach((number, index) => {
      allRows.push({
        gameId: game.id,
        gameName: game.name,
        number,
        order: index + 1,
        timestamp: new Date(
          new Date(game.startTime).getTime() + index * 30000
        ).toISOString(),
      });
    });
  });

  const headers = ['Game ID', 'Game Name', 'Number', 'Order', 'Timestamp'];
  const csvRows = [
    headers.join(','),
    ...allRows.map((row) =>
      [row.gameId, `"${row.gameName}"`, row.number, row.order, row.timestamp].join(',')
    ),
  ];

  return csvRows.join('\n');
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
