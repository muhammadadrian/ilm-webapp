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

/** The deterministic pick for today from any non-empty list. */
export function dailyPick<T>(items: T[], date: Date = new Date()): T | undefined {
  if (items.length === 0) return undefined;
  return items[dailyIndex(items.length, date)];
}

export function todayLabel(date: Date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
