import { useEffect, useRef, useState } from 'react';

/**
 * On-screen (active) time tracking for the current user.
 *
 * Time is only accumulated while the tab is actually visible
 * (Page Visibility API). Elapsed milliseconds are flushed to
 * localStorage on a periodic tick and whenever the page is hidden,
 * blurred, or about to unload, so the total survives reloads.
 */

export const SCREEN_TIME_KEY = 'ilm.screenTimeMs';

const TICK_MS = 5000;

export function readScreenTimeMs(): number {
  try {
    const raw = localStorage.getItem(SCREEN_TIME_KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeScreenTimeMs(ms: number): void {
  try {
    localStorage.setItem(SCREEN_TIME_KEY, String(Math.round(ms)));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/**
 * Tracks the current user's active on-screen time.
 *
 * Pass `enabled = true` only once the user has reached the feed
 * (post-onboarding) so login / onboarding time is not counted.
 * Returns the running total in milliseconds, updated on each tick.
 */
export function useScreenTime(enabled: boolean): number {
  const [ms, setMs] = useState<number>(() => readScreenTimeMs());
  // Timestamp (ms) of the last moment we started/continued counting,
  // or null when we are currently paused (hidden / blurred).
  const anchorRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const accumulate = (): void => {
      if (anchorRef.current === null) return;
      const now = Date.now();
      const delta = now - anchorRef.current;
      anchorRef.current = now;
      if (delta > 0) {
        const next = readScreenTimeMs() + delta;
        writeScreenTimeMs(next);
        setMs(next);
      }
    };

    const start = (): void => {
      if (document.visibilityState === 'visible' && anchorRef.current === null) {
        anchorRef.current = Date.now();
      }
    };

    // Fold elapsed time into the total and stop counting.
    const pause = (): void => {
      accumulate();
      anchorRef.current = null;
    };

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') start();
      else pause();
    };

    start();
    const interval = window.setInterval(accumulate, TICK_MS);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', start);
    window.addEventListener('blur', pause);
    window.addEventListener('beforeunload', pause);

    return () => {
      pause();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', start);
      window.removeEventListener('blur', pause);
      window.removeEventListener('beforeunload', pause);
    };
  }, [enabled]);

  return ms;
}

/**
 * Formats a duration (ms) as days / hours / minutes at minute
 * granularity — e.g. "1d 3h 12m", "3h 12m", "12m", "0m".
 */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  // Always show minutes so a fresh user reads "0m", not an empty string.
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

/**
 * Deterministic demo on-screen time derived from an email address.
 *
 * There is no backend to fetch a friend's real usage, so we hash the
 * email (FNV-1a) into a stable value between ~10 minutes and ~3 days.
 * Deterministic on purpose — the same friend always shows the same
 * time. Never uses Math.random.
 */
export function demoScreenTimeMs(email: string): number {
  const normalized = email.trim().toLowerCase();
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const positive = hash >>> 0;
  const min = 10 * 60 * 1000; // 10 minutes
  const max = 3 * 24 * 60 * 60 * 1000; // 3 days
  return min + (positive % (max - min));
}
