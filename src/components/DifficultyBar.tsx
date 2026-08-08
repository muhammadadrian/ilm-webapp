import { DIFFICULTIES } from '../types';
import type { Difficulty } from '../types';

interface Props {
  active: Difficulty | 'all';
  onSelect: (d: Difficulty | 'all') => void;
  /** Optional per-level counts for the current selection (keyed by level + "all"). */
  counts?: Record<string, number>;
}

/**
 * Difficulty filter chip row. Composes with the content-type, topic-theme, and
 * search filters — selecting a level narrows the feed to that difficulty.
 */
export default function DifficultyBar({ active, onSelect, counts }: Props) {
  const chips: Array<{ key: Difficulty | 'all'; label: string }> = [
    { key: 'all', label: 'All levels' },
    ...DIFFICULTIES.map((d) => ({ key: d.key, label: d.label })),
  ];

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
      {chips.map((chip) => {
        const isActive = chip.key === active;
        const count = counts?.[chip.key];
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onSelect(chip.key)}
            aria-pressed={isActive}
            className={
              'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ' +
              (isActive
                ? 'bg-amber-300 text-emerald-950 shadow'
                : 'bg-white/10 text-white/80 hover:bg-white/20')
            }
          >
            {chip.label}
            {typeof count === 'number' && (
              <span className={isActive ? 'text-emerald-900/60' : 'text-white/40'}>
                {' '}
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
