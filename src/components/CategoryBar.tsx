import { CATEGORIES } from '../types';
import type { Category } from '../types';

interface Props {
  active: Category | 'all';
  onSelect: (c: Category | 'all') => void;
}

export default function CategoryBar({ active, onSelect }: Props) {
  const chips: Array<{ key: Category | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3">
      {chips.map((chip) => {
        const isActive = chip.key === active;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onSelect(chip.key)}
            aria-pressed={isActive}
            className={
              'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ' +
              (isActive
                ? 'bg-white text-emerald-900 shadow'
                : 'bg-white/10 text-white/80 hover:bg-white/20')
            }
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
