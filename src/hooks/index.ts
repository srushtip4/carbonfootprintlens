import { useState, useEffect, useCallback } from 'react';
import { type Route, ROUTES } from '../constants';

/**
 * Subscribe to SPA navigation events and expose current page + navigate function.
 */
export function useNavigation(defaultPage: Route | string = ROUTES.EDUCATION) {
  const [currentPage, setCurrentPage] = useState<string>(defaultPage);

  useEffect(() => {
    const handler = (e: Event) => setCurrentPage((e as CustomEvent).detail);
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  const navigate = useCallback((page: string) => setCurrentPage(page), []);

  return { currentPage, navigate };
}

/**
 * Track whether a key is currently pressed (for keyboard-driven UIs).
 */
export function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === targetKey) setPressed(true); };
    const up = (e: KeyboardEvent) => { if (e.key === targetKey) setPressed(false); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [targetKey]);

  return pressed;
}
