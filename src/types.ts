/** A pattern rule function: given row, col, and grid size, returns a color index */
export type PatternRule = (row: number, col: number, size: number) => number;

/** Named pattern rule with metadata */
export interface PatternDefinition {
  name: string;
  rule: PatternRule;
  /** Number of distinct colors this pattern uses */
  colorCount: number;
  /** Minimum level this pattern appears at */
  minLevel: number;
}

/** A single cell in the grid */
export interface Cell {
  row: number;
  col: number;
  /** The correct color index from the pattern rule, always set internally */
  correctColor: number;
  /** The color currently displayed: number if revealed/filled, null if empty */
  color: number | null;
  /** Whether the cell was revealed at the start (not editable) */
  revealed: boolean;
  /** Whether the cell was filled by the player */
  playerFilled: boolean;
  /** Brief flash state for wrong answers */
  flashWrong: boolean;
}

/** The full grid */
export interface Grid {
  size: number;
  cells: Cell[][];
}

/** Game state */
export interface GameState {
  grid: Grid;
  level: number;
  score: number;
  lives: number;
  maxLives: number;
  timerRemaining: number;
  timerTotal: number;
  selectedColor: number;
  status: 'playing' | 'gameover';
  showRules: boolean;
  /** Name(s) of the active pattern rules for the current grid */
  patternNames: string[];
  /** Number of colors available for the current level */
  colorCount: number;
}

/** Color definitions */
export interface ColorDef {
  index: number;
  hex: string;
  name: string;
}
