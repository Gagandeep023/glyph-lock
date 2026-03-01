import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook that runs a game loop calling onTick with delta time in seconds.
 * Only runs when active is true.
 */
export function useGameLoop(
  onTick: (delta: number) => void,
  active: boolean,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const loop = useCallback((timestamp: number) => {
    if (lastTimeRef.current !== null) {
      const delta = (timestamp - lastTimeRef.current) / 1000;
      // Cap delta to avoid huge jumps (e.g., tab was hidden)
      onTickRef.current(Math.min(delta, 0.5));
    }
    lastTimeRef.current = timestamp;
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (active) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [active, loop]);
}
