import { useRef, useEffect } from 'react';
import type { Grid } from '../types.js';
import { COLORS, THEME } from '../engine/constants.js';
import { useInput } from '../hooks/useInput.js';

interface GameGridProps {
  grid: Grid;
  onCellClick: (row: number, col: number) => void;
}

const CELL_SIZE = 60;
const CELL_GAP = 4;
const CELL_RADIUS = 6;
const PADDING = 12;
const DOT_RADIUS = 4;

export function GameGrid({ grid, onCellClick }: GameGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellTotalSize = CELL_SIZE + CELL_GAP;
  const canvasSize = PADDING * 2 + grid.size * cellTotalSize - CELL_GAP;

  const handleClick = useInput(grid.size, cellTotalSize, PADDING, onCellClick);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let row = 0; row < grid.size; row++) {
      for (let col = 0; col < grid.size; col++) {
        const cell = grid.cells[row][col];
        const x = PADDING + col * cellTotalSize;
        const y = PADDING + row * cellTotalSize;

        // Rounded rectangle
        ctx.beginPath();
        ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);

        if (cell.flashWrong) {
          // Flash wrong cells red
          ctx.fillStyle = THEME.wrong;
          ctx.fill();
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (cell.color !== null) {
          // Filled cell
          const colorDef = COLORS[cell.color % COLORS.length];
          ctx.fillStyle = colorDef.hex;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw dot indicator for player-filled cells
          if (cell.playerFilled) {
            ctx.beginPath();
            ctx.arc(
              x + CELL_SIZE / 2,
              y + CELL_SIZE / 2,
              DOT_RADIUS,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = THEME.playerDot;
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        } else {
          // Empty cell
          ctx.fillStyle = THEME.cellEmpty;
          ctx.fill();
          ctx.strokeStyle = THEME.cellBorder;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }
  }, [grid]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      onClick={handleClick}
      className="gl-grid-canvas"
      style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
    />
  );
}
