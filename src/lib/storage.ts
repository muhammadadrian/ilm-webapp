import { useCallback, useEffect, useState } from 'react';

/**
 * A tiny hook that persists a Set<string> of ids to localStorage.
 * Used for saved (bookmarked) and liked card ids.
 */
export function usePersistentSet(key: string): {
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  ids: string[];
  count: number;
} {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [key, ids]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  return { has, toggle, ids, count: ids.length };
}

/**
 * Persists a single boolean flag to localStorage.
 * Used to gate the login / onboarding / feed stages.
 */
export function usePersistentFlag(
  key: string
): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      return localStorage.getItem(key) === '1';
    } catch {
      return false;
    }
  });

  const set = useCallback(
    (next: boolean) => {
      setValue(next);
      try {
        if (next) localStorage.setItem(key, '1');
        else localStorage.removeItem(key);
      } catch {
        /* ignore quota / privacy-mode errors */
      }
    },
    [key]
  );

  return [value, set];
}

/**
 * Persists a single number to localStorage (e.g. a volume preference).
 * Falls back to `fallback` when nothing is stored or parsing fails.
 */
export function usePersistentNumber(
  key: string,
  fallback: number
): [number, (value: number) => void] {
  const [value, setValue] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    } catch {
      return fallback;
    }
  });

  const set = useCallback(
    (next: number) => {
      setValue(next);
      try {
        localStorage.setItem(key, String(next));
      } catch {
        /* ignore quota / privacy-mode errors */
      }
    },
    [key]
  );

  return [value, set];
}

/**
 * Persists a single string to localStorage (e.g. a display name or bio).
 * Falls back to `fallback` when nothing is stored or reading fails.
 */
export function usePersistentString(
  key: string,
  fallback = ''
): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : raw;
    } catch {
      return fallback;
    }
  });

  const set = useCallback(
    (next: string) => {
      setValue(next);
      try {
        if (next === '') localStorage.removeItem(key);
        else localStorage.setItem(key, next);
      } catch {
        /* ignore quota / privacy-mode errors */
      }
    },
    [key]
  );

  return [value, set];
}

const DISMISS_KEY = 'ilm.banner.dismissed';

export function useDismissible(key: string = DISMISS_KEY): {
  dismissed: boolean;
  dismiss: () => void;
} {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(key) === '1';
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(key, '1');
    } catch {
      /* ignore */
    }
  }, [key]);

  return { dismissed, dismiss };
}
