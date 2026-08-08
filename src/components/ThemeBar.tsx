import { THEMES } from '../types';
import type { Theme } from '../types';

interface Props {
  active: Theme | 'all';
  onSelect: (t: Theme | 'all') => void;
  /** Optional per-theme counts for the current (search-filtered) deck. */
  counts?: Record<string, number>;
}

/**
 * Topic-theme chip row. Lets the feed be browsed by life-topic
 * (Stress & sabr, Marriage, Rizq, …) independent of the content-type filter.
 */
export default function ThemeBar({ active, onSelect, counts }: Props) {
  const chips: Array<{ key: Theme | 'all'; label: string }> = [
    { key: 'all', label: 'All topics' },
    ...THEMES.map((t) => ({ key: t.key, label: t.label })),
  ];

  return (
    <div
      className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2 pt-1"
      role="group"
      aria-label="Filter by topic theme"
    >
      {chips.map((chip) => {
        const isActive = chip.key === active;
        const n = counts ? counts[chip.key] : undefined;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onSelect(chip.key)}
            aria-pressed={isActive}
            className={
              'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ' +
              (isActive
                ? 'bg-amber-200 text-emerald-950 shadow'
                : 'bg-white/10 text-white/80 ring-1 ring-white/15 hover:bg-white/20')
            }
          >
            {chip.label}
            {typeof n === 'number' && n > 0 && (
              <span className={isActive ? 'ml-1 text-emerald-900/60' : 'ml-1 text-white/40'}>
                {n}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
