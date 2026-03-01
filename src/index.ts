// Components
export { GlyphLockGame } from './components/GlyphLockGame.js';
export { GameGrid } from './components/GameGrid.js';
export { ColorPicker } from './components/ColorPicker.js';
export { HUD } from './components/HUD.js';
export { Rules } from './components/Rules.js';
export { GameOver } from './components/GameOver.js';

// Engine
export {
  alternatingRows,
  alternatingCols,
  checkerboard,
  diagonalStripes,
  concentricRings,
  quadrants,
  borderFill,
  spiral,
  PATTERNS,
  getAvailablePatterns,
  pickPattern,
  combinePatterns,
  selectPatternForLevel,
} from './engine/patterns.js';
export {
  getGridSize,
  getHidePercent,
  generateFullGrid,
  hideGridCells,
  generateGameGrid,
  isGridComplete,
  validateGrid,
  countHiddenCells,
  countRevealedCells,
} from './engine/grid.js';
export {
  getTimerForLevel,
  createInitialState,
  fillCell,
  submitGrid,
  tick,
  setSelectedColor,
  toggleRules,
  clearFlash,
} from './engine/state.js';
export { COLORS, MAX_LIVES, THEME } from './engine/constants.js';

// Hooks
export { useGameLoop } from './hooks/useGameLoop.js';
export { useInput } from './hooks/useInput.js';
export { useHighScore } from './hooks/useHighScore.js';

// Types
export type * from './types.js';
