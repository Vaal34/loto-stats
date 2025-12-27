/**
 * Application constants and configuration
 */

/** Total number of loto numbers */
export const TOTAL_NUMBERS = 90;

/** Minimum number */
export const MIN_NUMBER = 1;

/** Maximum number */
export const MAX_NUMBER = 90;

/** Number of rows in the grid */
export const GRID_ROWS = 9;

/** Number of columns in the grid */
export const GRID_COLS = 10;

/** LocalStorage key for global stats */
export const STORAGE_KEY = 'loto-stats';

/** Auto-save interval in milliseconds (5 seconds) */
export const AUTO_SAVE_INTERVAL = 5000;

/** Color palette for light mode */
export const COLORS_LIGHT = {
  background: '#F9FAFB',
  primary: '#3B82F6',
  success: '#10B981',
  error: '#EF4444',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  cardBackground: '#FFFFFF',
} as const;

/** Color palette for dark mode */
export const COLORS_DARK = {
  background: '#1F2937',
  primary: '#60A5FA',
  success: '#34D399',
  error: '#EF4444',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  cardBackground: '#111827',
} as const;

/** Frequency color thresholds */
export const FREQUENCY_COLORS = {
  rare: { threshold: 0.33, color: '#3B82F6' }, // Blue
  medium: { threshold: 0.66, color: '#F59E0B' }, // Yellow
  frequent: { threshold: 1.0, color: '#EF4444' }, // Red
} as const;

/** Heatmap gradient colors */
export const HEATMAP_GRADIENT = [
  '#3B82F6', // Blue (0-10%)
  '#10B981', // Green (10-50%)
  '#F59E0B', // Yellow (50-80%)
  '#EF4444', // Red (80-100%)
] as const;

/** Minimum touch target size (accessibility) */
export const MIN_TOUCH_SIZE = 44;

/** Animation duration in milliseconds */
export const ANIMATION_DURATION = 200;

/** Number of top/flop numbers to display */
export const TOP_FLOP_COUNT = 15;

/** Decades configuration */
export const DECADES = [
  { range: '1-10', start: 1, end: 10 },
  { range: '11-20', start: 11, end: 20 },
  { range: '21-30', start: 21, end: 30 },
  { range: '31-40', start: 31, end: 40 },
  { range: '41-50', start: 41, end: 50 },
  { range: '51-60', start: 51, end: 60 },
  { range: '61-70', start: 61, end: 70 },
  { range: '71-80', start: 71, end: 80 },
  { range: '81-90', start: 81, end: 90 },
] as const;

/** Export version for compatibility */
export const EXPORT_VERSION = '1.0.0';

/** Maximum file size for import (5MB) */
export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024;
