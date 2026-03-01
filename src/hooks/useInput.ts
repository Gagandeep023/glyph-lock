import { useCallback } from 'react';
import type { GameState } from '../types.js';

/**
 * Hook that returns a click handler for canvas grid cells.
 * Converts canvas pixel coordinates to grid row/col.
 */
export function useInput(
  gridSize: number,
  cellSize: number,
  padding: number,
  onCellClick: (row: number, col: number) => void,
) {
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const col = Math.floor((x - padding) / cellSize);
      const row = Math.floor((y - padding) / cellSize);

      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        onCellClick(row, col);
      }
    },
    [gridSize, cellSize, padding, onCellClick],
  );

  return handleCanvasClick;
}
