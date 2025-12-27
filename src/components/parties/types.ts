/**
 * Type definitions for Parties components
 */

import { LotoGame } from '../../types/game';

/**
 * Props for PartiesList component
 */
export interface PartiesListProps {
  /** Array of all games (active + completed) */
  games: LotoGame[];

  /** Callback when a game is selected/clicked */
  onSelectGame: (game: LotoGame) => void;

  /** Optional callback when resuming a completed game */
  onResumeGame?: (game: LotoGame) => void;

  /** Optional callback when deleting a game */
  onDeleteGame?: (game: LotoGame) => void;

  /** Enable dark mode styling */
  darkMode?: boolean;
}

/**
 * Props for PartyCard component
 */
export interface PartyCardProps {
  /** Game to display */
  game: LotoGame;

  /** Callback when the card is clicked */
  onClick: (game: LotoGame) => void;

  /** Optional callback when resume button is clicked */
  onResume?: (game: LotoGame) => void;

  /** Optional callback when delete button is clicked */
  onDelete?: (game: LotoGame) => void;

  /** Enable dark mode styling */
  darkMode?: boolean;
}

/**
 * Props for PartyDetails component
 */
export interface PartyDetailsProps {
  /** Game to display in detail */
  game: LotoGame;

  /** Optional callback when export button is clicked */
  onExport?: (game: LotoGame) => void;

  /** Callback when closing the details modal */
  onClose: () => void;

  /** Enable dark mode styling */
  darkMode?: boolean;
}

/**
 * Sort field options for PartiesList
 */
export type SortField = 'date' | 'name' | 'numbersDrawn';

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * View mode options for PartiesList
 */
export type ViewMode = 'grid' | 'list';

/**
 * Decade statistics for PartyDetails
 */
export interface DecadeStatistic {
  range: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}
