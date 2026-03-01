import { useState, useCallback, useRef } from 'react';
import type { GameState } from '../types.js';
import {
  createInitialState,
  fillCell,
  submitGrid,
  tick,
  setSelectedColor,
  toggleRules,
  clearFlash,
} from '../engine/state.js';
import { useGameLoop } from '../hooks/useGameLoop.js';
import { useHighScore } from '../hooks/useHighScore.js';
import { GameGrid } from './GameGrid.js';
import { ColorPicker } from './ColorPicker.js';
import { HUD } from './HUD.js';
import { Rules } from './Rules.js';
import { GameOver } from './GameOver.js';

export function GlyphLockGame() {
  const [state, setState] = useState<GameState>(() => createInitialState());
  const { highScore, updateHighScore } = useHighScore();
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Game loop for timer
  useGameLoop(
    useCallback(
      (delta: number) => {
        setState((prev) => tick(prev, delta));
      },
      [],
    ),
    state.status === 'playing' && !state.showRules,
  );

  // Check for game over to update high score
  if (state.status === 'gameover') {
    updateHighScore(state.score);
  }

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setState((prev) => fillCell(prev, row, col, prev.selectedColor));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    setState((prev) => {
      const newState = submitGrid(prev);
      // If there are wrong cells, clear the flash after a short delay
      if (newState.lives < prev.lives || newState.status === 'gameover') {
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = setTimeout(() => {
          setState((s) => clearFlash(s));
        }, 500);
      }
      return newState;
    });
  }, []);

  const handleColorSelect = useCallback((colorIndex: number) => {
    setState((prev) => setSelectedColor(prev, colorIndex));
  }, []);

  const handleToggleRules = useCallback(() => {
    setState((prev) => toggleRules(prev));
  }, []);

  const handleRetry = useCallback(() => {
    setState(createInitialState());
  }, []);

  return (
    <div className="gl-container">
      <h1 className="gl-title">Glyph Lock</h1>

      <HUD
        level={state.level}
        score={state.score}
        lives={state.lives}
        maxLives={state.maxLives}
        timerRemaining={state.timerRemaining}
        timerTotal={state.timerTotal}
        onSubmit={handleSubmit}
        onToggleRules={handleToggleRules}
      />

      <div className="gl-grid-wrapper">
        <GameGrid grid={state.grid} onCellClick={handleCellClick} />
      </div>

      <ColorPicker
        selectedColor={state.selectedColor}
        colorCount={state.colorCount}
        onSelect={handleColorSelect}
      />

      {state.showRules && <Rules onClose={handleToggleRules} />}

      {state.status === 'gameover' && (
        <GameOver
          score={state.score}
          level={state.level}
          highScore={highScore}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
