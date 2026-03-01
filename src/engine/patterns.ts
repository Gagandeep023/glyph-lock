import type { PatternDefinition, PatternRule } from '../types.js';

/** color = row % colorCount */
export const alternatingRows: PatternRule = (row, _col, _size) => row % 2;

/** color = col % colorCount */
export const alternatingCols: PatternRule = (_row, col, _size) => col % 2;

/** color = (row + col) % 2 */
export const checkerboard: PatternRule = (row, col, _size) => (row + col) % 2;

/** color = (row + col) % 3 */
export const diagonalStripes: PatternRule = (row, col, _size) => (row + col) % 3;

/** color based on manhattan distance from center */
export const concentricRings: PatternRule = (row, col, size) => {
  const center = (size - 1) / 2;
  const dist = Math.max(Math.abs(row - center), Math.abs(col - center));
  return Math.floor(dist) % 3;
};

/** Different color per quadrant */
export const quadrants: PatternRule = (row, col, size) => {
  const midRow = Math.floor(size / 2);
  const midCol = Math.floor(size / 2);
  if (row < midRow && col < midCol) return 0;
  if (row < midRow && col >= midCol) return 1;
  if (row >= midRow && col < midCol) return 2;
  return 3;
};

/** Border cells one color, inner cells another */
export const borderFill: PatternRule = (row, col, size) => {
  if (row === 0 || row === size - 1 || col === 0 || col === size - 1) return 0;
  return 1;
};

/** Spiral-like pattern based on layer depth */
export const spiral: PatternRule = (row, col, size) => {
  // Determine which "layer" from the outside
  const layer = Math.min(row, col, size - 1 - row, size - 1 - col);
  return layer % 4;
};

/** All pattern definitions with metadata */
export const PATTERNS: PatternDefinition[] = [
  { name: 'alternatingRows', rule: alternatingRows, colorCount: 2, minLevel: 1 },
  { name: 'alternatingCols', rule: alternatingCols, colorCount: 2, minLevel: 1 },
  { name: 'checkerboard', rule: checkerboard, colorCount: 2, minLevel: 3 },
  { name: 'borderFill', rule: borderFill, colorCount: 2, minLevel: 3 },
  { name: 'diagonalStripes', rule: diagonalStripes, colorCount: 3, minLevel: 4 },
  { name: 'concentricRings', rule: concentricRings, colorCount: 3, minLevel: 5 },
  { name: 'quadrants', rule: quadrants, colorCount: 4, minLevel: 6 },
  { name: 'spiral', rule: spiral, colorCount: 4, minLevel: 7 },
];

/**
 * Get patterns available for a given level.
 * Returns patterns whose minLevel <= level.
 */
export function getAvailablePatterns(level: number): PatternDefinition[] {
  return PATTERNS.filter((p) => p.minLevel <= level);
}

/**
 * Pick a random pattern for a given level.
 * Uses the provided random function for testability (defaults to Math.random).
 */
export function pickPattern(
  level: number,
  rand: () => number = Math.random,
): PatternDefinition {
  const available = getAvailablePatterns(level);
  const idx = Math.floor(rand() * available.length);
  return available[idx];
}

/**
 * Combine two patterns: primary pattern is used everywhere,
 * but border cells are overridden by the secondary pattern.
 * Returns a new PatternDefinition.
 */
export function combinePatterns(
  primary: PatternDefinition,
  secondary: PatternDefinition,
): PatternDefinition {
  const combinedRule: PatternRule = (row, col, size) => {
    // Border cells use secondary pattern
    if (row === 0 || row === size - 1 || col === 0 || col === size - 1) {
      return secondary.rule(row, col, size);
    }
    return primary.rule(row, col, size);
  };
  return {
    name: `${primary.name}+${secondary.name}`,
    rule: combinedRule,
    colorCount: Math.max(primary.colorCount, secondary.colorCount),
    minLevel: Math.max(primary.minLevel, secondary.minLevel),
  };
}

/**
 * Select pattern(s) for a level.
 * Level 7+: combine two patterns.
 * Otherwise: single pattern.
 */
export function selectPatternForLevel(
  level: number,
  rand: () => number = Math.random,
): PatternDefinition {
  if (level >= 7) {
    const available = getAvailablePatterns(level);
    if (available.length >= 2) {
      const idx1 = Math.floor(rand() * available.length);
      let idx2 = Math.floor(rand() * (available.length - 1));
      if (idx2 >= idx1) idx2++;
      return combinePatterns(available[idx1], available[idx2]);
    }
  }
  return pickPattern(level, rand);
}
