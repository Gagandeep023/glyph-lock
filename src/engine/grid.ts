import type { Grid, Cell, PatternRule } from '../types.js';
import {
  GRID_5_LEVEL,
  GRID_6_LEVEL,
  MIN_HIDE_PERCENT,
  MAX_HIDE_PERCENT,
} from './constants.js';

/**
 * Get grid size for a given level.
 */
export function getGridSize(level: number): number {
  if (level >= GRID_6_LEVEL) return 6;
  if (level >= GRID_5_LEVEL) return 5;
  return 4;
}

/**
 * Get the percentage of cells to hide for a given level.
 * Scales linearly from MIN_HIDE_PERCENT to MAX_HIDE_PERCENT over levels 1-15.
 */
export function getHidePercent(level: number): number {
  const t = Math.min((level - 1) / 14, 1);
  return MIN_HIDE_PERCENT + t * (MAX_HIDE_PERCENT - MIN_HIDE_PERCENT);
}

/**
 * Generate a complete grid from a pattern rule.
 * All cells are revealed, with the correct color.
 */
export function generateFullGrid(size: number, rule: PatternRule): Grid {
  const cells: Cell[][] = [];
  for (let row = 0; row < size; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < size; col++) {
      const correctColor = rule(row, col, size);
      rowCells.push({
        row,
        col,
        correctColor,
        color: correctColor,
        revealed: true,
        playerFilled: false,
        flashWrong: false,
      });
    }
    cells.push(rowCells);
  }
  return { size, cells };
}

/**
 * Hide a percentage of cells in the grid.
 * Uses the provided random function for testability.
 */
export function hideGridCells(
  grid: Grid,
  hidePercent: number,
  rand: () => number = Math.random,
): Grid {
  const totalCells = grid.size * grid.size;
  const numToHide = Math.floor(totalCells * hidePercent);

  // Build a list of all cell positions and shuffle them
  const positions: [number, number][] = [];
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      positions.push([row, col]);
    }
  }

  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Deep clone the grid
  const newCells: Cell[][] = grid.cells.map((row) =>
    row.map((cell) => ({ ...cell })),
  );

  // Hide the first numToHide cells
  for (let i = 0; i < numToHide; i++) {
    const [row, col] = positions[i];
    newCells[row][col].color = null;
    newCells[row][col].revealed = false;
  }

  return { size: grid.size, cells: newCells };
}

/**
 * Generate a game grid for a given level and pattern rule.
 */
export function generateGameGrid(
  level: number,
  rule: PatternRule,
  rand: () => number = Math.random,
): Grid {
  const size = getGridSize(level);
  const fullGrid = generateFullGrid(size, rule);
  const hidePercent = getHidePercent(level);
  return hideGridCells(fullGrid, hidePercent, rand);
}

/**
 * Check if all cells in the grid are filled (no null colors).
 */
export function isGridComplete(grid: Grid): boolean {
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (grid.cells[row][col].color === null) return false;
    }
  }
  return true;
}

/**
 * Validate the grid: check all player-filled cells match their correct color.
 * Returns list of incorrect cell positions.
 */
export function validateGrid(grid: Grid): [number, number][] {
  const wrong: [number, number][] = [];
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const cell = grid.cells[row][col];
      if (cell.playerFilled && cell.color !== cell.correctColor) {
        wrong.push([row, col]);
      }
    }
  }
  return wrong;
}

/**
 * Count the number of hidden (empty) cells.
 */
export function countHiddenCells(grid: Grid): number {
  let count = 0;
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (!grid.cells[row][col].revealed) count++;
    }
  }
  return count;
}

/**
 * Count the number of revealed cells.
 */
export function countRevealedCells(grid: Grid): number {
  let count = 0;
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (grid.cells[row][col].revealed) count++;
    }
  }
  return count;
}
