/**
 * Hook for calculating statistics
 */

import { useMemo } from 'react';
import { GlobalStats, FrequencyData, DecadeStats } from '../types/game';
import { GameEvolution } from '../types/charts';
import { TOTAL_NUMBERS, DECADES } from '../constants/config';

interface UseStatsReturn {
  frequencyData: FrequencyData[];
  decadeStats: DecadeStats[];
  topNumbers: FrequencyData[];
  flopNumbers: FrequencyData[];
  totalNumbersDrawn: number;
  averageNumbersPerGame: number;
  mostFrequentNumber: number | null;
  leastFrequentNumber: number | null;
  gameEvolution: GameEvolution[];
}

export function useStats(globalStats: GlobalStats): UseStatsReturn {
  const stats = useMemo(() => {
    // Calculate total numbers drawn across all games
    const totalNumbersDrawn = Object.values(globalStats.allTimeFrequency).reduce(
      (sum, count) => sum + count,
      0
    );

    // Calculate average numbers per game
    const averageNumbersPerGame =
      globalStats.totalGamesPlayed > 0
        ? totalNumbersDrawn / globalStats.totalGamesPlayed
        : 0;

    // Build frequency data for all numbers (1-90)
    const frequencyData: FrequencyData[] = [];

    for (let num = 1; num <= TOTAL_NUMBERS; num++) {
      const count = globalStats.allTimeFrequency[num] || 0;
      const percentage = totalNumbersDrawn > 0 ? (count / totalNumbersDrawn) * 100 : 0;

      // Find last game where this number appeared
      let lastDrawn: string | undefined;
      for (let i = globalStats.games.length - 1; i >= 0; i--) {
        if (globalStats.games[i].numbers.includes(num)) {
          lastDrawn = globalStats.games[i].date;
          break;
        }
      }

      // Find all games where this number appeared
      const games = globalStats.games
        .filter((g) => g.numbers.includes(num))
        .map((g) => g.id);

      frequencyData.push({
        number: num,
        count,
        percentage,
        lastDrawn,
        games,
      });
    }

    // Sort by count for top/flop
    const sortedByCount = [...frequencyData].sort((a, b) => b.count - a.count);

    // Top 15 most frequent
    const topNumbers = sortedByCount.slice(0, 15);

    // Bottom 15 least frequent (but only those that have been drawn at least once)
    const drawnNumbers = frequencyData.filter((f) => f.count > 0);
    const flopNumbers = drawnNumbers
      .sort((a, b) => a.count - b.count)
      .slice(0, 15);

    // Calculate decade statistics
    const decadeStats: DecadeStats[] = DECADES.map((decade) => {
      const numbersInDecade = frequencyData.filter(
        (f) => f.number >= decade.start && f.number <= decade.end
      );

      const count = numbersInDecade.reduce((sum, f) => sum + f.count, 0);
      const percentage = totalNumbersDrawn > 0 ? (count / totalNumbersDrawn) * 100 : 0;
      const numbers = numbersInDecade.filter((f) => f.count > 0).map((f) => f.number);

      return {
        range: decade.range,
        count,
        percentage,
        numbers,
      };
    });

    // Most and least frequent numbers
    const mostFrequentNumber =
      sortedByCount.length > 0 && sortedByCount[0].count > 0
        ? sortedByCount[0].number
        : null;

    const leastFrequentNumber =
      drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1].number : null;

    // Game evolution data
    const gameEvolution: GameEvolution[] = globalStats.games
      .filter((game) => !game.isActive)
      .map((game) => ({
        gameId: game.id,
        gameName: game.name,
        numbersDrawn: game.numbers.length,
        date: game.date,
      }));

    return {
      frequencyData,
      decadeStats,
      topNumbers,
      flopNumbers,
      totalNumbersDrawn,
      averageNumbersPerGame,
      mostFrequentNumber,
      leastFrequentNumber,
      gameEvolution,
    };
  }, [globalStats]);

  return stats;
}
