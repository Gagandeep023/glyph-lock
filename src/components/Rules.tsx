interface RulesProps {
  onClose: () => void;
}

export function Rules({ onClose }: RulesProps) {
  return (
    <div className="gl-rules-overlay" onClick={onClose}>
      <div className="gl-rules-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="gl-rules-title">Glyph Lock</h2>
        <p className="gl-rules-tagline">Decode the pattern. Before it shifts.</p>

        <div className="gl-rules-section">
          <h3>Goal</h3>
          <p>Decode the hidden pattern and fill in the missing cells.</p>
        </div>

        <div className="gl-rules-section">
          <h3>Rules</h3>
          <ol className="gl-rules-list">
            <li>Some cells are revealed. They follow a hidden pattern rule.</li>
            <li>Select a color and tap empty cells to fill them.</li>
            <li>When all cells are filled, hit Submit to check.</li>
            <li>Wrong answers cost a life. Three strikes and you are out.</li>
            <li>Patterns get more complex as you progress.</li>
          </ol>
        </div>

        <div className="gl-rules-section">
          <h3>Tip</h3>
          <p>
            Look for repetition. Most patterns repeat across rows, columns, or
            diagonals.
          </p>
        </div>

        <button className="gl-rules-close" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
