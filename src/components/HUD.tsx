interface HUDProps {
  level: number;
  score: number;
  lives: number;
  maxLives: number;
  timerRemaining: number;
  timerTotal: number;
  onSubmit: () => void;
  onToggleRules: () => void;
}

export function HUD({
  level,
  score,
  lives,
  maxLives,
  timerRemaining,
  timerTotal,
  onSubmit,
  onToggleRules,
}: HUDProps) {
  const timerPercent = timerTotal > 0 ? (timerRemaining / timerTotal) * 100 : 0;
  const timerColor = timerPercent > 50 ? '#64ffda' : timerPercent > 25 ? '#ffd93d' : '#ff6b6b';

  return (
    <div className="gl-hud">
      <div className="gl-hud-top">
        <div className="gl-hud-stat">
          <span className="gl-hud-label">Level</span>
          <span className="gl-hud-value">{level}</span>
        </div>
        <div className="gl-hud-stat">
          <span className="gl-hud-label">Score</span>
          <span className="gl-hud-value">{score}</span>
        </div>
        <div className="gl-hud-stat">
          <span className="gl-hud-label">Lives</span>
          <span className="gl-hud-value gl-hud-lives">
            {Array.from({ length: maxLives }, (_, i) => (
              <span
                key={i}
                className={i < lives ? 'gl-life-active' : 'gl-life-empty'}
              >
                {i < lives ? '\u2764' : '\u2661'}
              </span>
            ))}
          </span>
        </div>
        <button
          className="gl-rules-btn"
          onClick={onToggleRules}
          title="How to play"
          aria-label="How to play"
        >
          ?
        </button>
      </div>

      <div className="gl-timer-bar">
        <div
          className="gl-timer-fill"
          style={{
            width: `${timerPercent}%`,
            backgroundColor: timerColor,
          }}
        />
      </div>

      <button className="gl-submit-btn" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
}
