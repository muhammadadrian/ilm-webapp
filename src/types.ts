/**
 * Content difficulty level. Drives the difficulty badge, the feed's difficulty
 * filter, and difficulty-weighted knowledge points. Every hadith is assigned a
 * difficulty by a deterministic load-time heuristic (see lib/hadith.ts).
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DifficultyMeta {
  key: Difficulty;
  label: string;
}

/** The three difficulty levels, in ascending order (drives chip order). */
export const DIFFICULTIES: DifficultyMeta[] = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = DIFFICULTIES.reduce(
  (acc, d) => {
    acc[d.key] = d.label;
    return acc;
  },
  {} as Record<Difficulty, string>
);

/** Tailwind classes for the difficulty badge, one palette per level. */
export const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  beginner: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
  intermediate: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300',
  advanced: 'bg-rose-100 text-rose-800 ring-1 ring-rose-300',
};

/**
 * Difficulty-weighted "knowledge points" earned for reading a hadith of each
 * level. Harder content is worth more. Used by the gamification mechanic.
 */
export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  beginner: 10,
  intermediate: 20,
  advanced: 30,
};
