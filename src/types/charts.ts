/**
 * Types for chart components
 */

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
}

export interface DecadeData {
  decade: string;
  count: number;
  percentage: number;
}

export interface GameEvolution {
  gameId: string;
  gameName: string;
  numbersDrawn: number;
  date: string;
}

export interface NumberTiming {
  number: number;
  averagePosition: number;
  category: 'early' | 'middle' | 'late';
}

export interface CorrelationData {
  number1: number;
  number2: number;
  correlation: number;
}

export interface DeviationData {
  number: number;
  deviation: number;
  isSignificant: boolean;
}
