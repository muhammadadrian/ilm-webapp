import { useCallback, useEffect, useRef, useState } from 'react';
import type { Difficulty } from '../types';
import { DIFFICULTY_POINTS } from '../types';

/**
 * Difficulty-weighted "knowledge points" gamification.
 *
 * Reading a card earns points by its difficulty level (Beginner 10,
 * Intermediate 20, Advanced 30 — see DIFFICULTY_POINTS). A card only ever
 * awards once: the ids of already-read cards are tracked in localStorage, and
 * the running total is persisted separately so it survives reloads.
 *
 * "Reading" is defined simply and client-side: the first time a given card is
 * opened / scrolled into view / marked read, its points are awarded.
 */

export const POINTS_KEY = 'ilm.points';
export const READ_KEY = 'ilm.read';

export function readPoints(): number {
  try {
    const raw = localStorage.getItem(POINTS_KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function readReadIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export interface PointsApi {
  /** Running total of knowledge points earned. */
  points: number;
  /** Number of distinct cards read (awarded). */
  readCount: number;
  /** True once the given card id has been read (and thus awarded). */
  hasRead: (id: string) => boolean;
  /**
   * Award points for reading a card, the first time only. Safe to call
   * repeatedly / from multiple cards — subsequent calls for the same id are
   * no-ops. Returns the points awarded (0 if it was already read).
   */
  awardRead: (id: string, difficulty: Difficulty) => number;
}

/**
 * Hook backing the points mechanic. Reads the persisted total + read-id set on
 * mount and keeps them in localStorage as cards are read.
 */
export function usePoints(): PointsApi {
  const [points, setPoints] = useState<number>(() => readPoints());
  // The read-id set lives in a ref (not state) so awardRead has a stable
  // identity and can dedupe synchronously without stale closures.
  const readIdsRef = useRef<Set<string>>(new Set(readReadIds()));
  const [readCount, setReadCount] = useState<number>(
    () => readIdsRef.current.size
  );

  const hasRead = useCallback((id: string) => readIdsRef.current.has(id), []);

  const awardRead = useCallback((id: string, difficulty: Difficulty): number => {
    if (readIdsRef.current.has(id)) return 0;
    const gain = DIFFICULTY_POINTS[difficulty] ?? 0;
    readIdsRef.current.add(id);
    const nextTotal = readPoints() + gain;
    try {
      localStorage.setItem(POINTS_KEY, String(nextTotal));
      localStorage.setItem(
        READ_KEY,
        JSON.stringify([...readIdsRef.current])
      );
    } catch {
      /* ignore quota / privacy-mode errors */
    }
    setPoints(nextTotal);
    setReadCount(readIdsRef.current.size);
    return gain;
  }, []);

  // Keep the total in sync if it was changed elsewhere before this hook mounted.
  useEffect(() => {
    const stored = readPoints();
    if (stored !== points) setPoints(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { points, readCount, hasRead, awardRead };
}

/**
 * Deterministic demo knowledge-point total derived from an email address.
 *
 * There is no backend to fetch a friend's real points, so we hash the email
 * (FNV-1a, matching demoScreenTimeMs) into a stable value between ~50 and
 * ~5,000 points. Deterministic on purpose — the same friend always shows the
 * same total. Never uses Math.random.
 */
export function demoPoints(email: string): number {
  const normalized = email.trim().toLowerCase();
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const positive = hash >>> 0;
  const min = 50;
  const max = 5000;
  // Snap to a multiple of 10 so totals read like real point sums.
  return Math.round((min + (positive % (max - min))) / 10) * 10;
}
