import { describe, it, expect } from 'vitest';
import {
  getGridSize,
  getHidePercent,
  generateFullGrid,
  hideGridCells,
  generateGameGrid,
  isGridComplete,
  validateGrid,
  countHiddenCells,
  countRevealedCells,
} from '../src/engine/grid.js';
import { checkerboard, alternatingRows } from '../src/engine/patterns.js';

describe('getGridSize', () => {
  it('returns 4 for levels 1-4', () => {
    expect(getGridSize(1)).toBe(4);
    expect(getGridSize(4)).toBe(4);
  });

  it('returns 5 for levels 5-9', () => {
    expect(getGridSize(5)).toBe(5);
    expect(getGridSize(9)).toBe(5);
  });

  it('returns 6 for level 10+', () => {
    expect(getGridSize(10)).toBe(6);
    expect(getGridSize(15)).toBe(6);
  });
});

describe('getHidePercent', () => {
  it('returns minimum at level 1', () => {
    expect(getHidePercent(1)).toBeCloseTo(0.3, 2);
  });

  it('returns maximum at level 15', () => {
    expect(getHidePercent(15)).toBeCloseTo(0.5, 2);
  });

  it('scales linearly between levels', () => {
    const mid = getHidePercent(8);
    expect(mid).toBeGreaterThan(0.3);
    expect(mid).toBeLessThan(0.5);
  });
});

describe('generateFullGrid', () => {
  it('creates grid of correct size', () => {
    const grid = generateFullGrid(4, checkerboard);
    expect(grid.size).toBe(4);
    expect(grid.cells.length).toBe(4);
    expect(grid.cells[0].length).toBe(4);
  });

  it('all cells are revealed with correct colors', () => {
    const grid = generateFullGrid(4, checkerboard);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = grid.cells[r][c];
        expect(cell.revealed).toBe(true);
        expect(cell.color).toBe(cell.correctColor);
        expect(cell.color).toBe((r + c) % 2);
      }
    }
  });
});

describe('hideGridCells', () => {
  it('hides the correct number of cells', () => {
    const grid = generateFullGrid(4, checkerboard);
    const hidden = hideGridCells(grid, 0.5, () => 0.1);
    const hiddenCount = countHiddenCells(hidden);
    expect(hiddenCount).toBe(8); // 50% of 16
  });

  it('hidden cells have null color and revealed=false', () => {
    const grid = generateFullGrid(4, checkerboard);
    const hidden = hideGridCells(grid, 0.25, () => 0.1);
    let hiddenCount = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!hidden.cells[r][c].revealed) {
          hiddenCount++;
          expect(hidden.cells[r][c].color).toBe(null);
        }
      }
    }
    expect(hiddenCount).toBe(4); // 25% of 16
  });

  it('revealed cells still match the pattern', () => {
    const grid = generateFullGrid(4, alternatingRows);
    const hidden = hideGridCells(grid, 0.3, () => 0.5);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (hidden.cells[r][c].revealed) {
          expect(hidden.cells[r][c].color).toBe(alternatingRows(r, c, 4));
        }
      }
    }
  });
});

describe('generateGameGrid', () => {
  it('produces a grid with correct size for the level', () => {
    const grid = generateGameGrid(1, checkerboard, () => 0.5);
    expect(grid.size).toBe(4);

    const grid5 = generateGameGrid(5, checkerboard, () => 0.5);
    expect(grid5.size).toBe(5);
  });

  it('has some hidden and some revealed cells', () => {
    const grid = generateGameGrid(1, checkerboard, () => 0.5);
    const hidden = countHiddenCells(grid);
    const revealed = countRevealedCells(grid);
    expect(hidden).toBeGreaterThan(0);
    expect(revealed).toBeGreaterThan(0);
    expect(hidden + revealed).toBe(16);
  });
});

describe('isGridComplete', () => {
  it('returns true when all cells have colors', () => {
    const grid = generateFullGrid(4, checkerboard);
    expect(isGridComplete(grid)).toBe(true);
  });

  it('returns false when some cells are null', () => {
    const grid = generateFullGrid(4, checkerboard);
    const hidden = hideGridCells(grid, 0.5, () => 0.1);
    expect(isGridComplete(hidden)).toBe(false);
  });
});

describe('validateGrid', () => {
  it('returns empty array when all player fills are correct', () => {
    const grid = generateFullGrid(4, checkerboard);
    const hidden = hideGridCells(grid, 0.5, () => 0.1);
    // Fill all hidden cells correctly
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!hidden.cells[r][c].revealed) {
          hidden.cells[r][c].color = hidden.cells[r][c].correctColor;
          hidden.cells[r][c].playerFilled = true;
        }
      }
    }
    expect(validateGrid(hidden)).toEqual([]);
  });

  it('returns wrong positions when player fills are incorrect', () => {
    const grid = generateFullGrid(4, checkerboard);
    const hidden = hideGridCells(grid, 0.5, () => 0.1);
    // Fill one cell incorrectly
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!hidden.cells[r][c].revealed) {
          // Use wrong color (opposite of correct)
          hidden.cells[r][c].color = hidden.cells[r][c].correctColor === 0 ? 1 : 0;
          hidden.cells[r][c].playerFilled = true;
        }
      }
    }
    const wrong = validateGrid(hidden);
    expect(wrong.length).toBeGreaterThan(0);
  });
});
