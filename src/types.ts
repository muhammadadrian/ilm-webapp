export type Category =
  | 'tafsir'
  | 'hadith'
  | 'aqidah'
  | 'adab'
  | 'dua'
  | 'seerah'
  | 'vocab'
  | 'fiqh'
  | 'quote'
  | 'reflection';

/**
 * Topic THEME — a dimension orthogonal to `Category` (content type).
 * A card has exactly one content type (tafsir, hadith, …) AND one topic theme
 * (Stress & sabr, Marriage, …). Themes group cards by life-topic so the feed
 * can be browsed by subject, independent of the content-type filter.
 */
export type Theme =
  | 'stress-sabr'
  | 'marriage'
  | 'rizq'
  | 'productivity'
  | 'parenting'
  | 'youth'
  | 'business-ethics'
  | 'quranic-healing'
  | 'general';

export interface Card {
  id: string;
  category: Category;
  theme: Theme; // topic theme — separate from content-type category
  title: string;
  body: string; // ~1-minute read
  arabic?: string; // optional, RTL
  transliteration?: string;
  translation?: string;
  reference?: string; // e.g. "Quran 94:5-6"
  attribution?: string; // for quotes
  needsReview: boolean; // always true for seed
  sourceNote: string; // what must be verified
}

export interface CategoryMeta {
  key: Category;
  label: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'tafsir', label: 'Tafsir' },
  { key: 'hadith', label: 'Hadith' },
  { key: 'aqidah', label: 'Aqidah' },
  { key: 'adab', label: 'Adab / Reminders' },
  { key: 'dua', label: 'Duas' },
  { key: 'seerah', label: 'Seerah' },
  { key: 'vocab', label: 'Arabic Vocabulary' },
  { key: 'fiqh', label: 'Fiqh' },
  { key: 'quote', label: 'Scholar Quotes' },
  { key: 'reflection', label: 'Reflections' },
];

export const CATEGORY_LABEL: Record<Category, string> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.key] = c.label;
    return acc;
  },
  {} as Record<Category, string>
);

export interface ThemeMeta {
  key: Theme;
  slug: string; // stable slug (same as key)
  label: string;
}

/**
 * The 8 topic themes plus a catch-all "General" for cards that do not fit any
 * single life-topic. Order controls how theme chips render in the UI.
 */
export const THEMES: ThemeMeta[] = [
  { key: 'stress-sabr', slug: 'stress-sabr', label: 'Stress & sabr' },
  { key: 'marriage', slug: 'marriage', label: 'Marriage' },
  { key: 'rizq', slug: 'rizq', label: 'Rizq' },
  { key: 'productivity', slug: 'productivity', label: 'Productivity in Islam' },
  { key: 'parenting', slug: 'parenting', label: 'Parenting' },
  { key: 'youth', slug: 'youth', label: 'Youth' },
  { key: 'business-ethics', slug: 'business-ethics', label: 'Business ethics' },
  { key: 'quranic-healing', slug: 'quranic-healing', label: 'Quranic healing' },
  { key: 'general', slug: 'general', label: 'General' },
];

export const THEME_LABEL: Record<Theme, string> = THEMES.reduce(
  (acc, t) => {
    acc[t.key] = t.label;
    return acc;
  },
  {} as Record<Theme, string>
);
