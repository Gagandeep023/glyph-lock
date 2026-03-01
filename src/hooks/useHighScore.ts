import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'glyph-lock-high-score';

/**
 * Hook that manages the high score in localStorage.
 */
export function useHighScore(): {
  highScore: number;
  updateHighScore: (score: number) => void;
} {
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const updateHighScore = useCallback(
    (score: number) => {
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem(STORAGE_KEY, String(score));
        } catch {
          // localStorage may be unavailable
        }
      }
    },
    [highScore],
  );

  return { highScore, updateHighScore };
}
