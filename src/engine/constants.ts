import type { ColorDef } from '../types.js';

/** The four game colors */
export const COLORS: ColorDef[] = [
  { index: 0, hex: '#64ffda', name: 'teal' },
  { index: 1, hex: '#ff6b6b', name: 'coral' },
  { index: 2, hex: '#ffd93d', name: 'gold' },
  { index: 3, hex: '#6bcb77', name: 'green' },
];

/** Maximum number of lives */
export const MAX_LIVES = 3;

/** Base timer in seconds */
export const BASE_TIMER = 30;

/** Timer decrease per level in seconds */
export const TIMER_DECREASE_PER_LEVEL = 2;

/** Minimum timer in seconds */
export const MIN_TIMER = 12;

/** Minimum percentage of cells to hide */
export const MIN_HIDE_PERCENT = 0.3;

/** Maximum percentage of cells to hide */
export const MAX_HIDE_PERCENT = 0.5;

/** Level at which grid grows to 5x5 */
export const GRID_5_LEVEL = 5;

/** Level at which grid grows to 6x6 */
export const GRID_6_LEVEL = 10;

/** Theme colors */
export const THEME = {
  bg: '#0a0a0a',
  accent: '#64ffda',
  text: '#e0e0e0',
  cellBorder: '#333333',
  cellEmpty: '#1a1a1a',
  cellEmptyHover: '#252525',
  wrong: '#ff4444',
  playerDot: '#ffffff',
};
