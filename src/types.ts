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

export interface Card {
  id: string;
  category: Category;
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
