import { describe, it, expect } from 'vitest';
import {
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
} from '../src/engine/patterns.js';

describe('Pattern Rules', () => {
  it('alternatingRows returns row % 2', () => {
    expect(alternatingRows(0, 0, 4)).toBe(0);
    expect(alternatingRows(1, 0, 4)).toBe(1);
    expect(alternatingRows(2, 3, 4)).toBe(0);
    expect(alternatingRows(3, 2, 4)).toBe(1);
  });

  it('alternatingCols returns col % 2', () => {
    expect(alternatingCols(0, 0, 4)).toBe(0);
    expect(alternatingCols(0, 1, 4)).toBe(1);
    expect(alternatingCols(2, 2, 4)).toBe(0);
    expect(alternatingCols(3, 3, 4)).toBe(1);
  });

  it('checkerboard returns (row + col) % 2', () => {
    expect(checkerboard(0, 0, 4)).toBe(0);
    expect(checkerboard(0, 1, 4)).toBe(1);
    expect(checkerboard(1, 0, 4)).toBe(1);
    expect(checkerboard(1, 1, 4)).toBe(0);
  });

  it('diagonalStripes returns (row + col) % 3', () => {
    expect(diagonalStripes(0, 0, 4)).toBe(0);
    expect(diagonalStripes(0, 1, 4)).toBe(1);
    expect(diagonalStripes(0, 2, 4)).toBe(2);
    expect(diagonalStripes(1, 0, 4)).toBe(1);
  });

  it('concentricRings is deterministic', () => {
    const result1 = concentricRings(0, 0, 5);
    const result2 = concentricRings(0, 0, 5);
    expect(result1).toBe(result2);
    // Center of 5x5 should be 0 (layer 0)
    expect(concentricRings(2, 2, 5)).toBe(0);
    // Corner should be max distance
    expect(concentricRings(0, 0, 5)).toBe(2);
  });

  it('quadrants assigns different colors to each quadrant', () => {
    // 4x4 grid: mid = 2
    expect(quadrants(0, 0, 4)).toBe(0); // top-left
    expect(quadrants(0, 3, 4)).toBe(1); // top-right
    expect(quadrants(3, 0, 4)).toBe(2); // bottom-left
    expect(quadrants(3, 3, 4)).toBe(3); // bottom-right
  });

  it('borderFill distinguishes border and inner cells', () => {
    expect(borderFill(0, 0, 4)).toBe(0); // border
    expect(borderFill(0, 2, 4)).toBe(0); // border (top row)
    expect(borderFill(3, 1, 4)).toBe(0); // border (bottom row)
    expect(borderFill(1, 0, 4)).toBe(0); // border (left col)
    expect(borderFill(1, 1, 4)).toBe(1); // inner
    expect(borderFill(2, 2, 4)).toBe(1); // inner
  });

  it('spiral is deterministic and layer-based', () => {
    expect(spiral(0, 0, 4)).toBe(0); // outer layer
    expect(spiral(1, 1, 4)).toBe(1); // second layer
    // Center of 5x5
    expect(spiral(2, 2, 5)).toBe(2);
  });

  it('all pattern rules are deterministic', () => {
    for (const pattern of PATTERNS) {
      const r1 = pattern.rule(2, 3, 6);
      const r2 = pattern.rule(2, 3, 6);
      expect(r1).toBe(r2);
    }
  });
});

describe('Pattern Selection', () => {
  it('getAvailablePatterns returns patterns up to given level', () => {
    const level1 = getAvailablePatterns(1);
    expect(level1.length).toBe(2); // alternatingRows, alternatingCols
    expect(level1.every((p) => p.minLevel <= 1)).toBe(true);

    const level7 = getAvailablePatterns(7);
    expect(level7.length).toBe(PATTERNS.length);
  });

  it('pickPattern returns a valid pattern for the level', () => {
    const pattern = pickPattern(1, () => 0);
    expect(pattern).toBeDefined();
    expect(pattern.minLevel).toBeLessThanOrEqual(1);
  });

  it('combinePatterns uses secondary for border cells', () => {
    const primary = PATTERNS.find((p) => p.name === 'checkerboard')!;
    const secondary = PATTERNS.find((p) => p.name === 'alternatingCols')!;
    const combined = combinePatterns(primary, secondary);

    // Border cell (0, 0) should use secondary
    expect(combined.rule(0, 0, 4)).toBe(secondary.rule(0, 0, 4));
    // Inner cell (1, 1) should use primary
    expect(combined.rule(1, 1, 4)).toBe(primary.rule(1, 1, 4));
    expect(combined.name).toBe('checkerboard+alternatingCols');
  });

  it('selectPatternForLevel combines at level 7+', () => {
    // Use a deterministic random
    let callCount = 0;
    const rand = () => {
      callCount++;
      return callCount === 1 ? 0.0 : 0.5;
    };
    const pattern = selectPatternForLevel(7, rand);
    expect(pattern.name).toContain('+');
  });

  it('selectPatternForLevel returns single pattern below level 7', () => {
    const pattern = selectPatternForLevel(1, () => 0);
    expect(pattern.name).not.toContain('+');
  });
});
