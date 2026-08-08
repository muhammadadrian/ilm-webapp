import { useCallback, useEffect, useState } from 'react';
import { demoScreenTimeMs } from './screenTime';
import { demoPoints } from './points';

/**
 * Friends list, persisted to localStorage. There is no backend, so a
 * friend's on-screen time is demo/sample data derived deterministically
 * from their email (see demoScreenTimeMs).
 */

export interface Friend {
  email: string;
  name: string;
  screenTimeMs: number;
  points: number;
}

export const FRIENDS_KEY = 'ilm.friends';

// Simple, permissive email shape check: something@something.tld
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/**
 * Derives a friendly display name from an email local-part,
 * title-cased — e.g. "abu.bakr@x.com" → "Abu Bakr", "fatima@x.com" → "Fatima".
 */
export function nameFromEmail(email: string): string {
  const local = email.trim().split('@')[0] ?? '';
  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.length > 0 ? words.join(' ') : local;
}

function read(): Friend[] {
  try {
    const raw = localStorage.getItem(FRIENDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (f): f is Omit<Friend, 'points'> & { points?: number } =>
          f &&
          typeof f.email === 'string' &&
          typeof f.name === 'string' &&
          typeof f.screenTimeMs === 'number'
      )
      // Backfill demo points for friends persisted before points existed.
      .map((f) => ({
        ...f,
        points: typeof f.points === 'number' ? f.points : demoPoints(f.email),
      }));
  } catch {
    return [];
  }
}

export function useFriends(): {
  friends: Friend[];
  addFriend: (email: string) => string | null;
  removeFriend: (email: string) => void;
} {
  const [friends, setFriends] = useState<Friend[]>(() => read());

  useEffect(() => {
    try {
      localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [friends]);

  /** Returns an error message on failure, or null on success. */
  const addFriend = useCallback((rawEmail: string): string | null => {
    const email = rawEmail.trim().toLowerCase();
    if (!email) return 'Please enter an email address.';
    if (!isValidEmail(email)) return 'Please enter a valid email address.';

    let error: string | null = null;
    setFriends((prev) => {
      if (prev.some((f) => f.email === email)) {
        error = 'That friend has already been added.';
        return prev;
      }
      const friend: Friend = {
        email,
        name: nameFromEmail(email),
        screenTimeMs: demoScreenTimeMs(email),
        points: demoPoints(email),
      };
      return [...prev, friend];
    });
    return error;
  }, []);

  const removeFriend = useCallback((email: string) => {
    setFriends((prev) => prev.filter((f) => f.email !== email));
  }, []);

  return { friends, addFriend, removeFriend };
}
