import type { Card } from '../types';

/**
 * Deterministic "today's pick".
 * Derives a stable index from the current date (YYYY-MM-DD) so the pick does
 * not change within a day and never relies on Math.random.
 */
export function dailyIndex(count: number, date: Date = new Date()): number {
  if (count <= 0) return 0;
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Simple stable hash of the date number.
  const dayNumber = y * 10000 + m * 100 + d;
  return dayNumber % count;
}

export function dailyPick(cards: Card[], date: Date = new Date()): Card | undefined {
  if (cards.length === 0) return undefined;
  return cards[dailyIndex(cards.length, date)];
}

export function todayLabel(date: Date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
