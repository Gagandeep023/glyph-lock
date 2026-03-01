import type { GameState } from '../types.js';
import {
  MAX_LIVES,
  BASE_TIMER,
  TIMER_DECREASE_PER_LEVEL,
  MIN_TIMER,
} from './constants.js';
import { generateGameGrid, isGridComplete, validateGrid } from './grid.js';
import { selectPatternForLevel } from './patterns.js';

/**
 * Calculate the timer duration for a given level.
 */
export function getTimerForLevel(level: number): number {
  return Math.max(MIN_TIMER, BASE_TIMER - (level - 1) * TIMER_DECREASE_PER_LEVEL);
}

/**
 * Create the initial game state for level 1.
 */
export function createInitialState(rand: () => number = Math.random): GameState {
  const level = 1;
  const pattern = selectPatternForLevel(level, rand);
  const grid = generateGameGrid(level, pattern.rule, rand);
  const timer = getTimerForLevel(level);

  return {
    grid,
    level,
    score: 0,
    lives: MAX_LIVES,
    maxLives: MAX_LIVES,
    timerRemaining: timer,
    timerTotal: timer,
    selectedColor: 0,
    status: 'playing',
    showRules: false,
    patternNames: [pattern.name],
    colorCount: pattern.colorCount,
  };
}

/**
 * Fill a cell with the selected color.
 * If the cell is already player-filled, clear it.
 * If the cell is revealed, do nothing.
 * Returns a new state (immutable).
 */
export function fillCell(
  state: GameState,
  row: number,
  col: number,
  colorIndex: number,
): GameState {
  if (state.status !== 'playing') return state;

  const cell = state.grid.cells[row]?.[col];
  if (!cell) return state;

  // Revealed cells cannot be changed
  if (cell.revealed) return state;

  // Clone grid
  const newCells = state.grid.cells.map((r) => r.map((c) => ({ ...c })));

  if (cell.playerFilled && cell.color === colorIndex) {
    // Clicking same color on player-filled cell clears it
    newCells[row][col].color = null;
    newCells[row][col].playerFilled = false;
  } else {
    // Fill cell
    newCells[row][col].color = colorIndex;
    newCells[row][col].playerFilled = true;
    newCells[row][col].flashWrong = false;
  }

  return {
    ...state,
    grid: { ...state.grid, cells: newCells },
  };
}

/**
 * Submit the grid for validation.
 * All correct: score++, next level, new grid, reset timer.
 * Any wrong: lives--, flash wrong cells.
 * 0 lives: game over.
 */
export function submitGrid(
  state: GameState,
  rand: () => number = Math.random,
): GameState {
  if (state.status !== 'playing') return state;

  // Check if grid is complete
  if (!isGridComplete(state.grid)) return state;

  const wrong = validateGrid(state.grid);

  if (wrong.length === 0) {
    // All correct - advance to next level
    const nextLevel = state.level + 1;
    const pattern = selectPatternForLevel(nextLevel, rand);
    const newGrid = generateGameGrid(nextLevel, pattern.rule, rand);
    const timer = getTimerForLevel(nextLevel);

    return {
      ...state,
      grid: newGrid,
      level: nextLevel,
      score: state.score + 1,
      timerRemaining: timer,
      timerTotal: timer,
      patternNames: [pattern.name],
      colorCount: pattern.colorCount,
    };
  } else {
    // Some wrong - lose a life
    const newLives = state.lives - 1;

    // Clone grid and mark wrong cells
    const newCells = state.grid.cells.map((r) => r.map((c) => ({ ...c })));
    for (const [row, col] of wrong) {
      newCells[row][col].flashWrong = true;
      newCells[row][col].color = null;
      newCells[row][col].playerFilled = false;
    }

    if (newLives <= 0) {
      return {
        ...state,
        grid: { ...state.grid, cells: newCells },
        lives: 0,
        status: 'gameover',
      };
    }

    return {
      ...state,
      grid: { ...state.grid, cells: newCells },
      lives: newLives,
    };
  }
}

/**
 * Tick the timer by delta seconds.
 * If timer reaches 0, game over.
 */
export function tick(state: GameState, delta: number): GameState {
  if (state.status !== 'playing') return state;

  const newTime = state.timerRemaining - delta;

  if (newTime <= 0) {
    return {
      ...state,
      timerRemaining: 0,
      status: 'gameover',
    };
  }

  return {
    ...state,
    timerRemaining: newTime,
  };
}

/**
 * Set the selected color.
 */
export function setSelectedColor(state: GameState, colorIndex: number): GameState {
  return { ...state, selectedColor: colorIndex };
}

/**
 * Toggle the rules overlay.
 */
export function toggleRules(state: GameState): GameState {
  return { ...state, showRules: !state.showRules };
}

/**
 * Clear the flash state on all cells.
 */
export function clearFlash(state: GameState): GameState {
  const newCells = state.grid.cells.map((r) =>
    r.map((c) => ({ ...c, flashWrong: false })),
  );
  return {
    ...state,
    grid: { ...state.grid, cells: newCells },
  };
}
