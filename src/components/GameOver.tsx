interface GameOverProps {
  score: number;
  level: number;
  highScore: number;
  onRetry: () => void;
}

export function GameOver({ score, level, highScore, onRetry }: GameOverProps) {
  const isNewBest = score >= highScore && score > 0;

  return (
    <div className="gl-gameover-overlay">
      <div className="gl-gameover-panel">
        <h2 className="gl-gameover-title">Game Over</h2>

        {isNewBest && <p className="gl-gameover-best">New High Score!</p>}

        <div className="gl-gameover-stats">
          <div className="gl-gameover-stat">
            <span className="gl-gameover-label">Grids Solved</span>
            <span className="gl-gameover-value">{score}</span>
          </div>
          <div className="gl-gameover-stat">
            <span className="gl-gameover-label">Level Reached</span>
            <span className="gl-gameover-value">{level}</span>
          </div>
          <div className="gl-gameover-stat">
            <span className="gl-gameover-label">Best Score</span>
            <span className="gl-gameover-value">{Math.max(score, highScore)}</span>
          </div>
        </div>

        <button className="gl-retry-btn" onClick={onRetry}>
          Play Again
        </button>
      </div>
    </div>
  );
}
