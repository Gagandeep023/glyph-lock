import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  fillCell,
  submitGrid,
  tick,
  setSelectedColor,
  toggleRules,
  clearFlash,
  getTimerForLevel,
} from '../src/engine/state.js';
import { MAX_LIVES, BASE_TIMER, MIN_TIMER } from '../src/engine/constants.js';

// Deterministic random for reproducible tests
const seededRand = () => 0.3;

describe('getTimerForLevel', () => {
  it('returns base timer for level 1', () => {
    expect(getTimerForLevel(1)).toBe(BASE_TIMER);
  });

  it('decreases by 2 per level', () => {
    expect(getTimerForLevel(2)).toBe(BASE_TIMER - 2);
    expect(getTimerForLevel(3)).toBe(BASE_TIMER - 4);
  });

  it('never goes below minimum', () => {
    expect(getTimerForLevel(100)).toBe(MIN_TIMER);
  });
});

describe('createInitialState', () => {
  it('creates state at level 1 with full lives', () => {
    const state = createInitialState(seededRand);
    expect(state.level).toBe(1);
    expect(state.score).toBe(0);
    expect(state.lives).toBe(MAX_LIVES);
    expect(state.status).toBe('playing');
    expect(state.showRules).toBe(false);
  });

  it('creates a grid with the correct size', () => {
    const state = createInitialState(seededRand);
    expect(state.grid.size).toBe(4);
  });
});

describe('fillCell', () => {
  it('fills an empty cell with the selected color', () => {
    const state = createInitialState(seededRand);
    // Find an empty cell
    let emptyRow = -1, emptyCol = -1;
    for (let r = 0; r < state.grid.size; r++) {
      for (let c = 0; c < state.grid.size; c++) {
        if (!state.grid.cells[r][c].revealed) {
          emptyRow = r;
          emptyCol = c;
          break;
        }
      }
      if (emptyRow >= 0) break;
    }

    if (emptyRow >= 0) {
      const newState = fillCell(state, emptyRow, emptyCol, 1);
      expect(newState.grid.cells[emptyRow][emptyCol].color).toBe(1);
      expect(newState.grid.cells[emptyRow][emptyCol].playerFilled).toBe(true);
    }
  });

  it('does not modify revealed cells', () => {
    const state = createInitialState(seededRand);
    // Find a revealed cell
    let revRow = -1, revCol = -1;
    for (let r = 0; r < state.grid.size; r++) {
      for (let c = 0; c < state.grid.size; c++) {
        if (state.grid.cells[r][c].revealed) {
          revRow = r;
          revCol = c;
          break;
        }
      }
      if (revRow >= 0) break;
    }

    if (revRow >= 0) {
      const originalColor = state.grid.cells[revRow][revCol].color;
      const newState = fillCell(state, revRow, revCol, 2);
      expect(newState.grid.cells[revRow][revCol].color).toBe(originalColor);
    }
  });

  it('clears a player-filled cell when clicking same color', () => {
    const state = createInitialState(seededRand);
    let emptyRow = -1, emptyCol = -1;
    for (let r = 0; r < state.grid.size; r++) {
      for (let c = 0; c < state.grid.size; c++) {
        if (!state.grid.cells[r][c].revealed) {
          emptyRow = r;
          emptyCol = c;
          break;
        }
      }
      if (emptyRow >= 0) break;
    }

    if (emptyRow >= 0) {
      const filled = fillCell(state, emptyRow, emptyCol, 1);
      const cleared = fillCell(filled, emptyRow, emptyCol, 1);
      expect(cleared.grid.cells[emptyRow][emptyCol].color).toBe(null);
      expect(cleared.grid.cells[emptyRow][emptyCol].playerFilled).toBe(false);
    }
  });

  it('does nothing when game is over', () => {
    const state = createInitialState(seededRand);
    const overState = { ...state, status: 'gameover' as const };
    const result = fillCell(overState, 0, 0, 1);
    expect(result).toBe(overState);
  });
});

describe('submitGrid', () => {
  it('does nothing if grid is not complete', () => {
    const state = createInitialState(seededRand);
    const result = submitGrid(state, seededRand);
    // Grid should not be complete initially, so state should be unchanged
    expect(result.score).toBe(state.score);
    expect(result.level).toBe(state.level);
  });

  it('increments score and level on correct submission', () => {
    const state = createInitialState(seededRand);
    // Fill all empty cells correctly
    const newCells = state.grid.cells.map((row) =>
      row.map((cell) => {
        if (!cell.revealed) {
          return { ...cell, color: cell.correctColor, playerFilled: true };
        }
        return { ...cell };
      }),
    );
    const filledState = {
      ...state,
      grid: { ...state.grid, cells: newCells },
    };

    const result = submitGrid(filledState, seededRand);
    expect(result.score).toBe(1);
    expect(result.level).toBe(2);
  });

  it('decrements lives on wrong submission', () => {
    const state = createInitialState(seededRand);
    // Fill all empty cells with wrong colors
    const newCells = state.grid.cells.map((row) =>
      row.map((cell) => {
        if (!cell.revealed) {
          // Use a color that is definitely wrong
          const wrongColor = (cell.correctColor + 1) % 2;
          return { ...cell, color: wrongColor, playerFilled: true };
        }
        return { ...cell };
      }),
    );
    const filledState = {
      ...state,
      grid: { ...state.grid, cells: newCells },
    };

    const result = submitGrid(filledState, seededRand);
    expect(result.lives).toBe(MAX_LIVES - 1);
    expect(result.score).toBe(0);
  });

  it('game over when lives reach 0', () => {
    const state = createInitialState(seededRand);
    // Set lives to 1 and submit wrong
    const newCells = state.grid.cells.map((row) =>
      row.map((cell) => {
        if (!cell.revealed) {
          const wrongColor = (cell.correctColor + 1) % 2;
          return { ...cell, color: wrongColor, playerFilled: true };
        }
        return { ...cell };
      }),
    );
    const filledState = {
      ...state,
      lives: 1,
      grid: { ...state.grid, cells: newCells },
    };

    const result = submitGrid(filledState, seededRand);
    expect(result.lives).toBe(0);
    expect(result.status).toBe('gameover');
  });
});

describe('tick', () => {
  it('decreases timer by delta', () => {
    const state = createInitialState(seededRand);
    const result = tick(state, 1);
    expect(result.timerRemaining).toBe(state.timerRemaining - 1);
  });

  it('triggers game over when timer reaches 0', () => {
    const state = createInitialState(seededRand);
    const result = tick(state, state.timerRemaining + 1);
    expect(result.status).toBe('gameover');
    expect(result.timerRemaining).toBe(0);
  });

  it('does nothing when game is already over', () => {
    const state = createInitialState(seededRand);
    const overState = { ...state, status: 'gameover' as const };
    const result = tick(overState, 1);
    expect(result).toBe(overState);
  });
});

describe('setSelectedColor', () => {
  it('updates selected color', () => {
    const state = createInitialState(seededRand);
    const result = setSelectedColor(state, 2);
    expect(result.selectedColor).toBe(2);
  });
});

describe('toggleRules', () => {
  it('toggles showRules', () => {
    const state = createInitialState(seededRand);
    expect(state.showRules).toBe(false);
    const toggled = toggleRules(state);
    expect(toggled.showRules).toBe(true);
    const toggledBack = toggleRules(toggled);
    expect(toggledBack.showRules).toBe(false);
  });
});

describe('clearFlash', () => {
  it('resets all flashWrong flags', () => {
    const state = createInitialState(seededRand);
    // Manually set some flash flags
    state.grid.cells[0][0] = { ...state.grid.cells[0][0], flashWrong: true };
    const cleared = clearFlash(state);
    for (let r = 0; r < cleared.grid.size; r++) {
      for (let c = 0; c < cleared.grid.size; c++) {
        expect(cleared.grid.cells[r][c].flashWrong).toBe(false);
      }
    }
  });
});
