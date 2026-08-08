/**
 * Global, faceted search across BOTH the curated cards (in-bundle) and the
 * 1,896 Riyad us-Salihin hadith (lazy-loaded). This module holds the pure
 * matching logic + the facet definitions; the UI lives in
 * `components/GlobalSearch.tsx`.
 *
 * Five concrete facet modes plus a plain free-text mode:
 *   - all      → free text over title/body/translation/arabic/reference/
 *                narrator/attribution across everything.
 *   - topic    → the 8 existing topic themes; selecting a topic filters to
 *                cards carrying that theme (hadith join only via the query).
 *   - emotion  → curated emotion chips mapped to themes + categories +
 *                keywords (there are NO emotion tags in the data — see EMOTIONS).
 *   - life     → the topic themes that are life issues (marriage, money/rizq,
 *                parenting, youth, business ethics, productivity) plus keyword
 *                matching, so hadith surface too.
 *   - scholar  → free text scoped to narrator (hadith) / attribution (cards).
 *   - quran    → free text scoped to the reference field (e.g. "2:255") and the
 *                verse text across cards + hadith.
 */

import type { Card, Category, Theme } from '../types';
import type { Hadith } from './hadith';

export type Facet = 'all' | 'topic' | 'emotion' | 'life' | 'scholar' | 'quran';

export interface FacetMeta {
  key: Facet;
  label: string;
  /** Short helper text shown under the facet row. */
  hint: string;
}

export const FACETS: FacetMeta[] = [
  { key: 'all', label: 'All', hint: 'Free text across titles, text, translation, Arabic, references, narrators.' },
  { key: 'topic', label: 'Topic', hint: 'Pick one of the 8 topic themes to surface cards on that subject.' },
  { key: 'emotion', label: 'Emotion', hint: 'How are you feeling? Each emotion maps to themes + keywords.' },
  { key: 'life', label: 'Life issue', hint: 'A life-issue-framed entry into the same tagging + keywords.' },
  { key: 'scholar', label: 'Scholar', hint: 'Search by narrator (hadith) or attribution (cards).' },
  { key: 'quran', label: 'Quran verse', hint: 'Enter a reference like 2:255, or words from a verse.' },
];

/**
 * Emotion → content mapping. The dataset has NO emotion tags, so each emotion
 * is expressed as a union of topic themes, content-type categories, and free
 * keywords. A card matches an emotion if its theme OR category is listed OR any
 * keyword appears in its text; a hadith matches on keywords only (hadith carry
 * no theme/category).
 */
export interface EmotionDef {
  key: string;
  label: string;
  emoji: string;
  themes: Theme[];
  categories: Category[];
  keywords: string[];
}

export const EMOTIONS: EmotionDef[] = [
  {
    key: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    themes: ['stress-sabr'],
    categories: [],
    keywords: ['anxiety', 'anxious', 'worry', 'worried', 'fear', 'calm', 'patience', 'ease', 'hardship', 'stress'],
  },
  {
    key: 'grateful',
    label: 'Grateful',
    emoji: '🤲',
    themes: ['rizq'],
    categories: ['reflection'],
    keywords: ['gratitude', 'grateful', 'thankful', 'shukr', 'blessing', 'blessings', 'contentment', 'provision'],
  },
  {
    key: 'angry',
    label: 'Angry',
    emoji: '😤',
    themes: [],
    categories: ['adab'],
    keywords: ['anger', 'angry', 'patience', 'restrain', 'forgive', 'forbear', 'gentle', 'temper', 'calm'],
  },
  {
    key: 'sad',
    label: 'Sad',
    emoji: '😢',
    themes: ['stress-sabr', 'quranic-healing'],
    categories: [],
    keywords: ['grief', 'sorrow', 'sad', 'sadness', 'comfort', 'hope', 'relief', 'healing', 'ease'],
  },
  {
    key: 'hopeful',
    label: 'Hopeful',
    emoji: '🌅',
    themes: ['stress-sabr', 'rizq'],
    categories: [],
    keywords: ['hope', 'mercy', 'ease', 'forgiveness', 'reward', 'paradise', 'relief', 'optimism'],
  },
  {
    key: 'fearful',
    label: 'Fearful',
    emoji: '😨',
    themes: ['stress-sabr'],
    categories: ['aqidah'],
    keywords: ['fear', 'trust', 'tawakkul', 'protect', 'protection', 'refuge', 'calm', 'reliance'],
  },
  {
    key: 'lonely',
    label: 'Lonely',
    emoji: '🕊️',
    themes: [],
    categories: ['dua'],
    keywords: ['lonely', 'alone', 'loneliness', 'remembrance', 'dhikr', 'companionship', 'near', 'solitude'],
  },
];

/**
 * Life-issue → content mapping. Reuses the topic themes that are genuine life
 * issues, each paired with keywords so hadith (which carry no theme) surface
 * for the same life question. Overlaps with Topic on purpose — this is a
 * life-issue-framed entry into the same tagging.
 */
export interface LifeIssueDef {
  key: string;
  label: string;
  emoji: string;
  theme: Theme;
  keywords: string[];
}

export const LIFE_ISSUES: LifeIssueDef[] = [
  {
    key: 'marriage',
    label: 'Marriage',
    emoji: '💍',
    theme: 'marriage',
    keywords: ['marriage', 'marry', 'spouse', 'husband', 'wife', 'married', 'nikah'],
  },
  {
    key: 'money',
    label: 'Money & Rizq',
    emoji: '💰',
    theme: 'rizq',
    keywords: ['money', 'wealth', 'provision', 'sustenance', 'rizq', 'halal', 'spend', 'charity', 'poverty', 'income', 'debt'],
  },
  {
    key: 'parenting',
    label: 'Parenting',
    emoji: '👨‍👩‍👧',
    theme: 'parenting',
    keywords: ['parent', 'parenting', 'child', 'children', 'kids', 'family', 'father', 'mother', 'son', 'daughter'],
  },
  {
    key: 'youth',
    label: 'Youth',
    emoji: '🧑',
    theme: 'youth',
    keywords: ['youth', 'young', 'teenager', 'student', 'identity'],
  },
  {
    key: 'business',
    label: 'Business ethics',
    emoji: '🤝',
    theme: 'business-ethics',
    keywords: ['business', 'trade', 'work', 'honest', 'ethics', 'deal', 'contract', 'fair', 'profit', 'seller', 'buyer'],
  },
  {
    key: 'productivity',
    label: 'Productivity',
    emoji: '⏳',
    theme: 'productivity',
    keywords: ['productivity', 'time', 'discipline', 'habit', 'focus', 'procrastination', 'goal', 'work'],
  },
];

// ── Haystacks (lower-cased once per item at match time) ──
// Exported so the tap-to-explain related-items logic (lib/explain.ts) can reuse
// the exact same field set + normalisation used by global search.

export function cardHaystack(c: Card): string {
  return [c.title, c.body, c.translation, c.transliteration, c.arabic, c.reference, c.attribution]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function hadithHaystack(h: Hadith): string {
  return [h.narrator, h.english, h.arabic, h.reference, h.book.name, h.chapter.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

// ── Unified result shape ──

export type SearchResult =
  | { kind: 'card'; card: Card }
  | { kind: 'hadith'; hadith: Hadith };

/**
 * True when the current facet + query + selection constitutes an "active"
 * search worth loading the hadith collection for.
 */
export function isActiveSearch(facet: Facet, query: string, selection: string | null): boolean {
  if (query.trim().length > 0) return true;
  // Topic/emotion/life become active once a chip is chosen.
  if ((facet === 'topic' || facet === 'emotion' || facet === 'life') && selection) return true;
  return false;
}

/** Match curated cards for the given facet/query/selection. */
export function matchCards(
  cards: Card[],
  facet: Facet,
  query: string,
  selection: string | null
): Card[] {
  const q = query.trim().toLowerCase();
  switch (facet) {
    case 'topic': {
      let res = selection ? cards.filter((c) => c.theme === (selection as Theme)) : [];
      if (q) res = res.filter((c) => cardHaystack(c).includes(q));
      return res;
    }
    case 'emotion': {
      const def = EMOTIONS.find((e) => e.key === selection);
      if (!def) return q ? cards.filter((c) => cardHaystack(c).includes(q)) : [];
      let res = cards.filter((c) => {
        const hay = cardHaystack(c);
        return (
          def.themes.includes(c.theme) ||
          def.categories.includes(c.category) ||
          def.keywords.some((k) => hay.includes(k))
        );
      });
      if (q) res = res.filter((c) => cardHaystack(c).includes(q));
      return res;
    }
    case 'life': {
      const def = LIFE_ISSUES.find((l) => l.key === selection);
      if (!def) return q ? cards.filter((c) => cardHaystack(c).includes(q)) : [];
      let res = cards.filter((c) => {
        const hay = cardHaystack(c);
        return c.theme === def.theme || def.keywords.some((k) => hay.includes(k));
      });
      if (q) res = res.filter((c) => cardHaystack(c).includes(q));
      return res;
    }
    case 'scholar': {
      if (!q) return [];
      return cards.filter((c) => (c.attribution ?? '').toLowerCase().includes(q));
    }
    case 'quran': {
      if (!q) return [];
      return cards.filter(
        (c) => (c.reference ?? '').toLowerCase().includes(q) || cardHaystack(c).includes(q)
      );
    }
    case 'all':
    default:
      return q ? cards.filter((c) => cardHaystack(c).includes(q)) : [];
  }
}

/** Match hadith for the given facet/query/selection. */
export function matchHadith(
  hadiths: Hadith[],
  facet: Facet,
  query: string,
  selection: string | null
): Hadith[] {
  const q = query.trim().toLowerCase();
  switch (facet) {
    case 'topic': {
      // Hadith carry no theme; they join a topic search only via the query.
      return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
    }
    case 'emotion': {
      const def = EMOTIONS.find((e) => e.key === selection);
      if (!def) return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
      let res = hadiths.filter((h) => {
        const hay = hadithHaystack(h);
        return def.keywords.some((k) => hay.includes(k));
      });
      if (q) res = res.filter((h) => hadithHaystack(h).includes(q));
      return res;
    }
    case 'life': {
      const def = LIFE_ISSUES.find((l) => l.key === selection);
      if (!def) return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
      let res = hadiths.filter((h) => {
        const hay = hadithHaystack(h);
        return def.keywords.some((k) => hay.includes(k));
      });
      if (q) res = res.filter((h) => hadithHaystack(h).includes(q));
      return res;
    }
    case 'scholar': {
      if (!q) return [];
      return hadiths.filter((h) => h.narrator.toLowerCase().includes(q));
    }
    case 'quran': {
      if (!q) return [];
      return hadiths.filter(
        (h) => h.reference.toLowerCase().includes(q) || hadithHaystack(h).includes(q)
      );
    }
    case 'all':
    default:
      return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
  }
}

/** Short plain-text snippet for a result row. */
export function excerpt(text: string, max = 140): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + '…';
}
