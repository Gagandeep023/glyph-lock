# @gagandeep023/glyph-lock

> Decode the pattern. Before it shifts.

A pattern-deduction browser game built with React and Canvas 2D. A grid of cells displays a partial pattern using colors. Deduce the rule governing the pattern, fill in the missing cells, and submit before the timer expires.

## Install

```bash
npm install @gagandeep023/glyph-lock
```

## Usage

```tsx
import { GlyphLockGame } from '@gagandeep023/glyph-lock/frontend';
import '@gagandeep023/glyph-lock/frontend/styles.css';

function App() {
  return <GlyphLockGame />;
}
```

## How it works

- Some cells are revealed following a hidden pattern rule
- Select a color and tap empty cells to fill them
- Submit to check your answer
- Wrong answers cost a life (3 lives total)
- Patterns get more complex as you progress
- Timer decreases each level

## Peer Dependencies

- `react` ^18 || ^19
- `react-dom` ^18 || ^19

## License

MIT
