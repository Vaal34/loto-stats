/**
 * Hook for calculating statistics based on a single partie's manches
 */

import { useMemo } from 'react';
import { LotoGame, FrequencyData, DecadeStats } from '../types/game';
import { TOTAL_NUMBERS, DECADES } from '../constants/config';
import { calculateQuineStats } from '../utils/quineAnalysis';

export interface QuineStats {
  averageQuinePosition: number | null;
  averageDeuxiemeQuinePosition: number | null;
  averageDoubleQuinePosition: number | null;
  averageCartonPleinPosition: number | null;
  totalQuines: number;
  totalDeuxiemeQuines: number;
  totalDoubleQuines: number;
  totalCartonPleins: number;
  fastestQuine: number | null;
  slowestQuine: number | null;
  fastestCartonPlein: number | null;
  slowestCartonPlein: number | null;
}

export interface TimingStats {
  averageMancheDurationSeconds: number;
  averageTimeBetweenDrawsSeconds: number;
  fastestMancheSeconds: number | null;
  slowestMancheSeconds: number | null;
}

export interface ParityStats {
  evenCount: number;
  oddCount: number;
  evenPercentage: number;
  oddPercentage: number;
}

export interface NumberGapStats {
  number: number;
  currentGap: number; // Number of draws since last appearance (or since start if never drawn)
  averageGap: number; // Average draws between appearances
  maxGap: number; // Maximum gap observed
  appearances: number;
}

interface UseStatsReturn {
  frequencyData: FrequencyData[];
  decadeStats: DecadeStats[];
  topNumbers: FrequencyData[];
  flopNumbers: FrequencyData[];
  totalNumbersDrawn: number;
  totalManches: number;
  averageNumbersPerManche: number;
  mostFrequentNumber: number | null;
  leastFrequentNumber: number | null;
  quineStats: QuineStats;
  timingStats: TimingStats;
  parityStats: ParityStats;
  gapStats: NumberGapStats[];
}

export function useStats(partie: LotoGame | null): UseStatsReturn {
  const stats = useMemo(() => {
    // Default values
    const defaultStats = {
      frequencyData: Array.from({ length: TOTAL_NUMBERS }, (_, i) => ({
        number: i + 1,
        count: 0,
        percentage: 0,
        games: [],
      })),
      decadeStats: DECADES.map((decade) => ({
        decade: decade.range,
        range: decade.range,
        count: 0,
        percentage: 0,
        numbers: [],
      })),
      topNumbers: [],
      flopNumbers: [],
      totalNumbersDrawn: 0,
      totalManches: 0,
      averageNumbersPerManche: 0,
      mostFrequentNumber: null,
      leastFrequentNumber: null,
      quineStats: {
        averageQuinePosition: null,
        averageDeuxiemeQuinePosition: null,
        averageDoubleQuinePosition: null,
        averageCartonPleinPosition: null,
        totalQuines: 0,
        totalDeuxiemeQuines: 0,
        totalDoubleQuines: 0,
        totalCartonPleins: 0,
        fastestQuine: null,
        slowestQuine: null,
        fastestCartonPlein: null,
        slowestCartonPlein: null,
      },
      timingStats: {
        averageMancheDurationSeconds: 0,
        averageTimeBetweenDrawsSeconds: 0,
        fastestMancheSeconds: null,
        slowestMancheSeconds: null,
      },
      parityStats: {
        evenCount: 0,
        oddCount: 0,
        evenPercentage: 0,
        oddPercentage: 0,
      },
      gapStats: Array.from({ length: TOTAL_NUMBERS }, (_, i) => ({
        number: i + 1,
        currentGap: 0,
        averageGap: 0,
        maxGap: 0,
        appearances: 0,
      })),
    };

    if (!partie) {
      return defaultStats;
    }

    // --- existing logic ---
    const frequency: Record<number, number> = {};
    let evenCount = 0;
    let oddCount = 0;
    
    // For gap analysis
    // We need a continuous sequence of all numbers drawn in the game, in order
    // But manches are parallel/sequential. We treat the whole partie as a sequence of manches.
    // Order of manches matters. We assume partie.manches is ordered (or sort by startTime).
    const sortedManches = [...partie.manches].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const allDrawsSequence: number[] = [];
    const mancheDurations: number[] = [];
    let totalDrawTimeSeconds = 0;

    sortedManches.forEach((manche) => {
      manche.numbers.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
        
        // Parity
        if (num % 2 === 0) evenCount++;
        else oddCount++;

        allDrawsSequence.push(num);
      });

      // Timing
      if (manche.endTime) {
        const start = new Date(manche.startTime).getTime();
        const end = new Date(manche.endTime).getTime();
        const durationSeconds = (end - start) / 1000;
        if (durationSeconds > 0) {
          mancheDurations.push(durationSeconds);
          totalDrawTimeSeconds += durationSeconds;
        }
      }
    });

    // --- Frequency Data & Decades (Existing Logic) ---
    const totalNumbersDrawn = Object.values(frequency).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalManches = partie.manches.length;
    const averageNumbersPerManche =
      totalManches > 0 ? totalNumbersDrawn / totalManches : 0;

    const frequencyData: FrequencyData[] = [];
    for (let num = 1; num <= TOTAL_NUMBERS; num++) {
      const count = frequency[num] || 0;
      const percentage = totalNumbersDrawn > 0 ? (count / totalNumbersDrawn) * 100 : 0;
      
      let lastDrawn: string | undefined;
      for (let j = partie.manches.length - 1; j >= 0; j--) {
        if (partie.manches[j].numbers.includes(num)) {
          lastDrawn = partie.manches[j].startTime;
          break;
        }
      }
      const mancheIds = partie.manches
        .filter((m) => m.numbers.includes(num))
        .map((m) => m.id);

      frequencyData.push({
        number: num,
        count,
        percentage,
        lastDrawn,
        games: mancheIds,
      });
    }

    const sortedByCount = [...frequencyData].sort((a, b) => b.count - a.count);
    const topNumbers = sortedByCount.slice(0, 15);
    const drawnNumbers = frequencyData.filter((f) => f.count > 0);
    const flopNumbers = drawnNumbers
      .sort((a, b) => a.count - b.count)
      .slice(0, 15);

    const decadeStats: DecadeStats[] = DECADES.map((decade) => {
      const numbersInDecade = frequencyData.filter(
        (f) => f.number >= decade.start && f.number <= decade.end
      );
      const count = numbersInDecade.reduce((sum, f) => sum + f.count, 0);
      const percentage = totalNumbersDrawn > 0 ? (count / totalNumbersDrawn) * 100 : 0;
      const numbers = numbersInDecade.filter((f) => f.count > 0).map((f) => f.number);
      return {
        decade: decade.range,
        range: decade.range,
        count,
        percentage,
        numbers,
      };
    });

    const mostFrequentNumber =
      sortedByCount.length > 0 && sortedByCount[0].count > 0
        ? sortedByCount[0].number
        : null;
    const leastFrequentNumber =
      drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1].number : null;

    const quineStats = calculateQuineStats(partie.manches);


    // --- NEW STATS CALCULATIONS ---

    // 1. Timing Stats
    const averageMancheDurationSeconds = mancheDurations.length > 0
      ? mancheDurations.reduce((a, b) => a + b, 0) / mancheDurations.length
      : 0;

    // Estimate average time between draws: Total Duration / Total Numbers drawn in completed manches
    // Only count numbers from completed manches to match the durations
    const completedManchesNumbersCount = sortedManches
      .filter(m => m.endTime)
      .reduce((sum, m) => sum + m.numbers.length, 0);

    const averageTimeBetweenDrawsSeconds = completedManchesNumbersCount > 0
      ? totalDrawTimeSeconds / completedManchesNumbersCount
      : 0;

    const timingStats: TimingStats = {
      averageMancheDurationSeconds,
      averageTimeBetweenDrawsSeconds,
      fastestMancheSeconds: mancheDurations.length > 0 ? Math.min(...mancheDurations) : null,
      slowestMancheSeconds: mancheDurations.length > 0 ? Math.max(...mancheDurations) : null,
    };

    // 2. Parity Stats
    const parityStats: ParityStats = {
      evenCount,
      oddCount,
      evenPercentage: totalNumbersDrawn > 0 ? (evenCount / totalNumbersDrawn) * 100 : 0,
      oddPercentage: totalNumbersDrawn > 0 ? (oddCount / totalNumbersDrawn) * 100 : 0,
    };

    // 3. Gap Analysis
    // For each number 1-90, calculate gaps in the allDrawsSequence
    const gapStats: NumberGapStats[] = [];
    
    for (let num = 1; num <= TOTAL_NUMBERS; num++) {
      let lastIndex = -1;
      const gaps: number[] = [];
      let appearances = 0;

      allDrawsSequence.forEach((drawnNum, index) => {
        if (drawnNum === num) {
          if (lastIndex !== -1) {
            gaps.push(index - lastIndex - 1); // Gap is numbers between, so distance - 1
          } else {
             // For first appearance, gap is from start? Or acceptable to ignore? 
             // Regle: habituellement 'Ecart' = nb de tirages depuis la dernière sortie.
             // Pour la première sortie, c'est le nb de tirages depuis le début.
             gaps.push(index);
          }
          lastIndex = index;
          appearances++;
        }
      });

      // Current gap: from last appearance to now (end of sequence)
      const currentGap = allDrawsSequence.length - 1 - lastIndex; 
      // If never drawn, currentGap is total sequence length
      
      const averageGap = gaps.length > 0 
        ? gaps.reduce((a, b) => a + b, 0) / gaps.length 
        : (allDrawsSequence.length > 0 ? allDrawsSequence.length : 0); // Logic choice if never drawn?

      const maxGap = gaps.length > 0 ? Math.max(...gaps, currentGap) : currentGap;

      gapStats.push({
        number: num,
        currentGap,
        averageGap,
        maxGap,
        appearances
      });
    }

    return {
      frequencyData,
      decadeStats,
      topNumbers,
      flopNumbers,
      totalNumbersDrawn,
      totalManches,
      averageNumbersPerManche,
      mostFrequentNumber,
      leastFrequentNumber,
      quineStats,
      timingStats,
      parityStats,
      gapStats,
    };
  }, [partie]);

  // Use values from memo or defaults
  // Note: Since we return a big object from useMemo, we can just return it.
  // But we need to handle the null partie case inside useMemo (which we did).
  
  return stats;
}
